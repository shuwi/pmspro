<template>
  <Modal id="machine-info-modal" v-model="isVisible" @on-visible-change="visibleChange" :mask-closable="false"
    :footer-hide="true" width="460" :closable="true">
    <p slot="header">
      <Icon type="md-finger-print" />
      <span style="font-weight:normal;">{{ formInline.id != 0? '修改':'新增'}}考勤机主信息</span>
    </p>
    <Form ref="formInline" :model="formInline" :rules="ruleInline" :label-width="110">
      <FormItem prop="ip" label="IP">
        <i-input type="text" v-model.trim="formInline.ip" placeholder="请填写设备IP" style="width: 260px" :disabled="ipinput">
        </i-input>
      </FormItem>
      <FormItem prop="port" label="端口">
        <InputNumber :max="10000" :min="0" v-model.number="formInline.port" style="width: 260px"></InputNumber>
      </FormItem>
      <FormItem prop="serverIp" label="服务器IP">
        <i-input type="text" v-model.trim="formInline.serverIp" placeholder="请填写IP" style="width: 260px" :disabled="ipinput">
        </i-input>
      </FormItem>
      <FormItem prop="serverPort" label="服务器端口">
        <InputNumber :max="10000" :min="0" v-model.number="formInline.serverPort" style="width: 260px"></InputNumber>
      </FormItem>
      <FormItem prop="sn" label="设备号">
        <i-input type="text" v-model.trim="formInline.sn" placeholder="请填写考勤机设备号" clearable style="width: 260px"
          :disabled="ipinput">
        </i-input>
      </FormItem>
      <FormItem label="设备属性" prop="deviceProperty">
        <Select v-model="formInline.deviceProperty" style="width:130px">
          <Option v-for="item in dpList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem prop="name" label="名称">
        <i-input type="text" v-model.trim="formInline.name" placeholder="请填写考勤机名称" clearable style="width: 260px">
        </i-input>
      </FormItem>
      <FormItem prop="remark" label="描述信息">
        <i-input type="textarea" v-model.trim="formInline.remark" :autosize="{minRows: 2,maxRows: 5}" placeholder="请填写考勤机描述信息"
          clearable style="width: 260px">
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
  Date.prototype.format = function (format) {
    var o = {
      "M+": this.getMonth() + 1, //month
      "d+": this.getDate(), //day
      "h+": this.getHours(), //hour
      "m+": this.getMinutes(), //minute
      "s+": this.getSeconds(), //second
      "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
      "S": this.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
      (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(format))
        format = format.replace(RegExp.$1,
          RegExp.$1.length == 1 ? o[k] :
          ("00" + o[k]).substr(("" + o[k]).length));
    return format;
  }
  export default {
    name: 'machine-info-modal',
    computed: {
      isVisible: {
        get() {
          return this.$store.state.modals.machineInfo.isVisible
        },
        set(value) {
          this.$store.state.modals.machineInfo.isVisible = value
        }
      }
    },
    data() {
      return {
        ipinput: false,
        dpList: [{
            value: 0,
            label: '其他'
          },
          {
            value: 1,
            label: '录入'
          },
          {
            value: 2,
            label: '进门'
          },
          {
            value: 3,
            label: '出门'
          }
        ],
        formInline: {
          ip: '',
          port: null,
          serverIp: '',
          serverPort: null,
          name: '',
          sn: '',
          id: 0,
          deviceProperty: '0',
          projectId: '',
          remark: ''
        },
        ruleInline: {
          name: [{
            required: true,
            message: '请输入考勤机名称',
            trigger: 'blur'
          }],
          port: [{
            required: true,
            message: '请输入端口号',
            trigger: 'blur',
            type: 'number'
          }],
          ip: [{
              required: true,
              message: '请输入IP',
              trigger: 'blur'
            },
            {
              type: 'string',
              min: 4,
              message: 'IP至少4位',
              trigger: 'blur'
            }
          ],
          serverPort: [{
            required: true,
            message: '请输入服务器端口号',
            trigger: 'blur',
            type: 'number'
          }],
          serverIp: [{
              required: true,
              message: '请输入服务器IP',
              trigger: 'blur'
            },
            {
              type: 'string',
              min: 4,
              message: 'IP至少4位',
              trigger: 'blur'
            }
          ]
        }
      }
    },
    methods: {
      handleSubmit(name) {
        this.$refs[name].validate(valid => {
          var that = this
          if (valid) {
            that.$Spin.show()
            var data = {
              'port': that.formInline.port,
              'ip': that.formInline.ip,
              'name': that.formInline.name,
              'sn': that.formInline.sn,
              'serverPort': that.formInline.serverPort,
              'serverIp': that.formInline.serverIp,
              'deviceProperty': that.formInline.deviceProperty,
              'remark': that.formInline.remark,
              'projectId': that.$store.state.modals.login.projectId.id,
              'created': (new Date()).format("yyyy-MM-dd hh:mm:ss")
            }

            if (that.formInline.id <= 0) {
              that.$machinesRepo.create(data).then(() => {
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
            } else {
              data.id = that.formInline.id
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
                that.$Spin.hide()
                that.closeModal()
              })
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
          if (this.$store.state.modals.machineInfo.data.length !== 1) {
            return
          }
          this.handleReset('formInline')
          this.formInline = this.$store.state.modals.machineInfo.data[0]
        }
        if (this.formInline.id > 0) {
          this.ipinput = true
        } else {
          this.ipinput = false
        }
      },
      closeModal() {
        this.$store.dispatch('hideMachineInfo')
        this.handleReset('formInline')
        this.formInline.id = 0
        this.ipinput = false
        this.$emit('refreshMachineList')
      },
      handleReset(name) {
        this.$refs[name].resetFields()
      }
    }
  }

</script>
