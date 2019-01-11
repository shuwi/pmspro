'use strict'

import {
  app,
  BrowserWindow
} from 'electron'
import windowRepository from './windowRepository'

const path = require('path')

const windowSettings = windowRepository('resources/window.json')

global.userDataPath = path.join('resources/settings.json')
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development' ?
  `http://127.0.0.1:9080` :
  `file://${__dirname}/index.html`

function createWindow() {
  const windowConfig = windowSettings.getWindowState()

  windowConfig.frame = false
  windowConfig.resizable = true
  windowConfig.icon = path.join(__dirname, '/assets/icon.png')
  windowConfig.center = true
  windowConfig.webPreferences = {
    webSecurity: false,
    defaultFontSize: 12
  }
  mainWindow = new BrowserWindow(windowConfig)

  mainWindow.loadURL(winURL)

  mainWindow.setMenu(null)

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    mainWindow.focus()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
if (process.env.NODE_ENV === 'development')
  require('electron-context-menu')({
    showInspectElement: true,
    labels: {
      cut: '剪切',
      copy: '复制',
      paste: '粘贴',
      save: '保存',
      saveImageAs: '图像存储为...',
      copyLink: '复制链接',
      copyImageAddress: '复制图像地址',
      inspect: '打开调试工具'
    }
  })
