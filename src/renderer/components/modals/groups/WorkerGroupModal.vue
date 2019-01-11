<template>
  <Modal id="worker-group-modal" v-model="isVisible" @on-visible-change="visibleChange" :mask-closable="false"
    :footer-hide="true" width="500" :closable="true">
    <p slot="header">
      <Icon type="md-contacts"></Icon>
      <span style="font-weight:normal;">班组信息</span>
    </p>
    <Form ref="formInline" :model="formInline" :rules="ruleInline" :label-width="150">
      <FormItem prop="name" label="班组名称">
        <i-input type="text" v-model="formInline.name" placeholder="请填写班组名称" clearable style="width: 260px">
        </i-input>
      </FormItem>
      <FormItem prop="teamLeader" label="联系人">
        <i-input type="text" v-model="formInline.teamLeader" placeholder="请填写联系人" clearable style="width: 260px">
        </i-input>
      </FormItem>
      <FormItem prop="contract" label="联系方式">
        <i-input type="text" v-model="formInline.contract" placeholder="请填写联系方式" clearable style="width: 260px">
        </i-input>
      </FormItem>
      <FormItem prop="teamIdNumber" label="班组长身份证号码">
        <i-input type="text" v-model="formInline.teamIdNumber" placeholder="班组长身份证号码" clearable style="width: 260px">
        </i-input>
      </FormItem>
      <FormItem prop="responseIdNumber" label="责任人身份证号码">
        <i-input type="text" v-model="formInline.responseIdNumber" placeholder="责任人身份证号码" clearable style="width: 260px">
        </i-input>
      </FormItem>
      <FormItem prop="memo" label="备注">
        <i-input type="textarea" :autosize="{minRows: 2,maxRows: 5}" v-model="formInline.memo" placeholder="备注" style="width: 260px"
          clearable>
        </i-input>
      </FormItem>
      <FormItem>
        <Button type="info" @click="handleSubmit('formInline')" shape="circle" style="width:120px;">提交</Button>
        <Button shape="circle" @click="handleReset('formInline')" style="width:120px;margin-left:8px;">重置</Button>
      </FormItem>
    </Form>
  </Modal>
</template>

<script>
  export default {
    name: 'worker-group-modal',
    props: ['userDataSend', 'userDatas'],
    computed: {
      isVisible: {
        get() {
          if (this.$store.state.modals.workerGroup.isVisible) {
            if (typeof this.userDatas !== 'undefined') {
              this.formInline.contract = this.userDatas.mobile
              this.formInline.responseIdNumber = this.userDatas.userId
              this.formInline.teamIdNumber = this.userDatas.userId
              this.formInline.teamLeader = this.userDatas.name
            }
          }
          return this.$store.state.modals.workerGroup.isVisible
        },
        set(value) {
          this.$store.state.modals.workerGroup.isVisible = value
        }
      }
    },
    data() {
      return {
        formInline: {
          name: '',
          teamLeader: '',
          teamIdNumber: '',
          responseIdNumber: '',
          contract: '',
          memo: ''
        },
        edit: false,
        ruleInline: {
          name: [{
            required: true,
            message: '请输入班组名称',
            trigger: 'blur'
          }],
          teamLeader: [{
              required: true,
              message: '请输入联系人',
              trigger: 'blur'
            },
            {
              type: 'string',
              min: 2,
              message: '至少2位',
              trigger: 'blur'
            }
          ]
        }
      }
    },
    methods: {
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          var that = this
          if (valid) {
            var posturl = 'addGroupInfo.whtml'
            var postgroup = {
              projectId: that.$store.state.modals.login.projectId.id,
              name: that.formInline.name,
              teamLeader: that.formInline.teamLeader,
              contract: that.formInline.contract,
              teamIdNumber: that.formInline.teamIdNumber,
              responseIdNumber: that.formInline.responseIdNumber,
              memo: that.formInline.memo,
              createUser: that.$store.state.modals.login.username
            }
            if (that.$store.state.modals.login.mode === '2') {
              posturl = 'addClientGroup.whtml'
              if (!that.edit) {
                that.$classNoRepo.create(postgroup).then((res) => {
                  console.log('create = ', res.results.insertId)
                  if (res.results.insertId > 0) {
                    postgroup.groupId = res.results.insertId
                    postgroup.note = that.formInline.memo
                    postgroup.delFlag = 1
                    postgroup.smzGroupId = null
                    var ddd = []
                    ddd.push(postgroup)
                    that.$http({
                        baseURL: that.$store.state.modals.settings.baseURL,
                        url: posturl,
                        data: {
                          clientGroup: JSON.stringify(ddd)
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
                        that.edit = false
                        that.closeModal()
                        that.$Spin.hide()
                      })
                  }
                }).catch((err) => {
                  console.log('create Error: ', err)
                })
              } else {
                var updatedata = postgroup
                updatedata.id = that.$store.state.modals.workerGroup.data.id
                that.$classNoRepo.update(updatedata).then((res) => {
                  console.log('update res =', res)
                  if (res.results.affectedRows !== 1) {
                    that.$Notice.error({
                      title: '提醒',
                      desc: '更新失败或未提交更新'
                    })
                    return
                  }
                  postgroup.groupId = that.$store.state.modals.workerGroup.data.id
                  postgroup.note = that.formInline.memo
                  postgroup.delFlag = 1
                  postgroup.smzGroupId = that.$store.state.modals.workerGroup.data.smzGroupId

                  var temp = []
                  temp.push(postgroup)

                  that.$http({
                      baseURL: that.$store.state.modals.settings.baseURL,
                      url: posturl,
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
                          desc: data.data.msg
                        })
                      } else {
                        var updatetemp = {
                          id: that.$store.state.modals.workerGroup.data.id,
                          name: that.$store.state.modals.workerGroup.data.name,
                          teamLeader: that.$store.state.modals.workerGroup.data.teamLeader,
                          contract: that.$store.state.modals.workerGroup.data.contract,
                          teamIdNumber: that.$store.state.modals.workerGroup.data.teamIdNumber,
                          responseIdNumber: that.$store.state.modals.workerGroup.data.responseIdNumber,
                          memo: that.$store.state.modals.workerGroup.data.memo,
                          createUser: that.$store.state.modals.workerGroup.data.createUser,
                          projectId: that.$store.state.modals.workerGroup.data.projectId,
                          smzGroupId: that.$store.state.modals.workerGroup.data.smzGroupId,
                          delFlag: that.$store.state.modals.workerGroup.data.delFlag
                        }
                        that.$classNoRepo.update(updatetemp).then((res) => {
                          if (res.results.affectedRows === 1) {
                            that.$Notice.success({
                              title: '提醒',
                              desc: '更新回退成功'
                            })
                          } else {
                            that.$Notice.error({
                              title: '提醒',
                              desc: '更新回退失败'
                            })
                          }
                        })
                        that.$Notice.error({
                          title: '提醒',
                          desc: data.data.msg
                        })
                      }
                      console.log('远程修改：', data)
                    })
                    .catch(function (error) {
                      var updatetemp = {
                        id: that.$store.state.modals.workerGroup.data.id,
                        name: that.$store.state.modals.workerGroup.data.name,
                        teamLeader: that.$store.state.modals.workerGroup.data.teamLeader,
                        contract: that.$store.state.modals.workerGroup.data.contract,
                        teamIdNumber: that.$store.state.modals.workerGroup.data.teamIdNumber,
                        responseIdNumber: that.$store.state.modals.workerGroup.data.responseIdNumber,
                        memo: that.$store.state.modals.workerGroup.data.memo,
                        createUser: that.$store.state.modals.workerGroup.data.createUser,
                        projectId: that.$store.state.modals.workerGroup.data.projectId,
                        smzGroupId: that.$store.state.modals.workerGroup.data.smzGroupId,
                        delFlag: that.$store.state.modals.workerGroup.data.delFlag
                      }
                      that.$classNoRepo.update(updatetemp).then((res) => {
                        if (res.results.affectedRows === 1) {
                          that.$Notice.success({
                            title: '提醒',
                            desc: '更新回退成功'
                          })
                        } else {
                          that.$Notice.error({
                            title: '提醒',
                            desc: '更新回退失败'
                          })
                        }
                      })
                      that.$Notice.error({
                        title: '提醒',
                        desc: '系统接口异常'
                      })
                      console.log(error)
                    })
                    .finally(() => {
                      that.edit = false
                      that.closeModal()
                      that.$Spin.hide()
                    })
                }).catch((err) => {
                  console.log('create Error: ', err)
                })
              }
            } else {
              try {
                that.$Spin.show()
                console.log('that.edit = ', that.edit)
                if (that.edit) {
                  posturl = 'editGroupInfo.whtml'
                  postgroup.id = that.$store.state.modals.workerGroup.data.id
                }

                that.$http({
                    baseURL: that.$store.state.modals.settings.baseURL,
                    url: posturl,
                    data: {
                      group: postgroup
                    },
                    method: 'post',
                    headers: {
                      'Content-Type': 'application/json',
                      'token': that.$store.state.modals.login.token
                    }
                  })
                  .then(function (data) {
                    if (data.data.code === '0') {
                      that.$Notice.success({
                        title: '提醒',
                        desc: data.data.msg
                      })
                      if (that.$store.state.modals.login.mode === '2' && !that.edit)
                        that.$classNoRepo.create(postgroup).then((res) => {
                          console.log('create = ', res)
                        }).catch((err) => {
                          console.log('create Error: ', err)
                        })
                      if (that.$store.state.modals.login.mode === '2' && that.edit)
                        that.$classNoRepo.update(postgroup).then((res) => {
                          console.log('create = ', res)
                        }).catch((err) => {
                          console.log('create Error: ', err)
                        })
                    } else {
                      that.$Notice.error({
                        title: '提醒',
                        desc: data.data.msg
                      })
                    }
                    console.log('handleSubmit', data)
                  })
                  .catch(function (error) {
                    that.$Notice.error({
                      title: '提醒',
                      desc: '系统接口异常'
                    })
                    console.log(error)
                  })
                  .finally(() => {
                    that.edit = false
                    that.closeModal()
                    that.$Spin.hide()
                  })
              } catch (ex) {
                that.$Notice.error({
                  title: '提醒',
                  desc: '参数异常'
                })
                that.edit = false
                that.closeModal()
                that.$Spin.hide()
              }
            }
          } else {
            that.$Notice.error({
              title: '提醒',
              desc: '输入数据不符合要求'
            })
          }
        })
      },
      visibleChange(isVisible) {
        if (!isVisible) {
          this.closeModal()
        } else {
          if (typeof this.$store.state.modals.workerGroup.data.name === 'undefined')
            return
          this.edit = true
          this.formInline.name = this.$store.state.modals.workerGroup.data.name
          this.formInline.contract = this.$store.state.modals.workerGroup.data.contract
          this.formInline.responseIdNumber = this.$store.state.modals.workerGroup.data.responseIdNumber
          this.formInline.teamIdNumber = this.$store.state.modals.workerGroup.data.teamIdNumber
          this.formInline.teamLeader = this.$store.state.modals.workerGroup.data.teamLeader
          this.formInline.memo = this.$store.state.modals.workerGroup.data.memo
        }
      },
      closeModal() {
        this.$store.dispatch('hideWorkerGroup')
        this.handleReset('formInline')
        this.$emit('classNoGet')
      },
      handleReset(name) {
        this.$refs[name].resetFields()
      }
    }
  }

</script>

<style scoped>
  .center {
    text-align: center;
  }

  .demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }

</style>
