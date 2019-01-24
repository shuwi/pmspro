export default class CommandRepository {
  constructor(dao) {
    this.dao = dao
  }
  /**
   * 建表
   */
  createTable() {
    const sql = `
        CREATE TABLE IF NOT EXISTS commands(
          id int(11) NOT NULL AUTO_INCREMENT,
          machinesn varchar(20) NOT NULL COMMENT '设备序列号',
          projectid int(11) NOT NULL COMMENT '项目主键',
          createdate varchar(255) NOT NULL COMMENT '下发时间',
          executedate varchar(255) DEFAULT NULL COMMENT '执行时间',
          commandtype varchar(255) NOT NULL COMMENT '命令类型',
          commandfrom varchar(255) NOT NULL COMMENT '命令下发人',
          commandcontent text NOT NULL COMMENT '命令内容',
          commandresponse text DEFAULT NULL COMMENT '命令返回结果',
          commandext varchar(255) DEFAULT NULL COMMENT '附加信息',
          resulttype tinyint(2) NOT NULL DEFAULT '0' COMMENT '执行结果0：未执行1：成功2：失败',
          PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
        `
    return this.dao.run(sql)
  }

  create(value) {
    var statlist = []
    var vallist = []
    for (var i in value) {
      statlist.push(i)
      vallist.push(value[i])
    }
    var stat =
      `INSERT INTO commands(${statlist.join(',')}) VALUES (${new Array(statlist.length).fill('?').join(',')})`
    console.log(stat)
    return this.dao.run(stat,
      vallist)
  }

  update(value) {
    var statlist = []
    var vallist = []
    for (var i in value) {
      statlist.push(i)
      vallist.push(value[i])
    }
    var stat =
      `UPDATE commands SET ${statlist.join(' = ?, ')} = ? WHERE id = '${value.id}' and ip = '${value.ip}'`
    console.log('stat = ', stat)
    return this.dao.run(stat,
      vallist)
  }

  getCommandsCount(str) {
    return this.dao.run(
      `SELECT count(id) as num from commands where projectid = ${str.projectid} and machinesn = ${str.machinesn} and (createdate like '${str.keyword}%' or executedate like '${str.keyword}%')`)
  }

  getCommands(str) {
    return this.dao.run(
      `SELECT * from commands where projectid = ${str.projectid} 
      and machinesn = ${str.machinesn} 
      and (createdate like '${str.keyword}%' or executedate like '${str.keyword}%') 
      order by id desc limit ?,?`, [(str.pagenum - 1) * str.pagesize, str.pagesize])
  }

}
