<template>
  <div class="topBar">
    <div id="app">
      <div id="logo">
        <img :src="logo">
        <div id="logocontent">
          <span id="logot">{{appname}}</span>
          <span id="logov">v{{version}}</span>
        </div>
      </div>
      <div id="nav">
        <Menu mode="horizontal" :active-name="activeName" @on-select="navclick" accordion>
          <MenuItem v-for="item in menulist" :name="item.name" :key="item.name">{{ item.label }}</MenuItem>
        </Menu>
      </div>
    </div>
    <div class="actionBtn-container">
      <div class="actionBtn" @click="showSettingsModal">
        <Tooltip content="设置" placement="bottom-end" :transfer="true" :delay="500">
          <Icon type="md-menu" color="#000"></Icon>
        </Tooltip>
      </div>
      <div class="minimize actionBtn" @click="minimize">
        <Tooltip content="最小化" placement="bottom-end" :transfer="true" :delay="500">
          <Icon type="md-remove" color="#000"></Icon>
        </Tooltip>
      </div>
      <div class="close actionBtn" @click="closeApp">
        <Tooltip content="关闭" placement="bottom-end" :transfer="true" :delay="500">
          <Icon type="md-close" color="#000"></Icon>
        </Tooltip>
      </div>
    </div>
    <settings-modal></settings-modal>
    <login-modal></login-modal>
  </div>
</template>

<script>
  import SettingsModal from '../modals/settings/SettingsModal.vue'
  import LoginModal from '../modals/settings/LoginModal.vue'
  import router from '@/router'
  import {
    mapActions
  } from 'vuex'
  const remote = require('electron').remote
  const path = require('path')
  export default {
    name: 'TopBar',
    components: {
      SettingsModal,
      LoginModal
    },
    computed: {
      logo() {
        var logopath = path.join(__static, '/logo.png')
        return logopath
      },
      version() {
        return this.$store.state.modals.settings.currentVersion
      },
      appname() {
        return this.$store.state.modals.settings.appName
      },
      menulist: {
        get() {
          return this.$store.state.modals.menuList.data
        },
        set() {
          // TODO: when implementing customizing db location
        }
      }
    },
    data() {
      return {
        activeName: '/'
      }
    },
    methods: {
      ...mapActions([
        'showSettingsModal'
      ]),
      navclick(nv, e) {
        router.push(nv)
      },
      closeApp() {
        this.$Modal.confirm({
          title: '确认',
          content: '<p>确认关闭并退出本系统？</p>',
          onOk: () => {
            remote.app.quit()
          }
        })
      },
      minimize() {
        remote.BrowserWindow.getFocusedWindow().minimize()
      }
    }
  }

</script>
