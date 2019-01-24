const net = require('net')
const iconv = require('iconv-lite')
const client = new net.Socket()
const Promise = require('bluebird')

export default {

  socketSend(req) {
    return new Promise((resolve, reject) => {
      var receive = ''
      var sock = client.connect(req.port, req.ip, function () {
        sock.write(iconv.encode(req.postdata, 'GBK'))
        sock.end()
      })
      sock.setTimeout(1000)
      sock.on('timeout', () => {
        sock.destroy()
        reject({
          title: '提示',
          content: `<p style="font-size:12px;">设备${req.ip}:${req.port}连接超时，请检查网络连接！</p>`
        })
      })
      sock.on('error', function () {
        sock.destroy()
        reject({
          title: '提示',
          content: `<p style="font-size:12px;">设备${req.ip}:${req.port}连接异常！</p>`
        })
      })
      sock.on('data', function (data) {
        receive += iconv.decode(data, 'GBK')
      })
      sock.on('end', function () {
        sock.destroy()
        resolve({
          results: receive
        })
      })
    })


  }
}
