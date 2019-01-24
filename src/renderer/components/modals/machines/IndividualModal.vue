<template>
  <Modal id="individual-modal" v-model="isVisible" @on-visible-change="visibleChange" :mask-closable="false"
    :footer-hide="true" width="1000" :closable="true">
    <p slot="header">
      <Icon type="md-contact" />
      <span style="font-weight:normal;">移除个别人员</span>
    </p>
    <div>
      <p style="margin:0 auto 20px auto;width:95%;">
        <Input placeholder="请输入身份证或姓名查询" style="width:300px;margin:0 10px 0 0;" clearable v-model="keyword" />
        <Button shape="circle" icon="md-search" class="btn" @click="refreshList(1)">查询</Button>
      </p>
      <p style="margin:0 auto 20px auto;width:95%;">
        <Table border :columns="columns" :data="arr" ref="selectedWorkers" width="100%" size="small">
          <template slot-scope="{row}" slot="action">
            <Button type="error" shape="circle" size="small" @click="del(row)" icon="md-close">移除</Button>
          </template>
        </Table>
      </p>
      <p style="margin:0 auto 20px auto;width:95%;text-align:right;">
        <Page :current="current" :total="total" show-total @on-change="refreshList" :page-size="pagesize" />
      </p>
    </div>
  </Modal>
</template>
<script>
  import settingsRepository from '@/repositories/settingsRepository'
  export default {
    name: 'individual-modal',
    props: ['machinesellist'],
    computed: {
      isVisible: {
        get() {
          return this.$store.state.modals.individualModal.isVisible
        },
        set(value) {

        }
      }
    },
    data() {
      return {
        keyword: '',
        current: 1,
        total: 0,
        pagesize: 10,
        arr: [],
        columns: [{
            type: 'index',
            width: 60,
            align: 'center',
            title: '序号'
          },
          {
            title: '身份证号',
            key: 'userId'
          },
          {
            title: '姓名',
            key: 'name'
          },
          {
            title: '识别算法版本',
            width: 110,
            key: 'algedition'
          },
          {
            title: 'IP',
            width: 140,
            key: 'ip'
          },
          {
            title: '设备名称',
            width: 160,
            key: 'machine'
          },
          {
            title: '所属项目',
            key: 'proname'
          },
          {
            title: '操作',
            slot: 'action',
            align: 'center'
          }
        ]
      }
    },
    mounted() {
      this.refreshList(1)
    },
    methods: {
      refreshList(number) {
        var that = this
        if (typeof that.$store.state.modals.login.projectId
          .id === 'undefined')
          return

        that.$workersMysqlRepo.getWorkers(that.keyword, that.$store.state.modals.login.projectId.id, number, that
          .pagesize).then((res) => {
          if (res.results) {
            res.results.forEach(function (v, i, a) {
              a[i].algedition = that.machinesellist[0].algedition
              a[i].machine = that.machinesellist[0].name
              a[i].ip = that.machinesellist[0].ip
              a[i].port = that.machinesellist[0].port
              a[i].proname = that.$store.state.modals.login.projectId.name
            })
          }
          that.arr = res.results
        }).then(() => {
          that.$workersMysqlRepo.getWorkersCount(that.keyword, that.$store.state.modals.login.projectId.id).then((
            data) => {
            console.log('getCommandsCount = ', data)
            that.total = data.results[0].num
          }).catch((err) => {
            console.log('getCommandsCount Error: ', err)
          })
        }).catch((err) => {
          console.log('getCommands Error: ', err)
        })
      },
      visibleChange(isVisible) {
        if (!isVisible) {
          this.closeModal()
        } else {
          this.refreshList(1)
        }
      },
      closeModal() {
        this.current = 1
        this.$store.dispatch('hideIndividualModal')
      },
      del(row) {
        console.log('row = ', row)
        var that = this
        that.$Modal.confirm({
          title: '确认',
          content: `<p>确认移除人员 ${row.userId} ${row.name}？</p>`,
          onOk: () => {
            that.rowdel(row)
          }
        })
      },
      rowdel(row) {
        var postdata = `DeleteEmployee(id="${row.userId}")`
        var net = require('net')
        var iconv = require('iconv-lite')
        var client = new net.Socket()
        var receive = ''
        var that = this
        var sock = client.connect(row.port, row.ip, function () {
          sock.write(iconv.encode(postdata, 'GBK'))
          // 向端口写入数据到达服务端
          sock.end()
        })
        sock.setTimeout(5000)
        sock.on('data', function (data) {
          receive += iconv.decode(data, 'GBK')
        })
        sock.on('end', function () {
          console.log('receive = ', receive)
          if (receive.indexOf('Return(result="success"') !== -1) {
            var moment = require('moment')
            var datenow = moment().format("YYYY-MM-DD HH:mm:ss")
            var commandsdata = {
              machinesn: that.machinesellist[0].sn,
              projectid: that.$store.state.modals.login.projectId.id,
              createdate: datenow,
              executedate: datenow,
              commandtype: '移除个别人员',
              commandcontent: postdata,
              commandresponse: receive,
              resulttype: 1
            }
            that.commandInsert(commandsdata, row.name)
          }
          if (receive.indexOf('Return(result="failed" reason="unknown id")') !== -1) {
            var moment = require('moment')
            var datenow = moment().format("YYYY-MM-DD HH:mm:ss")
            var commandsdata = {
              machinesn: that.machinesellist[0].sn,
              projectid: that.$store.state.modals.login.projectId.id,
              createdate: datenow,
              executedate: datenow,
              commandtype: '移除个别人员',
              commandcontent: postdata,
              commandresponse: receive,
              resulttype: 2,
              commandext: `人员${row.userId} ${row.name}不存在!`
            }
            that.commandInsert(commandsdata, row.name)
            that.$Notice.error({
              title: '提醒',
              desc: `人员${row.userId} ${row.name}不存在!`
            })
          }
          sock.destroy()
        })
      },
      commandInsert(data, indiv) {
        var that = this
        var log = settingsRepository.getUserlog()

        data.commandfrom = log.username
        that.$commandRepo.create(data).then((res) => {
          if (res.results.insertId > 0) {
            that.$Notice.success({
              title: '提醒',
              desc: '新增命令记录成功'
            })
            
          } else {
            that.$Notice.error({
              title: '提醒',
              desc: '新增命令记录失败'
            })
            
          }
        }).catch((err) => {
          that.$Notice.error({
            title: '提醒',
            desc: '新增命令记录异常'
          })
        })
      }
    }
  }

</script>
