<template id="worker-page">
  <div style="display:flex;flex-direction:row;align-items:center;height:100vh;width:100vw;align-items: flex-start;margin:80px auto 0 auto;">
    <div style="order:1;flex:1;width:250px;flex-shrink:0;height:100%;backgrouond:#f9fafb !important;overflow: inherit;background:#f9fafb;border-right:1px solid #e8eaec;">
      <Tree :data="treedata" style="width:250px;padding:0 0 80px 10px;background:#f9fafb;border-right:1px solid #e8eaec;margin:0;line-height:2em;overflow: inherit;"
        @on-select-change="kindSelected"></Tree>
    </div>
    <div style="order:2;padding:10px 25px;flex-grow:2;overflow:auto;margin:0;flex-shrink:1;">
      <div style="margin:0 auto 20px auto;width:100%;">
        <Button shape="circle" icon="md-add" class="btn" type="primary" @click="showUserModal" v-if="canAddUser">添加人员</Button>
        <Button shape="circle" icon="md-arrow-round-back" class="btn" @click="labourout">人员退场</Button>
        <Button shape="circle" icon="md-arrow-round-forward" class="btn" @click="labourin">人员进场</Button>
        <Button shape="circle" icon="ios-refresh" class="btn" @click="testone" :loading="getloading">更新数据</Button>
        <Input placeholder="请输入姓名或身份证号、手机号后查询" style="width:300px;margin:0 10px 0 0;" clearable v-model="keyword" />
        <Button shape="circle" icon="md-search" class="btn" @click="search">查询</Button>
      </div>
      <Table border width="100%" size="small" ref="selection" :columns="ucolumns" :data="udata" @on-selection-change="laboursel"></Table>
      <div style="margin:20px auto;width:100%;">
        <Button @click="handleSelectAll(true)" shape="circle" style="width:100px;" icon="md-checkmark">全选</Button>
        <Button @click="handleSelectAll(false)" shape="circle" style="width:100px;" icon="md-undo">取消全选</Button>
        <Page :current="current" :total="total" show-total style="float:right;" @on-change="userlistChange" :page-size="pagesize" />
      </div>
    </div>
    <worker-modal @newBoardSubmitted="loadBoards" @reloadPage="getNewData"></worker-modal>
    <labour-check :status="status" :userlist="sellist" :checkvisible="checkvisible" :token="token" :projectId="projectId"
      @visibleChange="visibleChange" @reloadPage="getNewData"></labour-check>
  </div>
</template>
<script>
  import settingsRepository from '@/repositories/settingsRepository'
  import WorkerModal from '../modals/workers/WorkerModal.vue'
  import LabourCheck from '../modals/workers/LabourCheck.vue'
  import {
    mapActions
  } from 'vuex'
  export default {
    name: 'worker-page',
    components: {
      WorkerModal,
      LabourCheck
    },
    computed: {
      canAddUser() {
        return this.$store.state.modals.login.mode !== '0'
      }
    },
    data() {
      return {
        getloading: false,
        checkvisible: false,
        token: '',
        projectId: 2163,
        status: false,
        current: 1,
        total: 0,
        pagesize: 10,
        sellist: [],
        udata: [],
        kw: "",
        keyword: "",
        treedata: [{
          title: '班组',
          expand: true,
          children: []
        }],
        ucolumns: [{
            type: 'selection',
            width: 50,
            align: 'center'
          },
          {
            type: 'index',
            width: 65,
            align: 'center',
            title: '序号'
          },
          {
            title: '姓名',
            key: 'name'
          },
          {
            title: '手机',
            key: 'mobile'
          },
          {
            title: '身份证号',
            key: 'userId',
            width: 165,
          },
          {
            title: '班组',
            key: 'classNo'
          },
          {
            title: '工种',
            key: 'workKindName'
          },
          {
            title: '进场状态',
            key: 'inState',
            render: (h, params) => {
              return h('div', [
                h('span', {
                  props: {

                  }
                }),
                params.row.inState > 1 ? '退场' : (params.row.inState < 1 ? '待进场' : '进场')
              ])
            }
          },
          {
            title: '操作',
            key: 'action',
            width: 300,
            align: 'center',
            className: 'address-table-info-column',
            render: (h, params) => {
              if (this.$store.state.modals.login.mode !== '0') {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'info',
                      size: 'small',
                      shape: 'circle',
                      icon: 'ios-search'
                    },
                    style: {
                      marginRight: '10px',
                      width: '80px'
                    },
                    on: {
                      click: () => {
                        this.show(params.index)
                      }
                    }
                  }, '查看'),
                  h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small',
                      shape: 'circle',
                      icon: 'ios-pricetag-outline'
                    },
                    style: {
                      marginRight: '10px',
                      width: '80px'
                    },
                    on: {
                      click: () => {
                        this.editUser(params)
                      }
                    }
                  }, '修改'),
                  h('Button', {
                    props: {
                      type: 'success',
                      size: 'small',
                      shape: 'circle',
                      icon: 'md-wifi'
                    },
                    style: {
                      width: '80px'
                    },
                    on: {
                      click: () => {
                        this.checkin(params)
                      }
                    }
                  }, '登记')
                ])
              } else {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'info',
                      size: 'small',
                      shape: 'circle',
                      icon: 'ios-search'
                    },
                    style: {
                      marginRight: '10px',
                      width: '80px'
                    },
                    on: {
                      click: () => {
                        this.show(params.index)
                      }
                    }
                  }, '查看'),
                  h('Button', {
                    props: {
                      type: 'success',
                      size: 'small',
                      shape: 'circle',
                      icon: 'md-wifi'
                    },
                    style: {
                      width: '80px'
                    },
                    on: {
                      click: () => {
                        this.checkin(params)
                      }
                    }
                  }, '登记')
                ])
              }
            }
          }
        ],
      }
    },
    mounted() {
      this.groupNoGet()
      this.getNewData()
    },
    methods: {
      ...mapActions([
        'showNewBoardModal',
        'hideNewBoardModal'
      ]),
      visibleChange(checkvisible) {
        this.checkvisible = checkvisible
      },
      loadBoards() {
        this.$store.dispatch('fetchBoards')
      },
      getNewData() {
        var that = this
        var pid = that.$store.state.modals.login.projectId.id
        var k = that.keyword === '' ? that.kw : that.keyword
        if (that.$store.state.modals.login.mode !== '2') {
          that.$workersRepo.createTable().then(() => that.$workersRepo.getWorkersCount(k, pid)).then((data) => {
            that.total = data.num
          }).then(() => that.$workersRepo.getWorkers(k, pid, 1, that.pagesize)).then((userlist) => {
            that.udata = userlist
          }).catch((err) => {
            console.log('createTable workers Error: ', err)
          })
        } else {
          that.$workersMysqlRepo.createTable().then(() => that.$workersMysqlRepo.getWorkersCount(k, pid)).then((data) => {

            that.total = data.results[0].num
          }).then(() => that.$workersMysqlRepo.getWorkers(k, pid, 1, that.pagesize)).then((userlist) => {

            that.udata = userlist.results
          }).catch((err) => {
            console.log('createTable workers Error: ', err)
          })

          if (typeof pid === 'undefined')
            return

          that.getWorkKind(1)
          that.getWorkKind(2)
          that.getWorkKind(3)
          /* that.$workersMysqlRepo.getUploadWorkers(pid).then((res) => {
            var postdata = []
            var ids = []
            res.results.forEach(function (v, i, a) {
              var data = {
                personId: v.id,
                workId: v.workKind,
                kindName: v.workKindName,
                className: v.classNo,
                ngProjectId: v.projectId,
                comId: 0,
                name: v.name,
                idCard: v.userId,
                mobile: v.mobile,
                birthday: v.birthday,
                address: v.homeAddress,
                gender: v.gender,
                currAddress: v.currentAddresss,
                image: v.photo,
                joinStatus: v.inState > 1 ? 0 : (v.inState < 1 ? 1 : 2),
                password: '7c4a8d09ca3762af61e59520943dc26494f8941b',
                idCardType: v.idCardType,
                nation: v.nation === null ? '01' : v.nation,
                birthPlaceCode: v.birthPlaceCode,
                politicsType: v.politicsType,
                unJoined: v.unJoined,
                joinedTime: v.joinedTime,
                cultureLevelType: v.cultureLevelType,
                noBadMedicalHistory: v.noBadMedicalHistory,
                urgentContractName: v.urgentContractName,
                urgentContractCellphone: v.urgentContractCellphone,
                workDate: v.workDate,
                workAccommodationType: v.workAccommodationType,
                workKindtype: v.workKindType,
                personType: v.personType,
                startDate: v.beginnew,
                endDate: v.endnew,
                joinInDate: v.checkinState === 1 ? v.checkinTime : null,
                joinOutDate: v.checkinState === 0 ? v.checkinTime : null,
                delFlag: 1
              }
              postdata.push(data)
              ids.push(v.id)

            })
            console.log('postdata= ', postdata)
            if (postdata.length > 0)
              that.$http({
                baseURL: that.$store.state.modals.settings.baseURL,
                url: '/addClientUser.whtml',
                method: 'post',
                data: {
                  clientUser: JSON.stringify(postdata)
                },
                headers: {
                  'Content-Type': 'application/json',
                  'token': that.$store.state.modals.login.token
                }
              })
              .then(function (data) {
                if (data.data.code === 1) {
                  that.$workersMysqlRepo.updateWorkersDel(1, ids).then((res) => {
                    console.log('批量提交后更新删除状态:', res)
                  }).catch((err) => {
                    console.log('updateWorkersDel Error: ', err)
                  })
                }
                console.log(data)
              })
              .catch(function (error) {
                console.log(error)
              })
          }) */
        }
      },
      getWorkKind(type) {
        var that = this
        that.$http({
            baseURL: that.$store.state.modals.settings.baseURL,
            url: '/getWorkKindInfo.whtml',
            method: 'get',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'token': that.$store.state.modals.login.token
            },
            params: {
              workKindType: type
            }
          })
          .then(function (data) {
            console.log('data.data.workKind = ', data.data.workKind)
            var dd = []
            data.data.workKind.forEach(function (v, i, a) {
              var dat = {
                smzId: v.id,
                name: v.kindName,
                workKindType: type,
                workKindTypeName: type === 1 ? '普通工' : (type === 2 ? '辅助工' : '特殊工作人员'),
                delFlag: 1
              }
              dd.push(dat)
            })
            dd.forEach(function (v, i, a) {
              that.$workkindRepo.createTable().then(() => {
                that.$workkindRepo.pathAdd(v)
              }).catch(function (error) {
                console.log(error)
              })
            })
          })
          .catch(function (error) {
            console.log(error)
          })
      },
      search(e) {
        var that = this
        var pid = that.$store.state.modals.login.projectId.id
        var k = that.keyword === '' ? that.kw : that.keyword
        if (that.$store.state.modals.login.mode !== '2') {
          that.$workersRepo.getWorkersCount(k, pid).then((data) => {
            that.total = data.num
          }).then(() => that.$workersRepo.getWorkers(k, pid, 1, that.pagesize)).then((userlist) => {
            that.udata = userlist
          }).catch((err) => {
            console.log('getWorkersCount Error: ', err)
          })
        } else {
          that.$workersMysqlRepo.getWorkersCount(k, pid).then((data) => {
            that.total = data.results[0].num
          }).then(() => that.$workersMysqlRepo.getWorkers(k, pid, 1, that.pagesize)).then((userlist) => {
            that.udata = userlist.results
          }).catch((err) => {
            console.log('getWorkersCount Error: ', err)
          })
        }
      },
      kindSelected(v) {
        var that = this
        that.kw = v[0].title
        var pid = that.$store.state.modals.login.projectId.id
        if (that.$store.state.modals.login.mode !== '2') {
          that.$workersRepo.getWorkersCount(that.kw, pid).then((data) => {
            that.total = data.num
          }).then(() => that.$workersRepo.getWorkers(that.kw, pid, 1, that.pagesize)).then((userlist) => {
            that.udata = userlist

          }).catch((err) => {
            console.log('getWorkersCount Error: ', err)
          })
        } else {
          that.$workersMysqlRepo.getWorkersCount(that.kw, pid).then((data) => {
            that.total = data.results[0].num
          }).then(() => that.$workersMysqlRepo.getWorkers(that.kw, pid, 1, that.pagesize)).then((userlist) => {
            that.udata = userlist.results

          }).catch((err) => {
            console.log('getWorkersCount Error: ', err)
          })
        }
      },
      showUserModal() {
        if (this.$store.state.modals.login.mode === '0') {
          this.$Modal.error({
            title: '提醒',
            content: `<p>线上下载模式下暂不支持人员添加！<p>`
          })
          return
        }
        this.$store.dispatch('showNewBoardModal', {
          id: 0
        })
      },
      laboursel(sel) {
        this.sellist = sel
      },
      labourout() {
        if (this.sellist.length === 0) {
          this.$Notice.error({
            title: '错误',
            desc: '请至少选择一项后再进行退场操作'
          })
          this.checkvisible = false
        } else {
          this.status = true
          this.checkvisible = true
        }
      },
      labourin() {
        if (this.sellist.length === 0) {
          this.$Notice.error({
            title: '错误',
            desc: '请至少选择一项后再进行进场操作'
          })
          this.checkvisible = false
        } else {
          this.status = false
          this.checkvisible = true
        }
      },
      handleSelectAll(status) {
        this.$refs.selection.selectAll(status)
      },
      userlistChange(number) {
        var that = this
        var pid = that.$store.state.modals.login.projectId.id
        var k = that.keyword === '' ? that.kw : that.keyword
        that.$workersRepo.getWorkersCount(k, pid).then((data) => {
          that.total = data.num
        }).then(() => that.$workersRepo.getWorkers(k, pid, number, that.pagesize)).then((userlist) => {
          that.udata = userlist
        }).catch((err) => {
          console.log('userlistChange Error: ', err)
        })
      },
      groupNoGet() {
        var that = this
        that.$http({
            baseURL: that.$store.state.modals.settings.baseURL,
            url: '/getClassNoInfo.whtml',
            method: 'get',
            params: {
              projectId: that.$store.state.modals.login.projectId.id
            },
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'token': that.$store.state.modals.login.token
            }
          })
          .then(function (data) {
            var tt = []
            if (!Array.isArray(data.data.group))
              return
            data.data.group.forEach(function (value, index, array) {
              if (value) {
                tt.push({
                  title: value.name
                })
              } else {
                delete array[index]
              }
            })
            that.treedata[0].children = tt
            that.classNoArr = data.data.group.filter(function (val) {
              return val
            })
          })
          .catch(function (error) {
            console.log(error)
          })
      },
      testone() {
        var that = this
        that.$http({
            baseURL: that.$store.state.modals.settings.baseURL,
            url: '/queryUserProjectRole.whtml',
            method: 'post',
            data: {
              group: {
                projectId: that.$store.state.modals.login.projectId.id,
                name: ''
              }
            },
            headers: {
              'Content-Type': 'application/json',
              'token': that.$store.state.modals.login.token
            }
          })
          .then(function (data) {
            console.log(data)
            if (data.data.list.classInfo.length <= 0) {
              that.$Notice.error({
                title: '提醒',
                desc: '项目下没有工人数据！'
              })
              return
            }
            that.getloading = true
            var workers = data.data.list.classInfo
            var insertData = []
            workers.forEach(function (v, i, a) {
              v.workers.forEach(function (value, index, arr) {
                insertData.push({
                  'userId': value.idcard,
                  'name': value.name,
                  'mobile': value.mobile,
                  'groupname': value.classNo,
                  'job': v.name,
                  'addtime': new Date(),
                  'checkinState': 0,
                  'checkinTime': null,
                  'photo': value.photo,
                  'projectId': that.$store.state.modals.login.projectId.id,
                  'workDate': value.workDate,
                  'urgentContractCellphone': value.urgentContractCellphone,
                  'urgentContractName': value.urgentContractName,
                  'noBadMedicalHistory': value.noBadMedicalHistory,
                  'cultureLevelType': value.cultureLevelType,
                  'joinedTime': value.joinedTime,
                  'politicsType': value.politicsType,
                  'birthPlaceCode': that.getBirthPlaceCode(value.idcard),
                  'nation': value.nation,
                  'idCardType': value.idCardType,
                  'classNo': value.classNo,
                  'currentAddresss': value.currentAddresss,
                  'personType': value.personType,
                  'homeAddress': value.homeAddress,
                  'workKind': value.workKind,
                  'workKindName': value.workKindName,
                  'birthday': value.birthday,
                  'gender': value.gender,
                  'ptype': value.ptype,
                  'beginnew': value.planBeginDate,
                  'endnew': value.planEndDate,
                  'inState': value.joinStatus
                })
              })
            })
            if (that.$store.state.modals.login.mode === '2') {
              that.$workersMysqlRepo.createTable()
                .then((dd) => {
                  console.log('dd = ', dd)
                  insertData.forEach(function (v, i, a) {
                    return that.$workersMysqlRepo.getCount(v.userId, v.projectId).then((res) => {
                      console.log('res = ', res)
                      if (res.results[0].num <= 0) {
                        return that.$workersMysqlRepo.create(v).then((r) => {
                          console.log('create r = ', r)
                          if (r.results.insertId <= 0) {
                            that.$Notice.error({
                              title: '提醒',
                              desc: '人员数据获取失败'
                            })
                          }
                        }).catch((err) => {
                          that.$Notice.error({
                            title: '提醒',
                            desc: `用户${v.userId} ${v.name} 部分信息不符合要求，入库失败`
                          })
                          console.log(err)
                        })
                      } else {
                        return that.$workersMysqlRepo.update(v).then((r) => {
                          console.log('update r = ', r)
                          if (r.results.affectedRows !== 1) {
                            that.$Notice.error({
                              title: '提醒',
                              desc: '人员数据更新失败'
                            })
                          }
                        }).catch((err) => {
                          that.$Notice.error({
                            title: '提醒',
                            desc: `用户${v.userId} ${v.name} 部分信息不符合要求，更新失败`
                          })
                          console.log(err)
                        })
                      }
                    }).catch((err) => {
                      console.log(err)
                    })
                  })
                })
                .catch((err) => {
                  console.log(err)
                }).finally(() => {
                  that.getloading = false
                })
            } else {

              that.$workersRepo.createTable()
                .then((dd) => {
                  console.log('dd = ', dd)
                  insertData.forEach(function (v, i, a) {
                    return that.$workersRepo.getCount(v.userId, v.projectId).then((res) => {
                      if (res.num <= 0) {
                        return that.$workersRepo.create(v).then((r) => {
                          if (r.id > 0) {
                            that.$Notice.success({
                              title: '提醒',
                              desc: '人员数据获取成功'
                            })
                          }
                        }).catch((err) => {
                          that.$Notice.error({
                            title: '提醒',
                            desc: `用户${v.userId} ${v.name} 部分信息不符合要求，入库失败`
                          })
                          console.log(err)
                        })
                      } else {
                        return that.$workersRepo.update(v).then((r) => {
                          if (r.affected > 0) {
                            that.$Notice.success({
                              title: '提醒',
                              desc: '人员数据获取成功'
                            })
                          }
                        }).catch((err) => {
                          that.$Notice.error({
                            title: '提醒',
                            desc: `用户${v.userId} ${v.name} 部分信息不符合要求，更新失败`
                          })
                          console.log(err)
                        })
                      }
                    }).catch((err) => {
                      console.log(err)
                    })
                  })
                })
                .catch((err) => {
                  console.log(err)
                }).finally(() => {
                  that.getloading = false
                })
            }
          })
          .catch(function (error) {
            console.log(error)
          })
      },
      getBirthPlaceCode(val) {
        var ss = val.substring(0, 2)
        const values = this.$store.state.settings.placeCode
        var that = this
        var code = ''
        values.forEach(function (value, index, array) {
          if (value.code === ss) {
            code = value.name
          }
        })
        return code
      },
      editUser(param) {
        if (this.$store.state.modals.login.mode === '0') {
          this.$Modal.error({
            title: '提醒',
            content: `<p>线上下载模式下暂不支持人员编辑！<p>`
          })
          return
        }

        if (param.row.id > 0) {
          this.$store.dispatch('showNewBoardModal', param.row)
        }
      },
      show(index) {
        this.$Modal.info({
          title: '人员信息',
          content: `<table style="font-size:12px;width:100%;">
          <tr><td>姓名：</td><td>${this.udata[index].name}</td></tr>
          <tr><td>身份证号：</td><td>${this.udata[index].userId}</td></tr>
          <tr><td>照片：</td><td><img src="data:image/bmp;base64,${this.udata[index].photo}"/></tr>
          </table>`
        })
      },
      checkin(params) {
        var that = this
        var net = require('net')
        var iconv = require('iconv-lite')
        var checkininfo = settingsRepository.getCheckinSettings()
        var port = checkininfo.checkinport
        var host = checkininfo.checkinhost
        var client = new net.Socket()
        // client.setTimeout(5000)
        client.on('timeout', () => {
          console.log('socket timeout')
          that.$Modal.error({
            title: '提示',
            content: `设备${host}:${port}连接超时，请检查网络连接`
          })
          that.$Spin.hide()
          client.end()
        })
        client.connect(port, host, function (err) {
          if (err) {
            console.log('err = ', err)
          }
          that.$Spin.show({
            render: (h) => {
              return h('div', [
                h('Circle', {
                  props: {
                    'stroke-color': '#ff5500',
                    percent: 18
                  },
                  attrs: {
                    'stroke-color': '#ff5500',
                    percent: 18
                  }
                }, '18%'),
                h('div', '操作中，请稍后...')
              ])
            }
          })
          setTimeout(() => {
            that.$Spin.hide()
          }, 1000 * 60)
          var utf8str =
            `EnrollEmployee(id="${params.row.userId}" name="${params.row.name}" dutyrule="1" photo="1" save="3")`
          console.log('utf8str = ', utf8str)
          client.write(iconv.encode(utf8str, 'GBK'))
          // 向端口写入数据到达服务端
        })
        client.on('data', function (data) {
          if (data.toString() === 'Return(result="success" status="cancel")') {
            that.$Modal.warning({
              title: '提示',
              content: `<p style="font-size:12px;">操作已取消！</p>`
            })

            that.$Spin.hide()
          } else if (data.toString().length > 500) {
            var updatedata = {
              'checkinState': 1,
              'checkinTime': new Date(),
              'userId': params.row.userId,
              'projectId': params.row.projectId
            }
            that.$workersRepo.update(updatedata).then((lastid) => {
              if (lastid.affected > 0) {
                that.$Modal.success({
                  title: '提示',
                  content: `<p style="font-size:12px;">登记成功！</p>`
                })
              } else {
                that.$Modal.error({
                  title: '提示',
                  content: `<p style="font-size:12px;">登记状态更新失败！</p>`
                })
              }
            }).catch((err) => {
              that.$Modal.error({
                title: '提示',
                content: `<p style="font-size:12px;">登记操作异常！</p>`
              })
              console.log(err)
            }).finally(() => {
              that.$Spin.hide()
            })
          } else {
            that.$Modal.warning({
              title: '提示',
              content: `<p style="font-size:12px;">设备故障或设备正忙！</p>`
            })

            that.$Spin.hide()
          }
        })
        client.on('error', function () { // 连接错误
          that.$Modal.error({
            title: '提示',
            content: `<p style="font-size:12px;">设备连接异常！</p>`
          })
          that.$Spin.hide()
        })

        client.on('close', function () {
          // 正常关闭连接
          console.log('Connection closed')
          that.$Spin.hide()
        })
      },
    }

  }

</script>
