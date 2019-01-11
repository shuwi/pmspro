import settingsRepository from '@/repositories/settingsRepository'

const state = {
  wasImported: true,
  itemCreationDate: true,
  prependNewItems: true,
  stickBoardsOnTop: true,
  markdownMode: true,
  baseURL: '',
  darkTheme: false,
  showUpdates: false,
  isuse: '0',
  host: 'localhost',
  user: 'root',
  password: 'demo123',
  database: 'labour',
  databaseport: 3306,
  chechinhost: '192.168.20.5',
  checkinport: 9922,
  workKindInfo: [],
  classNoInfo: [],
  nation: [],
  idCardType: [],
  placeCode: [{
      name: '北京市',
      code: '11'
    },
    {
      name: '天津市',
      code: '12'
    },
    {
      name: '河北',
      code: '13'
    },
    {
      name: '山西',
      code: '14'
    },
    {
      name: '内蒙古自治区',
      code: '15'
    },
    {
      name: '辽宁',
      code: '21'
    },
    {
      name: '吉林',
      code: '22'
    },
    {
      name: '黑龙江',
      code: '23'
    },
    {
      name: '上海市',
      code: '31'
    },
    {
      name: '江苏',
      code: '32'
    },
    {
      name: '浙江',
      code: '33'
    },
    {
      name: '安徽',
      code: '34'
    },
    {
      name: '福建',
      code: '35'
    },
    {
      name: '江西',
      code: '36'
    },
    {
      name: '山东',
      code: '37'
    },
    {
      name: '河南',
      code: '41'
    },
    {
      name: '湖北',
      code: '42'
    },
    {
      name: '湖南',
      code: '43'
    },
    {
      name: '广东',
      code: '44'
    },
    {
      name: '广西壮族自治区',
      code: '45'
    },
    {
      name: '海南',
      code: '46'
    },
    {
      name: '重庆',
      code: '50'
    },
    {
      name: '四川',
      code: '51'
    },
    {
      name: '贵州',
      code: '52'
    },
    {
      name: '云南',
      code: '53'
    },
    {
      name: '西藏自治区',
      code: '54'
    },
    {
      name: '陕西',
      code: '61'
    },
    {
      name: '甘肃',
      code: '62'
    },
    {
      name: '青海',
      code: '63'
    },
    {
      name: '宁夏回族自治区',
      code: '64'
    },
    {
      name: '新疆维吾尔自治区',
      code: '65'
    },
    {
      name: '台湾',
      code: '71'
    },
    {
      name: '香港特别行政区',
      code: '81'
    },
    {
      name: '澳门特别行政区',
      code: '91'
    }
  ]
}

const mutations = {
  SET_SETTINGS(state, settings) {
    Object.assign(state, settings)
  },
  SET_BASEURL(state, newBaseURL) {
    state.baseURL = newBaseURL
  },
  SET_PREPEND_NEW_ITEM(state, val) {
    state.prependNewItems = val
  },
  SET_MARKDOWN_MODE(state, val) {
    state.markdownMode = val
  },
  SET_DARK_THEME(state, val) {
    state.darkTheme = val
  },
  SET_ITEM_CREATION_DATE(state, val) {
    state.itemCreationDate = val
  },
  SET_STICK_BOARDS_ON_TOP(state, val) {
    state.stickBoardsOnTop = val
  },
  SET_SHOW_UPDATES(state, val) {
    state.showUpdates = val
  },
  SET_DB_ISUSE(state, val) {
    state.isuse = val
  },
  SET_HOST(state, val) {
    state.host = val
  },
  SET_USER(state, val) {
    state.user = val
  },
  SET_PASSWORD(state, val) {
    state.password = val
  },
  SET_DATABASE(state, val) {
    state.database = val
  },
  SET_DATABASEPORT(state, val) {
    state.databaseport = val
  },
  SET_CHECKINHOST(state, val) {
    state.checkinhost = val
  },
  SET_CHECKINPORT(state, val) {
    state.checkinport = val
  },
  SET_WORKKIND(state, val) {
    state.workKindInfo = val
  },
  SET_CLASSNO(state, val) {
    state.classNoInfo = val
  },
  SET_NATION(state, val){
    state.nation = val
  },
  SET_IDCARD(state, val){
    state.idCardType = val
  }
}

const actions = {
  fetchSettings({
    commit
  }) {
    commit('SET_SETTINGS', settingsRepository.getAppSettings())
  },
  setDbLocation({
    commit
  }, baseURL) {
    commit('SET_BASEURL', baseURL)
    settingsRepository.updateAppSettings({
      baseURL
    })
  },
  setPrependNewItem({
    commit
  }, prependNewItems) {
    commit('SET_PREPEND_NEW_ITEM', prependNewItems)
    settingsRepository.updateAppSettings({
      prependNewItems
    })
  },
  setMarkdownMode({
    commit
  }, markdownMode) {
    commit('SET_MARKDOWN_MODE', markdownMode)
    settingsRepository.updateAppSettings({
      markdownMode
    })
  },
  setDarkTheme({
    commit
  }, darkTheme) {
    commit('SET_DARK_THEME', darkTheme)
    settingsRepository.updateAppSettings({
      darkTheme
    })
  },
  setItemCreationDate({
    commit
  }, itemCreationDate) {
    commit('SET_ITEM_CREATION_DATE', itemCreationDate)
    settingsRepository.updateAppSettings({
      itemCreationDate
    })
  },
  setStickBoardsOnTop({
    commit
  }, stickBoardsOnTop) {
    commit('SET_STICK_BOARDS_ON_TOP', stickBoardsOnTop)
    settingsRepository.updateAppSettings({
      stickBoardsOnTop
    })
  },
  setShowUpdates({
    commit
  }, showUpdates) {
    commit('SET_SHOW_UPDATES', showUpdates)
    settingsRepository.updateAppSettings({
      showUpdates
    })
  },
  setDBIsUse({
    commit
  }, isuse) {
    commit('SET_DB_ISUSE', isuse)
    settingsRepository.updateDBSettings({
      isuse
    })
  },
  setDBHost({
    commit
  }, host) {
    commit('SET_HOST', host)
    settingsRepository.updateDBSettings({
      host
    })
  },
  setDBUser({
    commit
  }, user) {
    commit('SET_USER', user)
    settingsRepository.updateDBSettings({
      user
    })
  },
  setDBPassword({
    commit
  }, password) {
    commit('SET_PASSWORD', password)
    settingsRepository.updateDBSettings({
      password
    })
  },
  setDBDataBase({
    commit
  }, database) {
    commit('SET_DATABASE', database)
    settingsRepository.updateDBSettings({
      database
    })
  },
  setDBDataBasePort({
    commit
  }, port) {
    commit('SET_DATABASEPORT', port)
    settingsRepository.updateDBSettings({
      port
    })
  },
  setCheckinHost({
    commit
  }, checkinhost) {
    commit('SET_CHECKINHOST', checkinhost)
    settingsRepository.updateCheckinSettings({
      checkinhost
    })
  },
  setCheckinPort({
    commit
  }, checkinport) {
    commit('SET_CHECKINPORT', checkinport)
    settingsRepository.updateCheckinSettings({
      checkinport
    })
  },
  setUserLoginMode({
    commit
  }, mode) {
    settingsRepository.updateUserlog({
      mode
    })
  },
  setUserLoginName({
    commit
  }, username) {
    settingsRepository.updateUserlog({
      username
    })
  },
  setUserLoginPassword({
    commit
  }, password) {
    settingsRepository.updateUserlog({
      password
    })
  },
  setWorkKindInfo({
    commit
  }, workKindInfo) {
    commit('SET_WORKKIND', workKindInfo)
  },
  seClassNoInfo({
    commit
  }, classNoInfo) {
    commit('SET_CLASSNO', classNoInfo)
  },
  setNation({
    commit
  }, nation) {
    commit('SET_NATION', nation)
  },
  setIdCardType({
    commit
  }, idCardType) {
    commit('SET_IDCARD', idCardType)
  },
}

export default {
  state,
  mutations,
  actions
}
