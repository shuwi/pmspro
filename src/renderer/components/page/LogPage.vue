<template id="log-page">
  <div style="width:100vw;">
    <div style="margin:90px auto 20px auto;width:95%;">
      <Input placeholder="请输入关键字查询" style="width:300px;margin:0 10px 0 0;" clearable v-model="logkeyword" />
      <Button shape="circle" icon="md-search" class="btn" @click="logsearch">查询</Button>
      <Button shape="circle" icon="md-download" class="btn" @click="populate" type="info">导出</Button>
      <Button shape="circle" icon="md-add" class="btn" @click="showLogModal" type="warning">补录</Button>
    </div>
    <div style="margin:0 auto 20px auto;width:95%;">
      <Table border width="100%" size="small" ref="logs" :columns="logcolumns" :data="logdata">
        <template slot-scope="{row}" slot="action">
          <Button size="small" @click="imgshow(row)" icon="ios-search"></Button>
        </template>
      </Table>
    </div>
    <div style="margin:0 auto 120px auto;width:95%;">
      <Page :current="logcurrent" :total="logtotal" show-total style="float:right;" @on-change="loglistChange"
        :page-size="logpagesize" />
    </div>
    <log-modal @reloadPage="logsearch"></log-modal>
  </div>
</template>
<script>
  import LogModal from '../modals/logs/LogModal.vue'
  import {
    mapActions
  } from 'vuex'
  export default {
    name: "log-page",
    components: {
      LogModal
    },
    data() {
      return {
        logcurrent: 1,
        logtotal: 0,
        logpagesize: 10,
        logkeyword: '',
        logcolumns: [{
            type: 'index',
            width: 60,
            align: 'center',
            title: '序号'
          },
          {
            title: '姓名',
            key: 'userName'
          },
          {
            title: '身份证',
            width: 165,
            key: 'userId'
          },
          {
            title: '手机号',
            key: 'mobile'
          },
          {
            title: '班组',
            key: 'groupName'
          },
          {
            title: '工种',
            key: 'workKindName'
          },
          {
            title: '考勤设备',
            width: 165,
            key: 'machinesn'
          },
          {
            title: '设备名称',
            key: 'mName'
          },
          {
            title: '设备类型',
            key: 'type',
            render: (h, params) => {
              return h('div', [
                h('span', {
                  props: {

                  }
                }),
                this.machineType(params.row.type)
              ])
            }
          },
          {
            title: '考勤时间',
            width: 160,
            key: 'time'
          },
          {
            title: '现场实时照片',
            slot: 'action',
            align: 'center'
          }
        ],
        logdata: []
      }
    },
    created() {
      this.loglistChange(1)
    },
    methods: {
       ...mapActions([
        'showLogModal',
        'hideLogModal'
      ]),
      machineType(type) {
        var res = '其他'
        switch (type) {
          case 1:
            res = '录入'
            break
          case 2:
            res = '进门'
            break
          case 3:
            res = '出门'
            break

        }
        return res
      },
      imgshow(row) {
        this.$Modal.info({
          title: '<span style="font-size:14px;">现场图片</span>',
          content: `<div style="margin:0 auto;"><img src="data:image/jpeg;base64,${row.photo}" width="160px" style="text-align:center;"></div>`,
          width: 280
        })
      },
      logsearch() {
        var that = this
        var k = that.logkeyword
        that.$logsRepo.getLogsCount(k, that.$store.state.modals.login.projectId.id).then((data) => {
          that.logtotal = data.results[0].num
        }).then(() => that.$logsRepo.getLogs(k, 1, that.logpagesize, that.$store.state.modals.login.projectId.id)).then(
          (list) => {
            that.logdata = list.results
          }).catch((err) => {
          console.log(err)
        })
      },
      loglistChange(number) {
        var that = this
        that.$logsRepo.createTable().then(() => {
          if (typeof that.$store.state.modals.login.projectId.id !== 'undefined')
            that.$logsRepo.getLogsCount(that.logkeyword, that.$store.state.modals.login.projectId.id).then((data) => {
              that.logtotal = data.results[0].num
            }).then(() => that.$logsRepo.getLogs(that.logkeyword, number, that.logpagesize, that.$store.state.modals
              .login.projectId.id)).then((list) => {
              that.logdata = list.results
            }).catch((err) => {
              console.log(err)
            }).finally(() => {
              if (typeof that.$store.state.modals.login.projectId.id !== 'undefined')
                that.$logsRepo.getUploadLogs(that.$store.state.modals.login.projectId.id).then((res) => {
                  if (res.results.length > 0) {
                    var ddd = []
                    var ids = []
                    res.results.forEach(function (v, i, a) {
                      var data = {
                        idCard: v.idCard,
                        snId: v.snId,
                        ngProjectId: v.ngProjectId,
                        time: v.time,
                        type: v.type,
                        photo: v.photo,
                        lablorId: v.lablorId,
                        delFlag: 1,
                        type: v.posttype === 0 ? '00' : '01',
                        record: a[res.results.length - 1].lablorId
                      }
                      ddd.push(data)
                      ids.push(v.lablorId)
                    })
                    if (ddd.length > 0)
                      that.$http({
                        baseURL: that.$store.state.modals.settings.baseURL,
                        url: '/addClientRecord.whtml',
                        data: {
                          clientRecord: JSON.stringify(ddd)
                        },
                        method: 'post',
                        headers: {
                          'Content-Type': 'application/json',
                          'token': that.$store.state.modals.login.token
                        }
                      })
                      .then(function (data) {
                        if (data.data.code === 1 && data.data.record === res.results[res.results.length - 1].lablorId) {
                          that.$logsRepo.uploaded(ids).then((res) => {
                            console.log('本地考勤记录更新结果', res)
                          })
                        }
                        console.log('批量传送考勤记录结果：', data)
                      })
                      .catch(function (error) {
                        console.log(error)
                      })
                  }

                })
            })
        }).catch((err) => {
          console.log(err)
        })
      },
      populate() {
        this.$refs.logs.exportCsv({
          filename: '考勤记录',
          columns: this.logcolumns.filter((col, index) => index < 9 && index > 0),
          data: this.logdata
        })
      }
    }
  }

</script>
