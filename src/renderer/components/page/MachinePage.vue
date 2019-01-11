<template id="machine-page">
  <div style="width:100vw;">
    <div style="margin:90px auto 20px auto;width:95%;">
      <Button shape="circle" icon="md-add" class="btn" type="primary" @click="showMachineInfo">添加设备</Button>
      <Button shape="circle" icon="md-create" class="btn" type="warning" @click="editMachineInfo">修改设备</Button>
      <Button shape="circle" icon="md-close" class="btn" type="error" @click="delMachineInfoDialog">删除设备</Button>
      <Button shape="circle" icon="ios-refresh" class="btn" type="info" @click="refreshMachineList">刷新列表</Button>

      <!-- <Dropdown style="margin-left: 20px" @on-click="machineop" trigger="click">
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
          <DropdownItem name="oneman">手动下发人员信息</DropdownItem>
          <DropdownItem divided name="history">历史命令查询</DropdownItem>
        </DropdownMenu>
      </Dropdown> -->
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
  </div>
</template>
<script>
  import MachineInfoModal from '../modals/machines/MachineModal.vue'
  var net = require('net')
  var iconv = require('iconv-lite')
  import {
    mapActions
  } from 'vuex'
  export default {
    name: 'machine-page',
    components: {
      MachineInfoModal
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
          this.$Notice.error({
            title: '错误',
            desc: '请至少选择一项后再进行命令操作'
          })
          return
        }

        var port = that.singlemachine.serverPort
        var host = that.singlemachine.serverIp
        var client = new net.Socket()

        client.connect(port, host, function () {
          var utf8str = e
          client.write(iconv.encode(utf8str, 'GBK'))
          // 向端口写入数据到达服务端
        })
        client.on('data', function (data) {
          that.$Notice.success({
            title: '成功',
            desc: data
          })
          var strdata = data.toString()
          if (strdata.indexOf('Return(result="success"') !== -1) {
            console.log(that.stringComplier(strdata, 'mac'))
          }
        })
        client.on('error', function (error) {
          // 错误出现之后关闭连接
          that.$Notice.error({
            title: '错误',
            desc: error
          })
        })
        client.on('close', function () {
          // 正常关闭连接
          console.log('Connection closed')
        })
      },
      /**
       * 考勤机返回字符串解析
       */
      stringComplier(str, reg) {
        var ss = reg + '="'
        var startpo = str.indexOf(ss) + ss.length
        var endpo = str.indexOf('" ', startpo)
        return str.substring(startpo, endpo)
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
                      that.$Notice.success({
                      title: '提醒',
                      desc: '远程操作成功'
                    })
                    })
                  } else {
                    that.$machinesRepo.softdelete(ids).then((res) => {
                      console.log(res)
                    }).catch((err) => {
                      console.log(err)
                    }).finally(() => {
                      /* that.$Notice.error({
                        title: '提醒',
                        desc: '远程操作失败'
                      }) */
                    })
                  }
                })
                .catch(function (error) {
                  that.$machinesRepo.softdelete(ids).then((res) => {
                      console.log(res)
                    }).catch((err) => {
                      console.log(err)
                    }).finally(() => {
                      /* that.$Notice.error({
                        title: '提醒',
                        desc: '远程操作异常'
                      }) */
                    })
                })
                .finally(() => {

                })
            }
          }
        })
      }
    }
  }

</script>
