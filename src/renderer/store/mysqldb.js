const mysql = require('mysql')
const Promise = require('bluebird')
import settingsRepository from '@/repositories/settingsRepository'

export default class MysqlAppDAO {
  constructor() {
    var dbjson = JSON.parse(JSON.stringify(settingsRepository.getDBSettings()))
    if (dbjson.isuse === '0') {
      return
    }
    delete dbjson.isuse
    this.db = mysql.createConnection(dbjson)
  }
  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.query(sql, params, function (err, results, fields) {
        if (err) {
          console.log(err)
          reject(err)
        } else {
          resolve({
            results: results,
            fields: fields
          })
        }
      })
    })
  }

}
