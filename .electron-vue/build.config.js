const path = require('path')

/**
 * `electron-packager` options
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-packager.html
 */
module.exports = {
  arch: process.env.ARCH || 'all',
  asar: true,
  dir: path.join(__dirname, '../'),
  icon: path.join(__dirname, '../build/icons/icon'),
  ignore: /(^\/(src|test|\.[a-z]+|README|yarn|static|dist\/web))|\.gitkeep/,
  extraResource: ['resources/termb.dll','resources/FaceId.dll','resources/FaceLibrary.dll','resources/FaceLibrary.pdb','static/bg.png','static/logo.png'],
  out: path.join(__dirname, '../build'),
  overwrite: true,
  platform: process.env.BUILD_TARGET || 'all'
}
