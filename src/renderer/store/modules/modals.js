import boardsRepository from '@/repositories/boardsRepository'

const state = {
  newBoard: {
    isVisible: false,
    name: '',
    data: {},
    userid: 0
  },
  login: {
    isVisible: true,
    token: '',
    projectId: {},
    username: '',
    mode: ''
  },
  menuList: {
    data: [{
        name: '/',
        label: '项目信息'
      },
      {
        name: '/worker',
        label: '人员信息'
      },
      {
        name: '/group',
        label: '班组信息'
      }
    ]
  },
  workerGroup: {
    isVisible: false,
    data: {}
  },
  machineInfo: {
    isVisible: false,
    data: {}
  },
  card: {
    isVisible: false,
    data: {}
  },
  workKind: {
    selected: 0
  },
  workKindModal: {
    isVisible: false,
    data: {}
  },
  logModal: {
    isVisible: false
  },
  settings: {
    isVisible: false,
    currentVersion: '0.1.0',
    appName: '考勤管理系统旗舰版',
    boardsList: [],
    restartRequired: false,
    restartReqCloak: false,
    restartCountdown: 3,
    //NTJZXM000617 NTJZXM002270
    //baseURL: 'http://192.168.20.190:8080/erp-web/client/'
    baseURL: 'http://192.168.1.157:7001/erp-web/client/'
    //baseURL: 'http://192.168.20.190:8082/erp-web/client/'
    //baseURL: 'http://192.168.1.156:8083/erp-web/client/'
    //baseURL: 'http://58.221.137.62:8081/client/'//盐城线上
    //baseURL: 'http://218.91.253.77:8001/client/' //南通线上
  },
  moveToBoard: {
    isVisible: false,
    movingItemText: null,
    movingItemId: null
  },
  update: {
    isVisible: false
  }
}

const mutations = {
  SHOW_NEW_BOARD(state, val) {
    state.newBoard.isVisible = true
    state.newBoard.data = val
    state.newBoard.userid = val.id
  },
  HIDE_NEW_BOARD(state) {
    state.newBoard.isVisible = false
    state.newBoard.data = {}
    state.newBoard.userid = 0
  },
  SHOW_LOGIN(state) {
    state.login.isVisible = true
  },
  HIDE_LOGIN(state) {
    state.login.isVisible = false
  },
  SHOW_WORKERGROUP(statem, val) {
    state.workerGroup.isVisible = true
    state.workerGroup.data = val
  },
  HIDE_WORKERGROUP(state) {
    state.workerGroup.isVisible = false
  },
  SHOW_MACHINEINFO(statem, val) {
    state.machineInfo.isVisible = true
    state.machineInfo.data = val
  },
  HIDE_MACHINEINFO(state) {
    state.machineInfo.isVisible = false
    state.machineInfo.data = {}
  },
  SHOW_WORKKINDMODAL(statem, val) {
    state.workKindModal.isVisible = true
    state.workKindModal.data = val
  },
  HIDE_WORKKINDMODAL(state) {
    state.workKindModal.isVisible = false
    state.workKindModal.data = {}
  },
  SHOW_CARD(statem, val) {
    state.card.isVisible = true
    // state.card.data = val
  },
  HIDE_CARD(state, val) {
    state.card.isVisible = false
    // state.card.data = val
  },
  SET_NEW_BOARD_NAME(state, name) {
    state.newBoard.name = name
  },
  SET_TOKEN(state, token) {
    state.login.token = token
  },
  SET_MODE(state, mode) {
    state.login.mode = mode
  },
  SET_PROJECTID(state, projectId) {
    state.login.projectId = projectId
  },
  SET_USERNAME(state, username) {
    state.login.username = username
  },
  SET_WORKKINDSELECTED(state, index) {
    state.workKind.selected = index
  },
  SHOW_SETTINGS(state) {
    state.settings.isVisible = true
  },
  HIDE_SETTINGS(state) {
    state.settings.isVisible = false
  },
  SHOW_MOVE_TO_BOARD(state) {
    state.moveToBoard.isVisible = true
  },
  HIDE_MOVE_TO_BOARD(state) {
    state.moveToBoard.isVisible = false
  },
  SHOW_UPDATE_MODAL(state) {
    state.update.isVisible = true
  },
  HIDE_UPDATE_MODAL(state) {
    state.update.isVisible = false
  },
  SET_SETTINGS_BOARDS_LIST(state, boards) {
    state.settings.boardsList = boards
  },
  SET_SETTINGS_RESTART_REQUIRED(state, val) {
    state.settings.restartRequired = val
  },
  SET_RESTART_REQ_CLOAK(state, val) {
    state.settings.restartReqCloak = val
  },
  DECREASE_RESTART_REQ_CLOAK(state) {
    state.settings.restartCountdown -= 1
  },
  SET_MOVING_ITEM_ID(state, movingItemId) {
    state.moveToBoard.movingItemId = movingItemId
  },
  SET_MOVING_ITEM_TEXT(state, movingItemText) {
    state.moveToBoard.movingItemText = movingItemText
  },
  SHOW_LOG_MODAL(state) {
    state.logModal.isVisible = true
    console.log('state.logModal.isVisible = ', state.logModal.isVisible)
  },
  HIDE_LOG_MODAL(state) {
    state.logModal.isVisible = false
  },
  SET_MENU(state, data) {
    state.menuList.data = data
  },
}

const actions = {
  showNewBoardModal({
    commit
  }, val) {
    commit('SHOW_NEW_BOARD', val)
  },
  hideNewBoardModal({
    commit
  }) {
    commit('HIDE_NEW_BOARD')
  },
  showLoginModal({
    commit
  }) {
    commit('SHOW_LOGIN')
  },
  hideLoginModal({
    commit
  }) {
    commit('HIDE_LOGIN')
  },
  showSettingsModal({
    commit
  }) {
    commit('SHOW_SETTINGS')
  },
  hideSettingsModal({
    commit
  }) {
    commit('HIDE_SETTINGS')
  },
  showWorkerGroup({
    commit
  }, val) {
    commit('SHOW_WORKERGROUP', val)
  },
  hideWorkerGroup({
    commit
  }) {
    commit('HIDE_WORKERGROUP')
  },
  showWorkKindModal({
    commit
  }, val) {
    commit('SHOW_WORKKINDMODAL', val)
  },
  hideWorkKindModal({
    commit
  }) {
    commit('HIDE_WORKKINDMODAL')
  },
  showCard({
    commit
  }, val) {
    commit('SHOW_CARD', val)
  },
  hideCard({
    commit
  }, val) {
    commit('HIDE_CARD', val)
  },
  showMachineInfo({
    commit
  }, val) {
    commit('SHOW_MACHINEINFO', val)
  },
  hideMachineInfo({
    commit
  }) {
    commit('HIDE_MACHINEINFO')
  },
  showMoveToBoard({
    commit
  }, {
    itemId,
    itemText
  }) {
    commit('SET_MOVING_ITEM_ID', itemId)
    commit('SET_MOVING_ITEM_TEXT', itemText)
    commit('SHOW_MOVE_TO_BOARD')
  },
  hideMoveToBoardModal({
    commit
  }) {
    commit('HIDE_MOVE_TO_BOARD')
  },
  showUpdateModal({
    commit
  }) {
    commit('SHOW_UPDATE_MODAL')
  },
  hideUpdateModal({
    commit
  }) {
    commit('HIDE_UPDATE_MODAL')
  },
  showLogModal({
    commit
  }) {
    commit('SHOW_LOG_MODAL')
  },
  hideLogModal({
    commit
  }) {
    commit('HIDE_LOG_MODAL')
  },
  fetchSettingsBoardsList({
    commit
  }) {
    commit('SET_SETTINGS_BOARDS_LIST', boardsRepository.getList())
  },
  setRestartRequired({
    commit
  }) {
    commit('SET_SETTINGS_RESTART_REQUIRED', true)
  },
  showRestartReqCloak({
    commit
  }) {
    commit('SET_RESTART_REQ_CLOAK', true)
  },
  decreaseRestartCountdown({
    commit
  }) {
    commit('DECREASE_RESTART_REQ_CLOAK')
  },
  setNewBoardName({
    commit
  }, val) {
    commit('SET_NEW_BOARD_NAME', val)
  },
  setWorkKindSelected({
    commit
  }, val) {
    commit('SET_WORKKINDSELECTED', val)
  },
  resetNewBoardName({
    commit
  }) {
    commit('SET_NEW_BOARD_NAME', '')
  },
  resetToken({
    commit
  }) {
    commit('SET_TOKEN', '')
  },
  setToken({
    commit
  }, val) {
    commit('SET_TOKEN', val)
  },
  setMode({
    commit
  }, val) {
    commit('SET_MODE', val)
  },
  resetProjectId({
    commit
  }) {
    commit('SET_PROJECTID', '')
  },
  setProjectId({
    commit
  }, val) {
    commit('SET_PROJECTID', val)
  },
  resetUserName({
    commit
  }) {
    commit('SET_USERNAME', '')
  },
  setUserName({
    commit
  }, val) {
    commit('SET_USERNAME', val)
  },
  setMenu({
    commit
  }, val) {
    commit('SET_MENU', val)
    console.log('state.menuList.data = ', state.menuList.data)
  }
}

export default {
  state,
  mutations,
  actions
}
