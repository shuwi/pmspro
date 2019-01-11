<template id="group-page">
  <div style="width:100vw;">
    <div style="margin:90px auto 20px auto;width:95%;">
      <Button shape="circle" icon="md-add" class="btn" type="primary" @click="showWorkerGroup" v-if="canAddUser">添加班组</Button>
    </div>
    <div style="margin:0 auto 120px auto;width:95%;">
      <Table border :columns="classNoColumns" :data="classNoArr" width="100%" size="small"></Table>
    </div>
    <worker-group-modal @classNoGet="classNoGet"></worker-group-modal>
  </div>
</template>
<script>
  import WorkerGroupModal from '../modals/groups/WorkerGroupModal.vue'
  import {
    mapActions
  } from 'vuex'
  export default {
    name: 'group-page',
    components: {
      WorkerGroupModal
    },
    computed: {
      canAddUser() {
        return this.$store.state.modals.login.mode !== '0'
      }
    },
    data() {
      return {
        classNoArr: [],
        classNoColumns: [{
            type: 'index',
            width: 60,
            align: 'center',
            title: '序号'
          },
          {
            title: '名称',
            key: 'name'
          },
          {
            title: '联系人',
            key: 'teamLeader'
          },
          {
            title: '联系方式',
            key: 'contract'
          },
          {
            title: '责任人身份证号码',
            key: 'responseIdNumber'
          },
          {
            title: '班组长身份证号码',
            key: 'teamIdNumber'
          }, {
            title: '操作',
            key: 'action',
            align: 'center',
            className: 'address-table-info-column',
            render: (h, params) => {
              if (this.$store.state.modals.login.mode !== '0') {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small',
                      shape: 'circle',
                      icon: 'ios-pricetag-outline'
                    },
                    style: {
                      marginLeft: '0px',
                      width: '80px'
                    },
                    on: {
                      click: () => {
                        this.editWorkerGroup(params.row)
                      }
                    }
                  }, '修改'),
                  h('Button', {
                    props: {
                      type: 'error',
                      size: 'small',
                      shape: 'circle',
                      icon: 'md-trash'
                    },
                    style: {
                      marginLeft: '10px',
                      width: '80px'
                    },
                    on: {
                      click: () => {
                        this.delGroup(params.row)
                      }
                    }
                  }, '删除')
                ])
              }
            }
          }

        ],
      }
    },
    created() {
      this.classNoGet()
    },
    methods: {
      ...mapActions([
        'showWorkerGroup',
        'hideWorkerGroup'
      ]),
      classNoGet() {
        var that = this
        that.$classNoRepo.createTable().then(() => {
          that.$classNoRepo.getUploadData().then((res) => {
            if (res.results) {
              var temp = []
              res.results.forEach(function (v, i, a) {
                var postgroup = {
                  projectId: v.projectId,
                  name: v.name,
                  teamLeader: v.teamLeader,
                  contract: v.contract,
                  teamIdNumber: v.teamIdNumber,
                  responseIdNumber: v.responseIdNumber,
                  note: v.memo,
                  createUser: v.username,
                  groupId: res.results.insertId,
                  delFlag: 1,
                  smzGroupId: null
                }
                temp.push(postgroup)
              })
              if (temp.length > 0) {
                that.$http({
                    baseURL: that.$store.state.modals.settings.baseURL,
                    url: 'addClientGroup.whtml',
                    data: {
                      clientGroup: JSON.stringify(temp)
                    },
                    method: 'post',
                    headers: {
                      'Content-Type': 'application/json',
                      'token': that.$store.state.modals.login.token
                    }
                  })
                  .then(function (data) {
                    if (data.data.code === 1) {
                      that.$Notice.success({
                        title: '提醒',
                        desc: '新增成功'
                      })
                    } else {
                      var delarr = []
                      delarr.push(res.results.insertId)
                      that.$classNoRepo.softdelete(delarr).then((res) => {
                        console.log('删除班组：', res)
                      }).catch((err) => {
                        console.log('delete Error: ', err)
                      })
                      that.$Notice.error({
                        title: '提醒',
                        desc: '新增失败'
                      })
                    }
                    console.log('handleSubmit', data)
                  })
                  .catch(function (error) {
                    var delarr = []
                    delarr.push(res.results.insertId)
                    that.$classNoRepo.realdelete(delarr).then((res) => {
                      console.log('物理删除班组：', res)
                    }).catch((err) => {
                      console.log('delete Error: ', err)
                    })
                    that.$Notice.error({
                      title: '提醒',
                      desc: '系统接口异常'
                    })
                    console.log(error)
                  })
                  .finally(() => {
                    that.getList()
                  })
              } else {
                that.getList()
              }

            }
          })
        })

      },
      editWorkerGroup(item) {
        this.showWorkerGroup(item)
      },
      getList() {
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
            console.log('getClassNoInfo = ', data)
            var temp = data.data.group.filter(function (val) {
              return val
            })
            if (that.$store.state.modals.login.mode === '0' || that.$store.state.modals.login.mode ===
              '1')
              that.classNoArr = temp
            if (that.$store.state.modals.login.mode === '2')
              that.$classNoRepo.createTable().then(() => {
                data.data.group.forEach(function (v, i, a) {
                  var adddata = {
                    name: v.name,
                    teamLeader: v.teamLeader,
                    contract: v.contract,
                    teamIdNumber: v.teamIdNumber,
                    responseIdNumber: v.responseIdNumber,
                    memo: v.memo,
                    createUser: v.createUser,
                    projectId: that.$store.state.modals.login.projectId.id,
                    smzGroupId: v.id
                  }
                  that.$classNoRepo.patchAdd(adddata, that.$store.state.modals.login.projectId
                    .id)
                })
              }).catch((err) => {
                console.log('createTable classno Error: ', err)
              }).finally(() => {
                that.$classNoRepo.getClasses("", that.$store.state.modals.login.projectId
                  .id).then((res) => {
                  that.classNoArr = res.results
                }).catch((err) => {
                  console.log('createTable classno Error: ', err)
                })
              })
          })
          .catch(function (error) {
            console.log(error)
          })
      },
      delGroup(v) {
        this.$Modal.confirm({
          title: '确认',
          content: `<p>确认删除班组${v.name}？</p>`,
          onOk: () => {
            var that = this
            that.$workersRepo.getClassNoNum(v.name, that.$store.state.modals.login.projectId.id).then((res) => {
              if (res.num > 0) {
                that.$Notice.error({
                  title: '提醒',
                  desc: `${v.name}下存在工人信息，不予删除`
                })
              } else {
                if (that.$store.state.modals.login.mode === '2') {
                  var deldata = {
                    projectId: v.projectId,
                    groupId: v.id,
                    name: v.name,
                    teamLeader: v.teamLeader,
                    contract: v.contract,
                    teamIdNumber: v.teamIdNumber,
                    responseIdNumber: v.responseIdNumber,
                    memo: v.memo,
                    smzGroupId: v.smzGroupId,
                    delFlag: -1
                  }
                  var finaldata = []
                  finaldata.push(deldata)
                  that.$http({
                      baseURL: that.$store.state.modals.settings.baseURL,
                      url: '/addClientGroup.whtml',
                      method: 'post',
                      data: {
                        clientGroup: JSON.stringify(finaldata)
                      },
                      headers: {
                        'Content-Type': 'application/json',
                        'token': that.$store.state.modals.login.token
                      }
                    })
                    .then(function (data) {
                      console.log('删除：', data)
                      if (data.data.code === 1) {
                        that.$Notice.success({
                          title: '提醒',
                          desc: data.data.message
                        })
                        var delarr = []
                        delarr.push(v.id)
                        that.$classNoRepo.delete(delarr).then((res) => {
                          console.log('删除班组：', res)
                        }).catch((err) => {
                          console.log('delete Error: ', err)
                        })
                      } else {
                        that.$Notice.error({
                          title: '提醒',
                          desc: '远程删除失败'
                        })
                      }
                    })
                    .catch(function (error) {
                      that.$Notice.error({
                        title: '提醒',
                        desc: '远程删除异常！'
                      })
                      console.log(error)
                    })
                    .finally(() => {
                      that.classNoGet()
                    })

                } else {
                  that.$http({
                      baseURL: that.$store.state.modals.settings.baseURL,
                      url: '/deleteGroupInfo.whtml',
                      method: 'post',
                      data: {
                        group: {
                          projectId: that.$store.state.modals.login.projectId.id,
                          name: v.name
                        }
                      },
                      headers: {
                        'Content-Type': 'application/json',
                        'token': that.$store.state.modals.login.token
                      }
                    })
                    .then(function (data) {
                      console.log('删除：', data)
                      if (data.data.result === 1) {
                        that.$Notice.success({
                          title: '提醒',
                          desc: data.data.message
                        })
                      } else {
                        that.$Notice.error({
                          title: '提醒',
                          desc: '远程删除失败'
                        })
                      }
                    })
                    .catch(function (error) {
                      that.$Notice.error({
                        title: '提醒',
                        desc: '远程删除异常！'
                      })
                      console.log(error)
                    })
                    .finally(() => {
                      that.classNoGet()
                    })
                }
              }
            })
          }
        })
      }
    }
  }

</script>
