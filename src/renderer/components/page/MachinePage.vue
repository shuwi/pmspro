<template id="machine-page">
  <div style="width:100vw;">
    <div style="margin:90px auto 20px auto;width:95%;">
      <Button shape="circle" icon="md-add" class="btn" type="primary" @click="showMachineInfo">添加设备</Button>
      <Button shape="circle" icon="md-create" class="btn" type="warning" @click="editMachineInfo">修改设备</Button>
      <Button shape="circle" icon="md-close" class="btn" type="error" @click="delMachineInfoDialog">删除设备</Button>
      <Button shape="circle" icon="ios-refresh" class="btn" type="info" @click="refreshMachineList">刷新列表</Button>

      <Dropdown style="margin-left: 20px" @on-click="machineop" trigger="click">
        <Button shape="circle">
          考勤机操作
          <Icon type="ios-arrow-down" style="margin-left:6px;"></Icon>
        </Button>
        <DropdownMenu slot="list">
          <DropdownItem name="RestartDevice()">重启设备</DropdownItem>
          <DropdownItem divided name="refresh">同步设备时间</DropdownItem>
          <DropdownItem name="GetDeviceInfo()">获取设备信息</DropdownItem>
          <DropdownItem name="DeleteAllRecord()">清空考勤记录</DropdownItem>
          <DropdownItem name="delone">移除个别人员</DropdownItem>
          <DropdownItem name="DeleteAllEmployee()">删除所有人员</DropdownItem>
          <DropdownItem name='Removal()'>手动下发人员信息</DropdownItem>
          <DropdownItem divided name="history">历史命令查询</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
    <div style="margin:0 auto 20px auto;width:95%;">
      <Table border width="100%" size="small" ref="selectedMachines" :columns="mcolumns" :data="mdata"
        @on-selection-change="machinesel">
      </Table>
    </div>
    <div style="margin:0 auto 120px auto;width:95%;">
      <Button @click="handleSelectAllMachines(true)" shape="circle" style="width:100px;" icon="md-checkmark">全选</Button>
      <Button @click="handleSelectAllMachines(false)" shape="circle" style="width:100px;" icon="md-undo">取消全选</Button>
    </div>
    <machine-info-modal @refreshMachineList="refreshMachineList"></machine-info-modal>
    <removal-modal :machinesellist="machinesellist"></removal-modal>
    <command-modal :machinesellist="machinesellist"></command-modal>
    <individual-modal :machinesellist="machinesellist"></individual-modal>
  </div>
</template>
<script>
  import settingsRepository from '@/repositories/settingsRepository'
  import MachineInfoModal from '../modals/machines/MachineModal.vue'
  import RemovalModal from '../modals/machines/RemovalModal.vue'
  import CommandModal from '../modals/machines/CommandModal.vue'
  import IndividualModal from '../modals/machines/IndividualModal.vue'
  var net = require('net')
  var iconv = require('iconv-lite')
  import {
    mapActions
  } from 'vuex'
  export default {
    name: 'machine-page',
    components: {
      MachineInfoModal,
      RemovalModal,
      CommandModal,
      IndividualModal
    },
    data() {
      return {
        mdata: [],
        machinesellist: [],
        singlemachine: {},
        mcolumns: [{
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            type: 'index',
            width: 65,
            align: 'center',
            title: '序号'
          },
          {
            title: '设备名称',
            key: 'name'
          },
          {
            title: '设备IP',
            key: 'ip'
          },
          {
            title: '设备端口',
            key: 'port'
          },
          {
            title: '服务器IP',
            key: 'serverIp'
          },
          {
            title: '服务器端口',
            key: 'serverPort'
          },
          {
            title: '设备号',
            key: 'sn'
          },
          {
            title: 'MAC',
            key: 'mac'
          },
          {
            title: '识别算法版本',
            key: 'algedition'
          },
          {
            title: '固件版本',
            key: 'edition'
          },
          {
            title: '设备类型',
            key: 'deviceType'
          },
          {
            title: '创建时间',
            key: 'created'
          },
          {
            title: '最后一次连接时间',
            key: 'modified'
          }
        ]
      }
    },
    mounted() {
      this.refreshMachineList()
      this.sendInfo()
    },
    methods: {
      ...mapActions([
        'showMachineInfo',
        'hideMachineInfo'
      ]),
      editMachineInfo() {
        if (this.machinesellist.length === 1) {
          this.$store.dispatch('showMachineInfo', this.machinesellist)
        } else {
          this.$Notice.error({
            title: '错误',
            desc: '请选择一项后再进行修改操作'
          })
        }
      },
      handleSelectAllMachines(s) {
        this.$refs.selectedMachines.selectAll(s)
        if (!s) {
          this.machinesellist = []
          this.hideMachineInfo()
        }
      },
      machinesel(sel) {
        this.machinesellist = sel
        this.singlemachine = sel[0]
      },
      refreshMachineList() {
        var that = this
        if (typeof that.$store.state.modals.login.projectId
          .id === 'undefined')
          return
        that.$machinesRepo.createTable().then(() => that.$machinesRepo.getMachines('', that.$store.state.modals.login.projectId
          .id)).then((mlist) => {
          that.mdata = mlist.results
        }).catch((err) => {
          console.log('createTable machine Error: ', err)
        })
        this.machinesellist = []
        this.singlemachine = {}
      },
      delMachineInfoDialog() {
        if (this.machinesellist.length <= 0) {
          this.$Notice.error({
            title: '错误',
            desc: '请选择一项后再进行删除操作'
          })
          return
        }
        var that = this
        that.$Modal.confirm({
          title: `提示`,
          okText: '确认删除',
          cancelText: '取消',
          content: `<p>确认删除吗 ?</p>`,
          onOk: () => {
            that.$Spin.show()
            var dellist = []
            that.machinesellist.forEach(function (value, index, arr) {
              dellist.push(value.id)
            })
            that.$machinesRepo.delete(dellist).then(() => {
              that.$Notice.success({
                title: '提醒',
                desc: '删除成功'
              })
            }).catch((err) => {
              that.$Notice.error({
                title: '提醒',
                desc: '删除失败'
              })
              console.log('删除失败: ', err)
            }).finally(() => {
              that.$Spin.hide()
              that.refreshMachineList()
            })
          },
          onCancel: () => {
            this.handleSelectAllMachines(false)
          }
        })
      },
      machineop(e) {
        var that = this
        if (typeof that.singlemachine.port === 'undefined') {
          that.$Notice.error({
            title: '错误',
            desc: '请至少选择一条考勤机设备后再进行操作'
          })
          return
        }

        if (e === 'Removal()') {
          that.$store.dispatch('showRemovalModal', {})
          return
        }

        if(e === 'delone'){
          that.$store.dispatch('showIndividualModal')
          return
        }

        if (e === 'DeleteAllRecord()') {
          that.$Modal.confirm({
            title: '确认',
            content: `<p>确认清空考勤机 ${that.singlemachine.ip} 下所有考勤记录？</p>`,
            onOk: () => {
              that.socketOP(e)
            }
          })
          return
        }

        if (e === 'DeleteAllEmployee()') {
          that.$Modal.confirm({
            title: '确认',
            content: `<p>确认删除考勤机 ${that.singlemachine.ip} 下所有人员？</p>`,
            onOk: () => {
              that.socketOP(e)
            }
          })
          return
        }

        if (e === 'RestartDevice()') {
          that.$Modal.confirm({
            title: '确认',
            content: `<p>确认重启考勤机 ${that.singlemachine.ip}？</p>`,
            onOk: () => {
              that.socketOP(e)
            }
          })
          return
        }

        if (e === 'refresh') {
          var moment = require('moment')
          var datenow = moment().format("YYYY-MM-DD")
          var timenow = moment().format("HH:mm:ss")
          that.$Notice.success({
            title: '当前时间',
            desc: `日期：${datenow} 时间：${timenow}`
          })
          e = `SetDateTime(date="${datenow}" time="${timenow}")`
        }

        if (e === 'history') {
          that.$store.dispatch('showCommandModal')
          return
        }
        that.socketOP(e)
      },
      sendInfo() {
        var that = this
        if (typeof that.$store.state.modals.login.projectId
          .id === 'undefined')
          return
        that.$machinesRepo.getUnuploadMachines(that.$store.state.modals.login.projectId
          .id).then((res) => {
          console.log('getUnuploadMachines = ', res)
          if (res.results.length > 0) {
            var postdata = []
            var ids = []
            res.results.forEach(function (info, i, a) {
              var data = {
                deviceId: info.id,
                projectId: info.projectId,
                name: info.name,
                sn: info.sn,
                deviceProperty: info.deviceProperty,
                code: info.code,
                deviceType: info.deviceType,
                remark: info.remark,
                ip: info.ip,
                mac: info.mac,
                szKey: info.szKey,
                serverIp: info.serverIp,
                serverPoort: info.serverPort,
                updateType: info.updateType,
                delFlag: 1
              }
              postdata.push(data)
              ids.push(info.id)
            })
            console.log('需要传送的设备数据 = ', postdata)
            if (postdata.length > 0) {
              that.$http({
                  baseURL: that.$store.state.modals.settings.baseURL,
                  url: '/addClientDevice.whtml',
                  method: 'post',
                  data: {
                    clientDevice: JSON.stringify(postdata)
                  },
                  headers: {
                    'Content-Type': 'application/json',
                    'token': that.$store.state.modals.login.token
                  }
                })
                .then(function (data) {
                  console.log('远程添加', data)
                  if (data.data.code === 1) {
                    that.$machinesRepo.uploaded(ids).then((res) => {
                      console.log(res)
                    }).catch((err) => {
                      console.log(err)
                    }).finally(() => {

                    })
                  } else {
                    that.$machinesRepo.softdelete(ids).then((res) => {
                      console.log(res)
                    }).catch((err) => {
                      console.log(err)
                    }).finally(() => {

                    })
                  }
                })
                .catch(function (error) {
                  that.$machinesRepo.softdelete(ids).then((res) => {
                    console.log(res)
                  }).catch((err) => {
                    console.log(err)
                  }).finally(() => {

                  })
                })
                .finally(() => {

                })
            }
          }
        })
      },
      socketOP(e) {
        var that = this
        that.$Spin.show()
        var port = that.singlemachine.port
        var host = that.singlemachine.ip
        var client = new net.Socket()
        var strdata = ''
        var sock = client.connect(port, host, function () {
          sock.write(iconv.encode(e, 'GBK'))
          sock.end()
        })
        sock.on('data', function (data) {
          strdata += iconv.decode(data, 'GBK')
        })
        sock.on('end', function (data) {
          if (strdata.indexOf('Return(result="success"') !== -1) {
            if (e.indexOf('GetDeviceInfo()') !== -1)
              try {
                var edge = require('edge')
                var getStrValue = edge.func({
                  assemblyFile: "resources/FaceLibrary.dll",
                  typeName: "FaceLibrary.FaceUtil",
                  methodName: "getStrValue"
                })
                var edition = ''
                getStrValue([strdata, 'edition'], function (err, result) {
                  if (err) edition = ''
                  else
                    edition = result
                })
                var mac = ''
                getStrValue([strdata, 'mac'], function (err, result) {
                  if (err) mac = ''
                  else
                    mac = result
                })
                var sn = ''
                getStrValue([strdata, 'dev_id'], function (err, result) {
                  if (err) sn = ''
                  else
                    sn = result
                })
                var algedition = ''
                getStrValue([strdata, 'alg_edition'], function (err, result) {
                  if (err) algedition = ''
                  else
                    algedition = result
                })
                var deviceType = ''
                getStrValue([strdata, 'type'], function (err, result) {
                  if (err) deviceType = ''
                  else
                    deviceType = result
                })
                var data = {
                  id: that.singlemachine.id,
                  ip: that.singlemachine.ip,
                  edition: edition,
                  mac: mac,
                  sn: sn,
                  algedition: algedition,
                  deviceType: deviceType
                }
                console.log('更新数据：', data)
                that.machineInfoUpdate(data)
              } catch (err) {
                console.log('操作异常:', err)
                that.$Notice.error({
                  title: '提醒',
                  desc: '操作异常'
                })
              }
            else
              that.$Notice.success({
                title: '命令执行成功',
                desc: strdata
              })

            var moment = require('moment')
            var datenow = moment().format("YYYY-MM-DD HH:mm:ss")
            var commandsdata = {
              machinesn: that.singlemachine.sn,
              projectid: that.$store.state.modals.login.projectId.id,
              createdate: datenow,
              executedate: datenow,
              commandtype: e,
              commandcontent: e,
              commandresponse: strdata,
              resulttype: 1
            }
            that.commandInsert(commandsdata)
          } else {
            var moment = require('moment')
            var datenow = moment().format("YYYY-MM-DD HH:mm:ss")
            var commandsdata = {
              machinesn: that.singlemachine.sn,
              projectid: that.$store.state.modals.login.projectId.id,
              createdate: datenow,
              executedate: datenow,
              commandtype: e,
              commandcontent: e,
              commandresponse: strdata,
              resulttype: 2
            }
            that.commandInsert(commandsdata)
          }
          sock.destroy()
          that.$Spin.hide()
        })
        sock.setTimeout(1000)
        sock.on('timeout', ()=>{
          that.$Notice.error({
            title: '错误',
            desc: `考勤机 ${host}:${port} 连接超时，请检查考勤机网络连接！`
          })
          sock.destroy()
          that.$Spin.hide()
        })
        sock.on('error', function (error) {
          // 错误出现之后关闭连接
          that.$Notice.error({
            title: '错误',
            desc: error
          })
          sock.destroy()
          that.$Spin.hide()
        })
      },
      machineInfoUpdate(data) {
        var that = this
        that.$machinesRepo.update(data).then(() => {
          that.$Notice.success({
            title: '提醒',
            desc: '修改成功'
          })
        }).catch((err) => {
          that.$Notice.error({
            title: '提醒',
            desc: '修改失败'
          })
        }).finally(() => {
          that.refreshMachineList()
        })
      },
      commandInsert(data) {
        var that = this
        var log = settingsRepository.getUserlog()
        data.commandfrom = log.username

        if (data.commandtype === 'RestartDevice()') {
          data.commandtype = '重启设备'
        }
        if (data.commandtype === 'GetDeviceInfo()') {
          data.commandtype = '获取设备信息'
        }
        if (data.commandtype === 'DeleteAllRecord()') {
          data.commandtype = '清空考勤记录'
        }
        if (data.commandtype === 'DeleteAllEmployee()') {
          data.commandtype = '删除所有人员'
        }
        if (data.commandtype.indexOf('SetDateTime(date=') !== -1) {
          data.commandtype = '同步设备时间'
        }

        that.$commandRepo.create(data).then((res) => {
          if (res.results.insertId > 0)
            that.$Notice.success({
              title: '提醒',
              desc: '新增命令记录成功'
            })
          else
            that.$Notice.error({
              title: '提醒',
              desc: '新增命令记录失败'
            })
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
