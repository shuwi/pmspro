const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

export default function (userAppPath) {
  const windowAdapter = new FileSync(userAppPath)
  const windowSettings = low(windowAdapter)
  windowSettings.defaults({
    windowState: {
      height: 680,
      useContentSize: false,
      width: 1440,
      show: false,
      minWidth: 600,
      x: undefined,
      y: undefined
    }
  }).write()

  return {
    getWindowState () {
      return windowSettings.get('windowState')
        .cloneDeep()
        .value()
    },

    updateWindowState (updateProp) {
      return windowSettings.get('windowState')
        .assign(updateProp)
        .write()
    }

  }
}
