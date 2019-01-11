<template>
  <Modal id="worker-modal" v-model="isVisible" @on-visible-change="visibleChange" :mask-closable="false" :footer-hide="true"
    width="850" :scrollable="true" class-name="vertical-center-modal">
    <p slot="header">
      <Icon type="md-person"></Icon>
      <span style="font-weight:normal;">{{user.id !== 0?'修改':'添加'}}人员</span>
    </p>
    <Spin size="large" fix v-if="loadingPostUser"></Spin>
    <Form ref="user" :model="user" :rules="ruleValidate" :label-width="110">
      <div class="container">
        <div>
          <FormItem label="证件类型" prop="idCardType">
            <Select v-model="user.idCardType" style="width:200px">
              <Option v-for="item in idCardTypeArr" :value="item.datacode" :key="item.datacode">{{ item.name }}</Option>
            </Select>
          </FormItem>
        </div>
        <div>
          <FormItem label="" v-if="user.id === 0">
            <Button @click="getUserInfo" size="small" shape="circle" icon="md-wifi">身份证读取</Button>
          </FormItem>
        </div>
        <div>
          <FormItem label="身份证号" prop="userId">
            <Input v-model="user.userId" placeholder="请填写身份证号" style="width:200px" disabled />
          </FormItem>
        </div>
        <div class="item-b">
          <FormItem label="" prop="photo">
            <img v-if="typeof user.photo!=='undefined'" :src="'data:image/bmp;base64,'+user.photo" width="100px">
            <Input v-model="user.photo" style="display:none;" />
          </FormItem>
        </div>
        <div>
          <FormItem label="人员姓名" prop="name">
            <Input v-model="user.name" placeholder="请填写人员姓名" style="width:200px" disabled />
          </FormItem>
        </div>
        <div>
          <FormItem label="生日" prop="relbirthday">
            <DatePicker placeholder="请选择生日" v-model="user.relbirthday" :value="user.relbirthday" style="width:200px"
              format="yyyy-MM-dd" disabled></DatePicker>
          </FormItem>
        </div>
        <div>
          <FormItem label="人员类别" prop="ptype">
            <RadioGroup v-model="user.ptype" type="button" size="small" @on-change="ptypeChange">
              <Radio label="1">项目人员</Radio>
              <Radio label="2">管理人员</Radio>
            </RadioGroup>
          </FormItem>
        </div>
        <div>
          <FormItem label="性别" prop="gender">
            <RadioGroup v-model="user.gender" type="button" style="width:200px" size="small">
              <Radio label="1" disabled>男</Radio>
              <Radio label="0" disabled>女</Radio>
            </RadioGroup>
          </FormItem>
        </div>
        <div>
          <FormItem label="民族" prop="nation">
            <Select v-model="user.nation" style="width:200px" disabled>
              <Option v-for="item in nationArr" :value="item.code" :key="item.code">{{ item.name }}</Option>
            </Select>
          </FormItem>
        </div>
        <div>
          <FormItem label="籍贯" prop="birthPlaceCode">
            <Input v-model="user.birthPlaceCode" placeholder="请填写籍贯" style="width:200px" disabled />
          </FormItem>
        </div>
        <div>
          <FormItem label="电话号码" prop="mobile">
            <Input v-model="user.mobile" placeholder="请填写电话号码" style="width:200px" />
          </FormItem>
        </div>
        <div>
          <FormItem label="政治面貌" prop="politicsType">
            <Select v-model="user.politicsType" style="width:200px">
              <Option value="0">中共党员</Option>
              <Option value="1">中共预备党员</Option>
              <Option value="2">共青团员</Option>
              <Option value="3">群众</Option>
            </Select>
          </FormItem>
        </div>
        <div>
          <FormItem label="家庭住址" prop="homeAddress">
            <Input v-model="user.homeAddress" placeholder="请填写家庭住址" style="width:200px" disabled />
          </FormItem>
        </div>
        <div>
          <FormItem label="暂住地址" prop="currentAddresss">
            <Input v-model="user.currentAddresss" placeholder="请填写暂住地址" style="width:200px" clearable :maxlength="25" />
          </FormItem>
        </div>
        <div>
          <FormItem label="是否加入工会" prop="unJoined">
            <RadioGroup v-model="user.unJoined" type="button" size="small" @on-change="joinedChange">
              <Radio label="1">已加入</Radio>
              <Radio label="0">未加入</Radio>
            </RadioGroup>
          </FormItem>
        </div>
        <div>
          <FormItem label="加入工会时间">
            <FormItem prop="joinedTimeNew">
              <DatePicker placeholder="请选择加入工会时间" v-model="user.joinedTimeNew" style="width:200px" format="yyyy-MM-dd"
                @on-change="joinedTimeNewChange" :disabled="joinedTimeDisabled"></DatePicker>
            </FormItem>
          </FormItem>
        </div>
        <div>
          <FormItem label="文化程度" prop="cultureLevelType">
            <Select v-model="user.cultureLevelType" style="width:200px">
              <Option value="0">小学</Option>
              <Option value="1">初中</Option>
              <Option value="2">高中</Option>
              <Option value="3">中专</Option>
              <Option value="4">大专</Option>
              <Option value="5">本科</Option>
              <Option value="6">硕士</Option>
              <Option value="7">博士</Option>
              <Option value="8">文盲</Option>
            </Select>
          </FormItem>
        </div>
        <div>
          <FormItem label="是否有重大病史" prop="noBadMedicalHistory">
            <RadioGroup v-model="user.noBadMedicalHistory" type="button" size="small">
              <Radio label="1">是</Radio>
              <Radio label="0">否</Radio>
            </RadioGroup>
          </FormItem>
        </div>
        <div>
          <FormItem label="紧急联系人" prop="urgentContractName">
            <Input v-model="user.urgentContractName" placeholder="请填写紧急联系人" style="width:200px" :maxlength="8" />
          </FormItem>
        </div>
        <div>
          <FormItem label="紧急联系人电话" prop="urgentContractCellphone">
            <Input v-model="user.urgentContractCellphone" placeholder="请填写紧急联系人电话" style="width:200px" />
          </FormItem>
        </div>
        <div>
          <FormItem label="开始工作日期" prop="workDateNew">
            <DatePicker placeholder="请选择开始工作日期" v-model="user.workDateNew" style="width:200px" @on-change="workDateNewChange"
              format="yyyy-MM-dd"></DatePicker>
          </FormItem>
        </div>
        <div>
          <FormItem label="工人住宿类型" prop="workAccommodationType">
            <Select v-model="user.workAccommodationType" style="width:200px">
              <Option value="0">场外住宿</Option>
              <Option value="1">场内住宿</Option>
            </Select>
          </FormItem>
        </div>
        <div>
          <FormItem label="计划用工开始日期" prop="beginnew">
            <DatePicker placeholder="请选择开始日期" v-model="user.beginnew" style="width:200px" format="yyyy-MM-dd"></DatePicker>
          </FormItem>
        </div>
        <div>
          <FormItem label="计划用工结束日期" prop="endnew">
            <DatePicker placeholder="请选择结束日期" v-model="user.endnew" style="width:200px" format="yyyy-MM-dd"></DatePicker>
          </FormItem>
        </div>
        <div>
          <FormItem label="所属总包项目">
            {{project.name}}
          </FormItem>
        </div>
        <div v-show="workKindTypeVisible">
          <FormItem label="工种类别" prop="workKindType">
            <Select v-model="user.workKindType" style="width:200px" @on-change="workKindTypeChange">
              <Option value="1">普通工</Option>
              <Option value="2">辅助工</Option>
              <Option value="3">特殊工作人员</Option>
            </Select>
          </FormItem>
        </div>
        <div>
          <FormItem label="班组" prop="classNo">
            <Select v-model="user.classNo" style="width:100px" filterable @on-open-change="workGroupGet">
              <Option v-for="item in classNoArr" :value="item.name" :key="item.index">{{ item.name }}</Option>
            </Select>
            <Button shape="circle" icon="md-add" class="btn" @click="showWorkerGroupModal" size="small">添加班组</Button>
          </FormItem>
        </div>
        <div>
          <FormItem label="工种" prop="workKind">
            <Select v-model="user.workKind" style="width:200px" @on-change="workKindChange" filterable>
              <Option v-for="item in workKindArr" :value="item.id" :key="item.id">{{ item.kindName }}</Option>
            </Select>
          </FormItem>
        </div>
        <div v-show="classNoVisible">
          <FormItem label="人员类型" prop="personType">
            <Select v-model="user.personType" style="width:200px">
              <Option v-for="item in personTypeList" :value="item.value" :key="item.value">{{ item.value }}</Option>
            </Select>
          </FormItem>
        </div>
        <div>
          <FormItem label="">
            <Button type="primary" @click="handleSubmit('user')" shape="circle" style="width:100px;" :loading="loadingPostUser"
              icon="md-checkmark">提交</Button>
            <Button @click="handleReset('user')" style="margin-left: 8px;width:100px;" shape="circle" type="warning"
              icon="ios-undo">重置</Button>
          </FormItem>
        </div>
      </div>
    </Form>
    <card-modal @setWorkKindSelected="setWorkKindSelected" :userDataSend="userDataSend"></card-modal>
    <worker-group-modal @classNoGet="classNoGet" :userDatas="userDatas"></worker-group-modal>
  </Modal>

</template>

<script>
  import CardModal from '@/components/modals/workers/CardModal.vue'
  import WorkerGroupModal from '@/components/modals/groups/WorkerGroupModal.vue'

  import {
    mapActions
  } from 'vuex'
  var ffi = require('ffi')

  var DLL = ffi.Library('resources/termb.dll', {
    InitComm: ['int', ['int']],
    Authenticate: ['int', []],
    Read_Content: ['int', ['int']],
    GetPeopleName: ['int', ['string', 'int']],
    GetPeopleBirthday: ['int', ['string', 'int']],
    GetPeopleAddress: ['int', ['string', 'int']],
    GetPeopleNation: ['int', ['string', 'int']],
    GetPeopleIDCode: ['int', ['string', 'int']],
    GetPhotoBMP: ['int', ['string', 'int']],
    GetPeopleSex: ['int', ['string', 'int']],
    GetDepartment: ['int', ['string', 'int']],
    GetStartDate: ['int', ['string', 'int']],
    GetEndDate: ['int', ['string', 'int']],
    CloseComm: ['int', []]
  })
  var result = 0
  export default {
    name: 'worker-modal',
    components: {
      CardModal,
      WorkerGroupModal
    },
    computed: {
      isVisible: {
        get() {
          return this.$store.state.modals.newBoard.isVisible
        },
        set(val) {
          this.$store.state.modals.newBoard.isVisible = val
        }
      },
      newBoardName: {
        set(val) {
          this.$store.dispatch('setNewBoardName', val)
        },
        get() {
          return this.$store.state.modals.newBoard.name
        }
      },
      project() {
        return this.$store.state.modals.login.projectId
      }
    },
    data() {
      function dateFormat(date, fmt) {
        if (date === null || undefined === date) return ''
        var o = {
          'M+': date.getMonth() + 1, // 月份
          'd+': date.getDate(), // 日
          'h+': date.getHours(), // 小时
          'm+': date.getMinutes(), // 分
          's+': date.getSeconds(), // 秒
          'S': date.getMilliseconds() // 毫秒
        }
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
        for (var k in o) {
          if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : ((
              '00' + o[k]).substr(('' + o[k]).length)))
          }
        }
        return fmt
      }

      Date.prototype.toJSON = function () {
        return dateFormat(this, 'yyyy-MM-dd')
      }
      var validateMobile = (rule, value, callback) => {
        if (value === '') {
          callback()
        } else {
          if (!(/^1[34578]\d{9}$/.test(value))) {
            callback(new Error('手机号格式错误！'))
          } else {
            callback()
          }
        }
      }
      var validatePhone = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('手机号必填！'))
        } else {
          if (!(/^1[34578]\d{9}$/.test(value))) {
            callback(new Error('手机号格式错误！'))
          } else {
            callback()
          }
        }
      }
      return {
        userdatatemp: {},
        joinedTimeDisabled: true,
        userDataSend: {},
        userDatas: {},
        workKindTypeVisible: true,
        classNoVisible: false,
        personTypeList: [],
        idCardTypeArr: [],
        nationArr: [],
        classNoArr: [],
        loadingUpdates: false,
        loadingPost: false,
        loadingSQL: false,
        updateloadingPost: false,
        loadingPostUser: false,
        pname: '',
        workKindArr: [],
        workKindName: '',
        user: {
          id: 0,
          userId: '',
          name: '',
          ptype: '1',
          gender: '',
          birthday: '',
          relbirthday: '',
          mobile: '',
          homeAddress: '',
          currentAddresss: '',
          workKind: '',
          workKindName: '',
          classNo: '',
          projectId: '',
          idCardType: 1,
          nation: '',
          birthPlaceCode: '',
          politicsType: '3',
          unJoined: '0',
          joinedTimeNew: '',
          cultureLevelType: '0',
          noBadMedicalHistory: '0',
          urgentContractName: '',
          urgentContractCellphone: '',
          workDateNew: '',
          personTypeNew: [],
          professionlType: '0',
          personType: '',
          photo: '',
          workKindType: '1',
          workAccommodationType: '0',
          card: {},
          beginnew: '',
          endnew: ''
        },
        ruleValidate: {
          name: [{
            required: true,
            message: '请填写人员姓名',
            trigger: 'blur'
          }],
          userId: [{
            required: true,
            message: '请填写身份证号',
            trigger: 'blur'
          }],
          homeAddress: [{
            required: true,
            message: '请填写家庭地址',
            trigger: 'blur'
          }],
          birthPlaceCode: [{
            required: true,
            message: '请填写籍贯',
            trigger: 'blur'
          }],
          gender: [{
            required: true,
            message: '请选择性别',
            trigger: 'change'
          }],
          workKind: [{
            required: true,
            message: '请选择岗位（工种）',
            trigger: 'blur',
            type: 'number'
          }],
          classNo: [{
            required: true,
            message: '请选择班组',
            trigger: 'change'
          }],
          mobile: [{
            required: true,
            validator: validatePhone,
            trigger: 'blur'
          }],
          urgentContractCellphone: [{
            validator: validateMobile,
            trigger: 'blur'
          }],
        },

        personTypeData: [{
            value: '施工单位管理人员',
            label: '施工单位管理人员',
            children: [{
                value: '安全员',
                label: '安全员',
                code: '安全员'
              },
              {
                value: '施工员',
                label: '施工员',
                code: '施工员'
              },
              {
                value: '质量员',
                label: '质量员',
                code: '质量员'
              },
              {
                value: '项目经理',
                label: '项目经理',
                code: '项目经理'
              },
              {
                value: '项目技术负责人',
                label: '项目技术负责人',
                code: '项目技术负责人'
              },
              {
                value: '其他',
                label: '其他',
                code: '其他'
              }
            ]
          },
          {
            value: '建设单位管理人员',
            label: '建设单位管理人员',
            children: [{
              value: '项目负责人',
              label: '项目负责人',
              code: '项目负责人'
            }]
          },
          {
            value: '监理单位管理人员',
            label: '监理单位管理人员',
            children: [{
                value: '总监',
                label: '总监',
                code: '总监'
              },
              {
                value: '专监',
                label: '专监',
                code: '专监'
              },
              {
                value: '监理人员',
                label: '监理人员',
                code: '监理人员'
              }
            ]
          }
        ]
      }
    },
    methods: {
      ...mapActions([
        'showWorkerGroup',
        'showCard'
      ]),
      workGroupGet() {
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
            that.classNoArr = data.data.group
          })
          .catch(function (error) {
            console.log(error)
          })
      },
      showWorkerGroupModal() {
        if (this.user.name === '') {
          this.$Message.warning('请先完善人员信息再添加班组！')
          return
        }
        this.userDatas = this.user
        this.showWorkerGroup()
      },
      resetInput() {
        this.$refs.user.resetFields()
      },
      visibleChange(isVisible) {
        if (!isVisible) {
          this.user.id = 0
          this.closeModal()
        } else {
          var that = this

          if (typeof that.$store.state.modals.newBoard.data !== 'undefined') {
            if (that.$store.state.modals.newBoard.data.id !== 0) {
              that.user = that.$store.state.modals.newBoard.data
            }
            that.user.relbirthday = that.Toyyyy_MM_dd(that.user.birthday)

            that.user.workDateNew = that.user.workDate
            that.user.joinedTimeNew = that.user.joinedTime
            that.user.nation = that.user.nation === null ? '01' : that.user.nation

            that.user.beginnew = that.user.beginnew === null || that.user.beginnew === '' ? that.$store.state.modals.login
              .projectId.begin : that.user.beginnew
            that.user.endnew = that.user.endnew === null || that.user.endnew === '' ? that.$store.state.modals.login.projectId
              .end : that.user.endnew
            that.workKindChange(that.user.workKind)
            var tarr = [318, 319, 320]
            if (tarr.indexOf(that.user.workKind) >= 0) {
              that.workKindArr = [{
                id: 0,
                kindName: '请选择'
              }, {
                id: 318,
                kindName: '施工单位管理人员'
              }, {
                id: 319,
                kindName: '建设单位管理人员'
              }, {
                id: 320,
                kindName: '监理单位管理人员'
              }]
              that.user.ptype = '2'
              var temp = that.user.workKind
              that.ptypeChange('2')

              that.user.workKind = temp
            } else {
              that.$http({
                  baseURL: that.$store.state.modals.settings.baseURL,
                  url: '/getWorkKindInfo.whtml',
                  method: 'get',
                  headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'token': that.$store.state.modals.login.token
                  },
                  params: {
                    workKindType: that.user.workKindType
                  }
                })
                .then(function (data) {

                  that.workKindArr = data.data.workKind
                })
                .catch(function (error) {
                  console.log(error)
                })
            }
          }
          if (that.$store.state.modals.login.token === '') {
            that.$Notice.info({
              title: '提醒',
              desc: '登录已过期，请重新登录'
            })
            that.$store.dispatch('showLoginModal')
            return
          }

          that.$http({
              baseURL: that.$store.state.modals.settings.baseURL,
              url: '/getIdCardType.whtml',
              method: 'get',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'token': that.$store.state.modals.login.token
              }
            })
            .then(function (data) {
              console.log('getIdCardType = ', data)
              that.idCardTypeArr = data.data.record
            })
            .catch(function (error) {
              console.log(error)
            })

          that.$http({
              baseURL: that.$store.state.modals.settings.baseURL,
              url: '/getNation.whtml',
              method: 'get',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'token': that.$store.state.modals.login.token
              }
            })
            .then(function (data) {
              that.nationArr = data.data.record
            })
            .catch(function (error) {
              console.log(error)
            })
          that.workGroupGet()
          that.$Loading.finish()
        }
      },
      submitNewBoard() {
        if (this.newBoardName.trim() === '') {
          this.resetInput()
          this.$Message.warning('Please provide new board name')
          return false
        }
        this.$store
          .dispatch('saveNewBoard', this.newBoardName.trim())
          .then(savedBoardId => {
            this.$nextTick(() => this.$bus.$emit('boardAdded', savedBoardId))
            this.closeModal()
            this.$Message.success('Board added')
            this.$emit('newBoardSubmitted')
          })
      },
      closeModal() {
        this.$store.dispatch('hideNewBoardModal')
        this.$emit('reloadPage') // 通知重载列表
        this.resetInput()
      },
      handleReset(name) {
        this.$refs[name].resetFields()
      },
      getUserInfo() {
        for (var j = 1001; j < 1016; j++) {
          result = DLL.InitComm(j)
          if (result === 1) {
            break
          }
        }
        if (result !== 1) {
          this.$Notice.error({
            title: '提醒',
            desc: '设备初始化失败. '
          })
          return
        }
        var one = DLL.Authenticate()
        var two = DLL.Read_Content(1) // 读取基本信息
        if (two === 1) {
          let name = Buffer.alloc(25, 32)
          let birthday = Buffer.alloc(20, ' ')
          let address = Buffer.alloc(100, ' ')
          let nation = Buffer.alloc(20, ' ')
          let idcode = Buffer.alloc(20, ' ')
          let photo = Buffer.alloc(38862, 'base64')
          let sex = Buffer.alloc(4, 32)
          let sue = Buffer.alloc(100, ' ')
          let starttime = Buffer.alloc(100, ' ')
          let endtime = Buffer.alloc(100, ' ')
          var iconv = require('iconv-lite')
          result = DLL.GetPeopleName(name, 20)
          result = DLL.GetPeopleBirthday(birthday, 100)
          result = DLL.GetPeopleAddress(address, 71)
          result = DLL.GetPeopleNation(nation, 20)
          result = DLL.GetPeopleIDCode(idcode, 100)
          result = DLL.GetPhotoBMP(photo, 38862)
          result = DLL.GetPeopleSex(sex, 4)
          name.forEach(function (value, index, array) {
            if (value === 0) {
              array[index] = 32
            }
          })
          birthday.forEach(function (value, index, array) {
            if (value === 0) {
              array[index] = 32
            }
          })
          address.forEach(function (value, index, array) {
            if (value === 0) {
              array[index] = 32
            }
          })
          nation.forEach(function (value, index, array) {
            if (value === 0) {
              array[index] = 32
            }
          })
          idcode.forEach(function (value, index, array) {
            if (value === 0) {
              array[index] = 32
            }
          })
          sex.forEach(function (value, index, array) {
            if (value === 0) {
              array[index] = 32
            }
          })

          this.user.name = iconv.decode(name, 'gbk').trim()
          this.user.homeAddress = iconv.decode(address, 'gbk').trim()
          var code = ''
          if (this.nationArr.length > 0) {
            this.nationArr.forEach(function (value, index, array) {
              if (value.name === iconv.decode(nation, 'gbk').trim() + '族') {
                code = value.code
              }
            })
          }
          this.user.nation = code
          this.user.relbirthday = this.Toyyyy_MM_dd(iconv.decode(birthday, 'gbk').trim())
          this.user.birthday = this.ToyyyyMMdd(iconv.decode(birthday, 'gbk').trim())
          this.user.userId = iconv.decode(idcode, 'utf8').trim()
          this.user.photo = photo.toString('base64')
          this.user.gender = iconv.decode(sex, 'gbk').trim() === '男' ? '1' : '0'

          var ss = this.user.userId.substring(0, 2)
          const values = this.$store.state.settings.placeCode
          var that = this
          values.forEach(function (value, index, array) {
            if (value.code === ss) {
              that.user.birthPlaceCode = value.name
            }
          })
        } else {
          this.$Notice.error({
            title: '提醒',
            desc: `身份证信息读取失败`
          })
        }

        DLL.CloseComm()
      },
      Toyyyy_MM_dd(setDate) {
        var valDate = ''
        if (typeof setDate === 'undefined' || setDate === null) {
          return ''
        }
        if (setDate.length === 8) {
          valDate = setDate.substring(0, 4) + '-' + setDate.substring(4, 6) + '-' + setDate.substring(6, 8)
          return valDate
        } else if (setDate.length === 6) {
          valDate = setDate.substring(0, 4) + '-' + setDate.substring(4, 6)
          return valDate
        }
        return valDate
      },
      ToyyyyMMdd(setDate) {
        var valDate = ''
        if (setDate.length === 8) {
          valDate = setDate.substring(0, 4) + '' + setDate.substring(4, 6) + '' + setDate.substring(6, 8)
          return valDate
        } else if (setDate.length === 6) {
          valDate = setDate.substring(0, 4) + '' + setDate.substring(4, 6)
          return valDate
        }
        return valDate
      },
      workDateNewChange(v) {
        this.user.workDate = new Date(v)
        this.user.workDateNew = v
      },
      joinedTimeNewChange(v) {
        this.user.joinedTime = new Date(v)
        this.user.joinedTimeNew = v
      },
      workKindChange(v) {
        if (v === 318) {
          this.personTypeList = this.personTypeData[0].children
          this.user.workKindName = '施工单位管理人员'
        }
        if (v === 319) {
          this.personTypeList = this.personTypeData[1].children
          this.user.workKindName = '建设单位管理人员'
        }
        if (v === 320) {
          this.personTypeList = this.personTypeData[2].children
          this.user.workKindName = '监理单位管理人员'
        }
        var that = this

        if (v !== 318 && v !== 319 && v !== 320) {
          that.workKindArr.forEach(function (va, i, a) {
            if (va.id === v)
              that.user.workKindName = va.kindName
          })
        }

      },
      workKindTypeChange(v) {
        var that = this
        that.user.workKind = ''
        that.$http({
            baseURL: that.$store.state.modals.settings.baseURL,
            url: '/getWorkKindInfo.whtml',
            method: 'get',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'token': that.$store.state.modals.login.token
            },
            params: {
              workKindType: v
            }
          })
          .then(function (data) {
            that.workKindArr = data.data.workKind
          })
          .catch(function (error) {
            console.log(error)
          })
        if (v === '3') {
          that.userDataSend = that.user
          that.showCard()
        }
      },
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          var that = this
          if (that.$store.state.modals.login.token === '') {
            that.$Notice.success({
              title: '提醒',
              desc: '登录已过期，请重新登录'
            })
            that.$store.dispatch('showLoginModal')
            return
          }

          if (valid && that.$store.state.modals.login.token !== '') {

            that.user.projectId = that.$store.state.modals.login.projectId.id
            that.user.card = that.$store.state.modals.card.data
            var userdata = that.user
            var tarr = [318, 319, 320]
            if (tarr.indexOf(userdata.workKind) >= 0) {
              if (userdata.personType === '') {
                that.$Message.error('录入的人员是管理人员，人员类型是必选项!')
                return
              }
            }
            delete userdata.professionlTypeNew
            delete userdata.personTypeNew
            delete userdata.id
            that.loadingPostUser = true
            that.userdatatemp = Object.assign({}, userdata)

            if (userdata.userId === '') {
              that.$Message.error('数据丢失错误!')
              return
            }
            var posturl = 'addUser.whtml'

            userdata.workDate = null
            userdata.joinedTime = null
            var postdata = {
              user: [userdata]
            }
            if (that.$store.state.modals.newBoard.userid > 0) {
              posturl = 'editUser.whtml'
              postdata = {
                editUser: userdata
              }
            }
            console.log('postdata = ', postdata)

            that.$http({
                baseURL: that.$store.state.modals.settings.baseURL,
                url: posturl,
                data: postdata,
                method: 'post',
                headers: {
                  'Content-Type': 'application/json',
                  token: that.$store.state.modals.login.token
                }
              })
              .then(function (data) {
                if (data.data.result === 1) {
                  that.userOpt(that.userdatatemp)
                  that.$Notice.success({
                    title: '提醒',
                    desc: data.data.message
                  })
                } else {
                  that.$Notice.error({
                    title: '提醒',
                    desc: data.data.message
                  })
                }
                console.log(data)
              })
              .catch(function (error) {
                that.$Notice.error({
                  title: '提醒',
                  desc: '系统接口异常'
                })
                console.log(error)
              })
              .finally(() => {
                that.loadingPostUser = false
                that.closeModal()
                that.$refs['user'].resetFields()
              })
          } else {
            that.$Message.error('验证未通过')
          }
        })
      },
      userOpt(userdata) {
        var statlist = [
          'userId',
          'name',
          'mobile',
          'job',
          'groupname',
          'photo',
          'projectId',
          'workDate',
          'urgentContractCellphone',
          'urgentContractName',
          'noBadMedicalHistory',
          'cultureLevelType',
          'joinedTime',
          'unJoined',
          'politicsType',
          'birthPlaceCode',
          'nation',
          'idCardType',
          'classNo',
          'personType',
          'homeAddress',
          'workKind',
          'workKindName',
          'birthday',
          'gender',
          'ptype',
          'currentAddresss',
          'workAccommodationType',
          'workKindType',
          'beginnew',
          'endnew'
        ]

        var statdata = {}
        statlist.forEach(function (v, i, a) {
          statdata[v] = userdata[v]
        })

        var that = this
        console.log('statdata = ', statdata)
        if (that.$store.state.modals.login.mode !== '2') {
          that.$workersRepo.getCount(userdata.userId, userdata.projectId)
            .then((res) => {
              if (res.num > 0) {
                that.$workersRepo.update(statdata).then((re) => {
                  if (re.affected === 1) {
                    that.$Notice.success({
                      title: '提醒',
                      desc: '已存在该人员数据，修改成功'
                    })
                  } else {
                    that.$Notice.error({
                      title: '提醒',
                      desc: '已存在该人员数据，修改出错'
                    })
                  }
                }).catch((err) => {
                  that.$Notice.error({
                    title: '提醒',
                    desc: `修改出错${err}`
                  })
                }).finally(() => {
                  that.loadingPostUser = false
                  that.closeModal()
                  that.$refs['user'].resetFields()
                })
              } else {
                that.$workersRepo.create(statdata).then((re) => {
                  if (re.id > 0) {
                    that.$Notice.success({
                      title: '提醒',
                      desc: '新增成功'
                    })
                  } else {
                    that.$Notice.error({
                      title: '提醒',
                      desc: '新增出错'
                    })
                  }
                }).catch((err) => {
                  that.$Notice.error({
                    title: '提醒',
                    desc: `新增出错${err}`
                  })
                }).finally(() => {
                  that.loadingPostUser = false
                  that.closeModal()
                  that.$refs['user'].resetFields()
                })
              }
            })
        } else {
          that.$workersMysqlRepo.getCount(userdata.userId, userdata.projectId)
            .then((res) => {
              statdata.delFlag = -1
              if (res.results[0].num > 0) {
                that.$workersMysqlRepo.update(statdata).then((re) => {
                  if (re.affected === 1) {
                    that.$Notice.success({
                      title: '提醒',
                      desc: '已存在该人员数据，修改成功'
                    })
                  } else {
                    that.$Notice.error({
                      title: '提醒',
                      desc: '已存在该人员数据，修改出错'
                    })
                  }
                }).catch((err) => {
                  that.$Notice.error({
                    title: '提醒',
                    desc: `修改出错${err}`
                  })
                }).finally(() => {
                  that.loadingPostUser = false
                  that.closeModal()
                  that.$refs['user'].resetFields()
                })
              } else {
                that.$workersMysqlRepo.create(statdata).then((re) => {
                  if (re.id > 0) {
                    that.$Notice.success({
                      title: '提醒',
                      desc: '新增成功'
                    })
                  } else {
                    that.$Notice.error({
                      title: '提醒',
                      desc: '新增出错'
                    })
                  }
                }).catch((err) => {
                  that.$Notice.error({
                    title: '提醒',
                    desc: `新增出错${err}`
                  })
                }).finally(() => {
                  that.loadingPostUser = false
                  that.closeModal()
                  that.$refs['user'].resetFields()
                })
              }
            })
        }
      },
      setWorkKindSelected(v) {
        this.user.workKind = v
      },
      ptypeChange(v) {
        console.log('v = ', v)
        if (v === '2') {
          this.user.workKind = ''
          this.workKindTypeVisible = false
          this.classNoVisible = true
          this.workKindArr = [{
            id: 0,
            kindName: '请选择'
          }, {
            id: 318,
            kindName: '施工单位管理人员'
          }, {
            id: 319,
            kindName: '建设单位管理人员'
          }, {
            id: 320,
            kindName: '监理单位管理人员'
          }]
        } else {
          this.workKindTypeVisible = true
          this.classNoVisible = false
          this.user.workKindType = '1'
          this.user.workKind = ''
          this.workKindTypeChange('1')
        }
      },
      joinedChange(v) {
        if (v === '1') { // 加入工会
          this.joinedTimeDisabled = false
        } else {
          this.joinedTimeDisabled = true
          this.user.joinedTimeNew = ''
        }
      },
      classNoGet() {
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
            that.classNoArr = data.data.group.filter(function (val) {
              return val
            })
          })
          .catch(function (error) {
            console.log(error)
          })
      }
    }
  }

</script>
<style>
  .container {
    display: grid;
    grid-template-columns: 49% 49%;
    grid-auto-flow: row;
  }

  .item-b {
    grid-column: 2 / 3;
    grid-row: 2 / 5;
  }

</style>
