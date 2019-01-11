<template>
  <Modal :value="isVisible" @on-ok="closeModal" @on-visible-change="visibleChange" :scrollable="true" :mask-closable="false"
    footer-hide>
    <p slot="header" style="color:#555;">
      <Icon type="md-hammer" />
      <span>系统设置</span>
    </p>
    <div class="row title-row">
      <div class="title">
        <h4>{{appName}}</h4>&nbsp;&nbsp;
        <h6>v{{currentVersion}}</h6>
      </div>
    </div>
    <Collapse v-model="settingsCollapse" accordion>
      <Panel name="0">
        登记设备设置
        <p slot="content">
          <checkin-settings />
        </p>
      </Panel>
      <Panel name="1" v-if="dataBaseSetting">
        数据库设置
        <p slot="content">
          <general-settings />
        </p>
      </Panel>
    </Collapse>
    <p id="support" style="color:#555;text-align:center;padding:20px 0 10px 0;cursor:pointer;" @click="open('http://www.jsxywg.cn/')">
      &copy;2018 江苏星云网格信息技术有限公司提供全程技术支持
    </p>
  </Modal>
</template>

<script>
  import draggable from 'vuedraggable'
  import boardsRepository from '@/repositories/boardsRepository'
  import GeneralSettings from './GeneralSettings'
  import CheckinSettings from './CheckinSettings'

  const {
    dialog
  } = require('electron').remote

  export default {
    name: 'settings-modal',
    components: {
      CheckinSettings,
      GeneralSettings,
      draggable
    },
    created () {
      this.fetchSettingsBoardsList()
    },
    computed: {
      isVisible () {
        return this.$store.state.modals.settings.isVisible
      },
      currentVersion () {
        return this.$store.state.modals.settings.currentVersion
      },
      appName () {
        return this.$store.state.modals.settings.appName
      },
      restartRequired () {
        return this.$store.state.modals.settings.restartRequired
      },
      dataBaseSetting() {
        return this.$store.state.modals.login.mode === '2'
      }
    },
    data () {
      return {
        boardsLocal: [],
        settingsCollapse: '0'
      }
    },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      },
      createBackup () {
        const vm = this
        dialog.showSaveDialog({
          filters: [{
            name: 'json',
            extensions: ['json']
          }]
        }, function (fileName) {
          boardsRepository
            .exportDbToJSON(fileName)
            .then(() => {
              vm.$Message.success('File saved successfully')
            })
            .catch((err) => {
              vm.$Message.error({
                content: err.message,
                duration: 0,
                closable: true
              })
            })
        })
      },
      importBackup () {
        const vm = this
        dialog.showOpenDialog({
          properties: ['openFile'],
          filters: [{
            name: 'json',
            extensions: ['json']
          }]
        }, function (filePath) {
          boardsRepository.importDbFromJSON(filePath[0])
            .then(() => {
              vm.$Message.success('File imported successfully')
              vm.$store.dispatch('fetchBoards')
            })
            .catch((err) => {
              vm.$Message.error({
                content: err.message,
                duration: 0,
                closable: true
              })
            })
        })
      },
      fetchSettingsBoardsList () {
        this.$store.dispatch('fetchSettingsBoardsList')
          .then(() => {
            this.boardsLocal = JSON.parse(JSON.stringify(this.$store.state.modals.settings.boardsList))
          })
      },
      visibleChange (isVisible) {
        if (!isVisible) {
          this.closeModal()
        } else {
          this.fetchSettingsBoardsList()
        }
      },
      boardOrderChanged () {
        this.$store.dispatch('setRestartRequired')
      },
      showSuccessNotification () {
        this.$Message.success('Setting updated')
      },
      saveBoards () {
        this.$store.dispatch('saveBoardsArray', this.boardsLocal)
      },
      closeModal () {
        if (this.restartRequired) {
          this.saveBoards()
          this.$store.dispatch('showRestartReqCloak')
          this.$store.dispatch('hideSettingsModal')
        } else {
          this.$store.dispatch('hideSettingsModal')
        }
      },
      openSaveDialog (boardId) {
        const vm = this
        dialog.showSaveDialog({
          filters: [{
            name: 'JSON',
            extensions: ['json']
          }]
        }, function (fileName) {
          boardsRepository
            .exportBoardToJSON(fileName, boardId)
            .then(() => {
              vm.$Message.success('File saved successfully')
            })
            .catch((err) => {
              vm.$Message.error({
                content: err.message,
                duration: 0,
                closable: true
              })
            })
        })
      }
    }
  }
</script>

<style>
  .restart-required {
    font-size: 1em;
    color: #f0565e;
  }

  .row.title-row {
    border-bottom: 1px solid #f3f3f3;
    padding-bottom: 10px;
    margin-bottom: 20px;
    font-size: 1.5em;
  }

  .title {
    display: flex;
    justify-content: center;
    align-items: baseline;
  }

  .address {
    text-align: center;
    font-size: .5em;
    cursor: pointer;
  }

  .download-icon {
    cursor: pointer;
    margin-left: 5px;
    font-size: 1.5em;
  }

  h4 {
    margin: 5px 0;
  }

  .row {
    margin: 7px 0;
  }

  .board {
    position: relative;
    margin: 2px 0;
    padding: 2px;
    transition: all .3s;
  }

  .separator {
    border-bottom: 1px solid #f5f5f5;
    margin: 15px 0
  }

  .movable-icon {
    position: absolute;
    top: 2px;
    left: 3px;
    transform: rotate(90deg);
    font-size: 2em;
    opacity: .1;
    transition: all .25s;
    color: #41B883;
  }

  .draggable:hover .movable-icon {
    opacity: .8;
  }

  #support:hover{
    color:rgb(63, 63, 63) !important;
    text-decoration: underline;
  }

</style>
