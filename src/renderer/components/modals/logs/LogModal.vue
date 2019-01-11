<template>
  <Modal id="log-modal" v-model="isVisible" @on-visible-change="visibleChange" :mask-closable="false" :footer-hide="true"
    width="460" :closable="true">
    <p slot="header">
      <Icon type="ios-body" />
      <span style="font-weight:normal;">考勤信息</span>
    </p>
    <Form ref="formInline" :model="formInline" :rules="ruleInline" :label-width="110">
      <FormItem label="考勤时间" prop="logdate">
        <DatePicker type="datetime" v-model.trim="formInline.logdate" placeholder="请选择考勤时间" style="width: 260px" format="yyyy-MM-dd HH:mm:ss"></DatePicker>
      </FormItem>
      <FormItem label="设备" prop="machinesn">
        <Select v-model="formInline.machinesn" style="width:130px">
          <Option v-for="item in machineList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem prop="userid" label="用户身份证号">
        <i-input type="text" v-model.trim="formInline.userid" placeholder="请填写用户身份证号" clearable style="width: 260px">
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
    name: 'log-modal',
    computed: {
      isVisible: {
        get() {
          return this.$store.state.modals.logModal.isVisible
        },
        set(value) {
          this.$store.state.modals.logModal.isVisible = value
        }
      }
    },
    data() {
      return {
        machineList: [],
        formInline: {
          userid: '',
          machinesn: '',
          projectid: '',
          logdate: '',
          posttype: 1
        },
        ruleInline: {
          userid: [{
            required: true,
            message: '请填写工人身份证号',
            trigger: 'blur'
          }],
          machinesn: [{
            required: true,
            message: '请选择考勤设备',
            trigger: 'change'
          }],
          logdate: [{
            required: true,
            message: '请选择考勤时间',
            trigger: 'change',
            type: 'date'
          }]
        }
      }
    },
    methods: {
      ...mapActions([
        'showLogModal',
        'hideLogModal'
      ]),
      visibleChange(isVisible) {
        if (!isVisible) {
          this.closeModal()
        } else {
          this.$machinesRepo.getMachinesList(this.$store.state.modals.login.projectId
            .id).then((mlist) => {
            this.machineList = mlist.results
          }).catch((err) => {
            console.log('getMachinesList Error: ', err)
          })
        }
      },
      closeModal() {
        this.$store.dispatch('hideLogModal')
        this.$emit('reloadPage') // 通知重载列表
        this.resetInput()
      },
      resetInput() {
        this.$refs.formInline.resetFields()
      },
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          var that = this
          if (!valid) {
            that.$Message.error('验证未通过')
            return
          }

          that.$Spin.show()
          that.formInline.projectid = that.$store.state.modals.login.projectId.id
          that.$logsRepo.create(that.formInline).then((res) => {
            that.$Notice.success({
              title: '提醒',
              desc: '新增成功'
            })
          }).catch((err) => {
            that.$Notice.error({
              title: '提醒',
              desc: '新增失败'
            })

          }).finally(() => {
            that.$Spin.hide()
            that.closeModal()
          })
        })

      },
      handleReset(name) {
        this.$refs[name].resetFields()
      }
    }
  }

</script>
