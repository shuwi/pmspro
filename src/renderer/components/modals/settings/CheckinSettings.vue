<template>
  <div>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
      <FormItem label="主机" prop="host">
        <Input v-model="formValidate.host" placeholder="输入主机IP"></Input>
      </FormItem>
      <FormItem label="端口" prop="port">
        <Input v-model="formValidate.port" placeholder="输入端口号"></Input>
      </FormItem>
      <FormItem>
        <Button shape="circle" type="primary" @click="handleSubmit('formValidate')" style="width:120px;">提交</Button>
        <Button shape="circle" type="warning" @click="handleReset('formValidate')" style="width:120px;margin-left:8px;">重置</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
  import settingsRepository from '@/repositories/settingsRepository'
  export default {
    name: 'CheckinSettings',
    computed: {},
    data () {
      var validateIP = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入IP地址'))
        }
        setTimeout(() => {
          var regg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}$/
          if (!regg.test(value)) {
            callback(new Error('请输入正确的IP地址'))
          } else {
            callback()
          }
        }, 1000)
      }
      var validatePort = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入端口号'))
        }
        setTimeout(() => {
          var gr = /^\d{4,5}$/
          if (!gr.test(value)) {
            callback(new Error('请输入有效数字值'))
          } else {
            if (value < 1024 || value > 65535) {
              callback(new Error('端口号超出范围1024~65535'))
            } else {
              callback()
            }
          }
        }, 1000)
      }
      return {
        formValidate: {
          host: '',
          port: ''
        },
        ruleValidate: {
          host: [{
            validator: validateIP,
            trigger: 'blur'
          }],
          port: [{
            validator: validatePort,
            trigger: 'blur'
          }]
        }
      }
    },
    methods: {
      showSuccessNotification () {
        this.$Message.success('信息已成功更新！')
        this.$emit('settingsUpdated')
      },
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$store.dispatch('setCheckinPort', this.formValidate.port)
            this.$store.dispatch('setCheckinHost', this.formValidate.host)
            this.showSuccessNotification()
            this.$store.dispatch('hideSettingsModal')
          } else {
            this.$Message.error('请按要求填写后再提交')
          }
        })
      },
      handleReset (name) {
        this.$refs[name].resetFields()
      }
    },
    mounted () {
      var db = settingsRepository.getCheckinSettings()
      this.formValidate.host = db.checkinhost
      this.formValidate.port = db.checkinport
    }
  }
</script>

<style scoped>
  .row {
    margin: 7px 0;
  }

</style>
