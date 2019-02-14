const Promise = require('bluebird')
const iconv = require('iconv-lite')

export default {
  socketPromise(req) {
    var net = require('net')
    var client = new net.Socket()
    var receive = ''
    return new Promise((resolve, reject) => {
      client.connect({
        port: req.port,
        host: req.ip
      }, () => {
        client.write(iconv.encode(req.postdata, 'GBK'))
        client.end()
      })
      client.setTimeout(990, () => {
        reject(`设备${req.ip}:${req.port}连接超时，即将断开连接...`)
      })
      client.on('timeout', () => {
        client.end()
        client.destroy()
        reject(`设备${req.ip}:${req.port}连接超时，请检查网络连接！`)
      })
      client.on('data', (data) => {
        receive += iconv.decode(data, 'GBK')
      })
      client.on('end', () => {
        console.log(`END`)
        client.end()
        client.destroy()
        //console.log(`client = ${JSON.stringify(client)}`)
        resolve({
          results: receive
        })
      })
      client.on('close', (data) => {
        client.end()
        client.destroy()
        console.log(`CLOSED: ${data}`)
      })
      client.on('error', (err) => {
        client.end()
        client.destroy()
        reject(`设备${req.ip}:${req.port}连接错误:(<br/>${err}`)
      })
    })

  }
}
