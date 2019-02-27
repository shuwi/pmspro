<template>
  <div>
    <top-bar />
    <transition>
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  import TopBar from './components/bar/TopBar.vue'
  import settingsRepository from '@/repositories/settingsRepository'

  export default {
    name: 'PMS',
    components: {
      TopBar
    },
    computed: {
      baseURL: {
        get() {
          return this.$store.state.modals.settings.baseURL
        },
        set() {
          // TODO: when implementing customizing db location
        }
      }
    },
    data() {
      return {
        userData: {}
      }
    },
    created() {
      this.autoLogin()
    },
    methods: {
      autoLogin() {
        var schedule = require("node-schedule")
        var rule = new schedule.RecurrenceRule()
        var times = [1, 21, 41, 56]

        var that = this
        rule.minute = times
        schedule.scheduleJob(rule, function () {
          that.login()
        });
      },
      login() {
        var log = settingsRepository.getUserlog()
        this.userData = log
        var that = this
        that.$http({
            baseURL: that.baseURL,
            url: '/loginClient.whtml',
            params: {
              userName: that.userData.username,
              password: that.userData.password
            },
            method: 'post',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          })
          .then(function (data) {
            console.log(data)
            if (data.data.code === '0') {
              if (data.data.project.projectProgress === '开工' || data.data.project.projectProgress === '003' ||
                data.data.project.projectProgress === '006') {
                that.$store.dispatch('setToken', data.data.token)
                that.$store.dispatch('setProjectId', data.data.project)
                that.$store.dispatch('setUserName', that.userData.username)

                that.$store.dispatch('setUserLoginName', that.userData.username)
                that.$store.dispatch('setUserLoginPassword', that.userData.password)

              } else {
                console.log('项目未开工')
              }
            } else {
              that.$store.dispatch('showLoginModal')
              console.log(data.data.msg)
            }
          })
          .catch(function (error) {
            that.$store.dispatch('showLoginModal')
            console.log(error)
          })
          .finally(() => {

          })
      }
    }
  }

</script>

<style lang="scss">
  @import url('~animate.css');

  html {
    font-size: 10px;
  }

  body {
    font-family: 'Microsoft Yahei', -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Droid Sans, Helvetica Neue, sans-serif;
    height: 100vh;
    width: 96vw;
    padding: 0;
    margin-top: 3rem;
    overflow: scroll;
    font-size: 1.5rem;
    background: #fff;

    #logo {
      position: fixed;
      top: 0px;
      width: 550px;
      left: 0px;
      padding: 0px;
      background: #eef0f6;
      height: 80px;
      border-bottom: 1px solid #D6D8DD;
    }

    #logo img {
      margin: 26px 0 0 20px;
      display: inline-block;
    }

    #logocontent {
      margin-top: 0;
      width: 450px;
      height: 55px;
      display: inline-block;
      text-align: left;
      line-height: 55px;
    }

    #logot {
      font-size: 18px;
      font-weight: 600;
      color: #555;
      display: inline-block;
    }

    #logov {
      font-size: 12px;
      line-height: 2em;
      display: inline-block;
    }

    #nav {
      position: fixed;
      top: 35px;
      width: 90vw;
      left: 460px;
      padding: 0px;
      height: 45px;
      text-align: left;
      background: #eef0f6;
      border-bottom: 1px solid #D6D8DD;
    }

    .topBar {
      -webkit-app-region: drag;
      cursor: pointer;
      height: 35px;
      position: fixed;
      z-index: 11;
      top: 0px;
      left: 0px;
      width: 100%;
      padding: 6px;
      -webkit-transition: all .3s;
      transition: all .3s;
      user-select: none;
      text-align: center;
      color: rgb(49, 49, 49);
      font-size: 12px;
      font-weight: 500;
      background: #eef0f6;
    }

    .actionBtn-container {
      position: fixed;
      right: 0;
      top: 0;
      display: flex;
    }

    .actionBtn {
      -webkit-app-region: no-drag;
      font-size: 16px;
      width: 25px;
      height: 25px;
      text-align: center;
      -webkit-transition: all .3s;
      transition: all .3s;
      opacity: .7;
      margin: 0 6px;
    }

    .actionBtn:hover {
      opacity: 1;
    }

    .close {
      margin: 0 10px 0 0;
    }

    .ivu-menu-light {
      background: inherit;
    }

    .ivu-menu-horizontal {
      height: 25px;
      line-height: 5px;
    }

    .ivu-menu-horizontal.ivu-menu-light:after {
      background: inherit;
    }

    .ivu-menu-horizontal .ivu-menu-item,
    .ivu-menu-horizontal .ivu-menu-submenu {
      padding: 0;
      margin: 0 25px;
    }

    .ivu-tabs-tab-active .close-icon {
      opacity: 1;
    }

    .ivu-tabs-tab:hover .close-icon {
      display: inline-block;
      opacity: 1;
    }

    .ivu-tabs-bar .ivu-tabs-tab-active {
      border-bottom: 5px solid #2d8cf0;
    }

    .ivu-page-item a {
      font-family: 'Microsoft Yahei', -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Droid Sans, Helvetica Neue, sans-serif !important;
      font-size: 12px;
    }

    .ivu-page-total {
      font-size: 12px;
    }

    .close-icon {
      opacity: 0;
      transition: opacity 0.3s;
      position: absolute;
      padding-left: 3px;
    }

    .ivu-menu-light.ivu-menu-horizontal {
      line-height: 1em;
    }

    #probg {
      background-repeat: no-repeat;
      background-size: 100% 100%;
      -moz-background-size: 100% 100%;
      width: 100vw;
      height: 100vh;
      margin-top: 80px;
    }

    #probg img {
      position: absolute;
      z-index: -111;
      width: 100%;
    }

    .ivu-page-simple {
      font-size: 1.2rem;
    }

    .ivu-tabs-bar {
      user-select: none;
      border-bottom: 1px solid #f8f8f9;
    }

    .ivu-tabs-mini .ivu-tabs-tab {
      font-size: 14px;
    }

    .ivu-table td.address-table-info-column {
      color: #555;
    }

    .ivu-tabs-ink-bar {
      height: 1px;
    }

    .Circle-custom {
      text-align: center;
      padding-top: 200px;
      margin: 0 auto;
      color: #fff;
      z-index: 333;
    }

    .Circle-custom h1 {
      color: #fff;
      font-size: 40px;
      font-weight: normal;
    }

    .Circle-custom p {
      color: #2d8cf0;
      font-size: 20px;
      margin: 10px 0 15px;
    }

    .tpane {
      margin: 50px 0 0 0;
      overflow: auto;
    }

    .ivu-tabs-tab {
      font-size: 12.5px;
    }

    .ivu-tabs-mini .ivu-tabs-tab {
      padding: 8px 26px;
    }

    .btn {
      margin-right: 10px;
    }

    .ivu-modal-mask {
      background: #f8f9fd;
    }

    .ivu-modal-content {
      margin-bottom: 30px;
      border: 1px solid rgba(105,87,218,.06);
      border-radius: 6px;
      box-shadow: 0 2px 10px 0 rgba(33, 35, 68, 0.13);
      transition: all .4s ease-in-out;
    }

    .ivu-modal-confirm-head-title {
      font-size: 14px;
    }

    .ivu-radio-group-button .ivu-radio-wrapper-checked {
      background: #5cadff;
      color: #fff;
    }

    .ivu-radio-wrapper-checked:hover {
      color: #fff !important;
    }

    .ivu-card-head {
      background: #f8f8f9;
      color: #17233d;
    }

    .ivu-card-body {
      background: #f8f8f9;
      font-size: 12px;
      line-height: 2em;
    }

    textarea.ivu-input {
      font-size: 12px;
    }

    .ivu-collapse {
      border-radius: 6px;
      background: #f8f8f9;
      border: 1px solid #e0e0e0;
    }

    .ivu-tree {
      background: #f9fafb;
    }

    .ivu-tree ul li {
      padding: 6px 0;
      margin: 0;
    }

    .ivu-checkbox-inner {
      border: 2px solid #555;
    }

  }

  ::-webkit-scrollbar {
    width: 0px;
    height: 0px;
  }

  /*定义滚动条轨道 内阴影+圆角*/
  ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(136, 136, 136, 0.3);
    background-color: rgb(255, 255, 255);
  }

  /*定义滑块 内阴影+圆角*/
  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: #3f3f3f;
  }

</style>
