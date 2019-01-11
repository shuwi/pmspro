<template>
  <Modal id="workkind-modal" v-model="isVisible" @on-visible-change="visibleChange" :mask-closable="false" :footer-hide="true"
    width="460" :closable="true">
    <p slot="header">
      <Icon type="ios-body" />
      <span style="font-weight:normal;">工种信息</span>
    </p>
    <Form ref="formInline" :model="formInline" :rules="ruleInline" :label-width="110">
      <FormItem label="工种类别" prop="workKindType">
        <Select v-model="formInline.workKindType" style="width:200px" label-in-value @on-change="workKindTypeChange">
          <Option value="1">普通工</Option>
          <Option value="2">辅助工</Option>
          <Option value="3">特殊工作人员</Option>
        </Select>
      </FormItem>
      <FormItem prop="name" label="工种名称">
        <i-input type="text" v-model.trim="formInline.name" placeholder="请填写工种名称" clearable style="width: 260px">
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
  import {
    mapActions
  } from 'vuex'
  export default {
    name: 'work-kind-modal',
    computed: {
      isVisible: {
        get() {
          return this.$store.state.modals.workKindModal.isVisible
        },
        set() {

        }
      }
    },
    data() {
      return {
        formInline: {
          id: '',
          workKindType: '',
          workKindTypeName: '',
          name: ''
        },
        ruleInline: {
          name: [{
            required: true,
            message: '请填写工种名称',
            trigger: 'blur'
          }],
          workKindType: [{
            required: true,
            message: '请选择工种类别',
            trigger: 'blur'
          }]
        }
      }
    },
    methods: {
      ...mapActions([
        'showWorkKindModal',
        'hideWorkKindModal'
      ]),
      visibleChange(isVisible) {
        if (!isVisible) {
          this.formInline.id = 0
          this.closeModal()
        } else {
          var temp = this.$store.state.modals.workKindModal.data
          this.formInline.id = temp.id
          this.formInline.name = temp.name
          this.formInline.workKindType = temp.workKindType
          this.formInline.workKindTypeName = temp.workKindTypeName
        }
      },
      closeModal() {
        this.$store.dispatch('hideWorkKindModal')
        this.$emit('workKindGet') // 通知重载列表
        this.resetInput()
      },
      resetInput() {
        this.$refs.formInline.resetFields()
      },
      workKindTypeChange(sel) {
        if (typeof sel === 'undefined')
          return
        this.formInline.workKindType = sel.value
        this.formInline.workKindTypeName = sel.label
      },
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          var that = this
          if (!valid) {
            that.$Message.error('验证未通过')
            return
          }
          that.$Spin.show()
          console.log('that.formInline.id = ', that.formInline.id)
          if (that.formInline.id === '' || typeof that.formInline.id === 'undefined') {
            var data = {
              'name': that.formInline.name,
              'workKindType': that.formInline.workKindType,
              'workKindTypeName': that.formInline.workKindTypeName
            }
            that.$workkindRepo.create(data).then((res) => {
              that.$Notice.success({
                title: '提醒',
                desc: '新增成功'
              })
              console.log('res = ', res)
              var addid = res.results.insertId
              var postdata = {
                workId: addid,
                name: that.formInline.name,
                delFlag: 1
              }
              var postarr = []
              postarr.push(postdata)

              that.postWorkKindData(postarr)

            }).catch((err) => {
              that.$Notice.error({
                title: '提醒',
                desc: '新增失败'
              })

            }).finally(() => {
              that.$Spin.hide()
              that.closeModal()
            })
          } else {
            that.$workkindRepo.update(that.formInline).then((res) => {
              that.$Notice.success({
                title: '提醒',
                desc: '修改成功'
              })
              console.log('res = ', res)
              var postdata = {
                workId: that.formInline.id,
                name: that.formInline.name,
                delFlag: 1
              }
              var postarr = []
              postarr.push(postdata)
              that.postWorkKindData(postarr)

            }).catch((err) => {
              that.$Notice.error({
                title: '提醒',
                desc: '修改失败'
              })
              console.log('err = ', err)
            }).finally(() => {
              that.$Spin.hide()
              that.closeModal()
            })
          }
        })

      },
      handleReset(name) {
        this.$refs[name].resetFields()
      },
      postWorkKindData(postdata) {
        console.log('postdata = ', postdata)
        var that = this
        that.$http({
            baseURL: that.$store.state.modals.settings.baseURL,
            url: '/addClientWorkKind.whtml',
            method: 'post',
            data: {
              clientWorkkind: JSON.stringify(postdata)
            },
            headers: {
              'Content-Type': 'application/json',
              'token': that.$store.state.modals.login.token
            }
          })
          .then(function (data) {
            console.log('远程添加', data)
            if (data.data.code === 1) {
              that.$Notice.success({
                title: '提醒',
                desc: '远程操作成功'
              })
            } else {
              that.$Notice.error({
                title: '提醒',
                desc: '远程操作失败'
              })
            }
          })
          .catch(function (error) {
            that.$Notice.error({
              title: '提醒',
              desc: '远程操作异常！'
            })
            console.log(error)
          })
          .finally(() => {

          })
      }
    }
  }

</script>
