<template>
  <Modal id="removal-modal" v-model="isVisible" @on-visible-change="visibleChange" :mask-closable="false" :footer-hide="true"
    width="950" :closable="true">
    <p slot="header">
      <Icon type="md-archive" />
      <span style="font-weight:normal;">手动下发人员信息</span>
      <span style="font-weight:normal;font-size:12px;color:green;">单击人员列表所在行即可下发</span>
    </p>
    <div>
      <p style="margin:0 auto 20px auto;width:95%;">
        <Table border :columns="workerColumns" :data="workersArr" ref="selectedWorkers" width="100%" size="small"
          @on-row-click="rowClick"></Table>
      </p>
      <p style="margin:0 auto 20px auto;width:95%;text-align:right;">
        <Page :current="current" :total="total" show-total @on-change="refreshList" :page-size="pagesize" />
      </p>
    </div>
  </Modal>
</template>
<script>
  import settingsRepository from '@/repositories/settingsRepository'
  import socketRepository from '@/repositories/socketRepository'
  const Promise = require('bluebird')
  export default {
    name: 'removal-modal',
    props: ['machinesellist'],
    computed: {
      isVisible: {
        get() {
          return this.$store.state.modals.removal.isVisible
        },
        set(value) {

        }
      }
    },
    data() {
      return {
        current: 1,
        total: 0,
        pagesize: 10,
        workerslist: [],
        workersArr: [],
        workerColumns: [{
            type: 'index',
            width: 60,
            align: 'center',
            title: '序号'
          },
          {
            title: '身份证号',
            width: 165,
            key: 'userId'
          },
          {
            title: '姓名',
            width: 80,
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
        if (typeof that.machinesellist[0] === 'undefined')
          return
        that.$workersMysqlRepo.getRemovals(that.$store.state.modals.login.projectId.id, typeof number === 'undefined' ?
          1 : number, that.pagesize).then((res) => {

          if (res.results) {
            res.results.forEach(function (v, i, a) {
              a[i].algedition = that.machinesellist[0].algedition
              a[i].machine = that.machinesellist[0].name
              a[i].ip = that.machinesellist[0].ip
              a[i].port = that.machinesellist[0].port
              a[i].proname = that.$store.state.modals.login.projectId.name
            })
          }
          that.workersArr = res.results
        }).then(() => {
          that.$workersMysqlRepo.getRemovalsNum(that.$store.state.modals.login.projectId.id).then((data) => {
            console.log('getRemovalsNum = ', data)
            that.total = data.results[0].num
          }).catch((err) => {
            console.log('getRemovalsNum Error: ', err)
          })
        }).catch((err) => {
          console.log('getRemovals Error: ', err)
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
        this.$store.dispatch('hideRemovalModal')
      },
      rowClick(row, index) {
        var postdata = row.machinepost.replace(/Return/g, 'SetEmployee').replace('result="success" ', '')
        var that = this
        var req = {
          ip: row.ip,
          port: row.port,
          postdata: postdata
        }

        Promise.race([socketRepository.socketPromise(req)]).then((res) => {
          that.$Spin.show()
          if (res.results) {
            var receive = res.results
            if (receive.indexOf('Return(result="success"') !== -1) {
              var moment = require('moment')
              var datenow = moment().format("YYYY-MM-DD HH:mm:ss")
              var commandsdata = {
                machinesn: that.machinesellist[0].sn,
                projectid: that.$store.state.modals.login.projectId.id,
                createdate: datenow,
                executedate: datenow,
                commandtype: '手动下发人员信息',
                commandcontent: postdata,
                commandresponse: receive,
                resulttype: 1
              }
              that.commandInsert(commandsdata, row.name)
            } else {
              that.$Notice.error({
                title: '提醒',
                desc: '手动下发人员信息失败'
              })
            }
          }
        }).catch((err) => {
          that.$Notice.error({
            title: '提醒',
            desc: err
          })
        }).finally(() => {
          that.$Spin.hide()
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
            that.$Notice.success({
              title: '提醒',
              desc: `手动下发人员${indiv}成功`
            })
          } else {
            that.$Notice.error({
              title: '提醒',
              desc: '新增命令记录失败'
            })
            that.$Notice.error({
              title: '提醒',
              desc: `手动下发人员${indiv}失败`
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
