export default class CardsRepository {
  constructor (dao) {
    this.dao = dao
  }
  /**
   * 建表
   */
  createTable () {
    const sql = `
            CREATE TABLE IF NOT EXISTS card (
                id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
                idType int(255) NOT NULL,
                idNumber varchar(255) NOT NULL,
                jobType int(10) NOT NULL,
                cerName varchar(255) NOT NULL,
                validBeginDate varchar(255) NOT NULL,
                validEndDate varchar(255) NOT NULL,
                issueby varchar(255) DEFAULT NULL,
                issueDate varchar(255) DEFAULT NULL,
                status varchar(2) NOT NULL,
                cerNo varchar(255) NOT NULL
              )
            `
    return this.dao.run(sql)
  }
  /**
   * 插入证书数据
   * @param {*} value k-v数据对象
   */
  create (value) {
    var statlist = []
    var vallist = []
    for (var i in value) {
      statlist.push(i)
      vallist.push(value[i])
    }
    var stat =
      `INSERT INTO card(${statlist.join(',')}) VALUES (${new Array(statlist.length).fill('?').join(',')})`
    return this.dao.run(stat,
      vallist)
  }
  /**
   * 更新证书数据
   * @param {*} value 更新的k-v数据对象
   */
  update (value) {
    var statlist = []
    var vallist = []
    for (var i in value) {
      statlist.push(i)
      vallist.push(value[i])
    }
    var stat =
      `UPDATE card SET ${statlist.join(' = ?, ')} = ? WHERE idNumber = '${value.idNumber}'`
    return this.dao.run(stat,
      vallist)
  }
  /**
   * 根据身份证查询证书数量，用于更新或插入验证
   * @param {*} ip IP
   */
  getCountByIDNumber (idNumber) {
    return this.dao.get(
      `SELECT count(*) as num FROM card WHERE idNumber = ?`,
      [idNumber])
  }
  /**
   * 获取证书信息
   * @param {*} idNumber 工人身份证号
   */
  getCard (idNumber) {
    return this.dao.get(
      `SELECT * FROM card WHERE idNumber = ?`,
      [idNumber])
  }
}
