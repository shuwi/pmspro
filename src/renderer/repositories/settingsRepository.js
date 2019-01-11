const {
  db
} = require('electron').remote.require('./persistence')

db.defaults({
  appSettings: {
    'wasImported': false,
    'itemCreationDate': true,
    'prependNewItems': true,
    'showUpdates': true
  },
  dbSettings: {
    isuse: '1',
    host: 'localhost',
    user: 'root',
    password: 'demo123',
    database: 'labour',
    port: 3306
  },
  checkinSettings: {
    checkinhost: '192.168.20.5',
    checkinport: 9922
  },
  userlog: {
    mode: '1',
    username: '',
    password: ''
  }
}).write()

export default {
  getAppSettings () {
    return db.get('appSettings')
      .cloneDeep()
      .value()
  },
  updateAppSettings (updateProp) {
    return db.get('appSettings')
      .assign(updateProp)
      .write()
  },
  getDBSettings () {
    return db.get('dbSettings')
      .cloneDeep()
      .value()
  },
  updateDBSettings (updateProp) {
    return db.get('dbSettings')
      .assign(updateProp)
      .write()
  },
  getCheckinSettings () {
    return db.get('checkinSettings')
      .cloneDeep()
      .value()
  },
  updateCheckinSettings (updateProp) {
    return db.get('checkinSettings')
      .assign(updateProp)
      .write()
  },
  getUserlog () {
    return db.get('userlog')
      .cloneDeep()
      .value()
  },
  updateUserlog (updateProp) {
    return db.get('userlog')
      .assign(updateProp)
      .write()
  }
}
