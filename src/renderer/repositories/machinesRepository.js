export default class MachinesRepository {
  constructor(dao) {
    this.dao = dao
  }
  /**
   * 建表
   */
  createTable() {
    const sql = `
    CREATE TABLE IF NOT EXISTS machine(
      id int(11) NOT NULL AUTO_INCREMENT,
      port int(6) DEFAULT NULL COMMENT '设备端口号',
      mac varchar(255) DEFAULT NULL COMMENT '设备mac地址',
      ip varchar(255) NOT NULL COMMENT '设备IP',
      szKey varchar(255) DEFAULT NULL COMMENT '通信密码',
      serverIp varchar(255) NOT NULL COMMENT '服务器IP',
      serverPort int(6) NOT NULL,
      sn varchar(255) NOT NULL COMMENT '设备序列号',
      name varchar(255) DEFAULT NULL COMMENT '设备名称',
      deviceProperty int(3) DEFAULT '0' COMMENT '设备属性，0=其他，1=录入，2=进门，3=出门',
      created varchar(255) DEFAULT NULL COMMENT '创建时间',
      modified varchar(255) DEFAULT NULL COMMENT '最后一次连接时间',
      updateType int(3) DEFAULT '1' COMMENT '更新类型，1=手工修改，其他=系统修改',
      projectId int(11) NOT NULL COMMENT '项目主键',
      code varchar(255) DEFAULT NULL COMMENT '设备号',
      deviceType varchar(255) DEFAULT NULL COMMENT '设备类型',
      remark varchar(255) DEFAULT NULL COMMENT '描述信息',
      PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
    `
    return this.dao.run(sql)
  }
  /**
   * 插入考勤设备数据
   * @param {*} value k-v数据对象
   */
  create(value) {
    var statlist = []
    var vallist = []
    for (var i in value) {
      statlist.push(i)
      vallist.push(value[i])
    }
    var stat =
      `INSERT INTO machine(${statlist.join(',')}) VALUES (${new Array(statlist.length).fill('?').join(',')})`
    return this.dao.run(stat,
      vallist)
  }
  /**
   * 更新考勤设备数据
   * @param {*} value 更新的k-v数据对象
   */
  update(value) {
    var statlist = []
    var vallist = []
    for (var i in value) {
      statlist.push(i)
      vallist.push(value[i])
    }
    var stat =
      `UPDATE machine SET ${statlist.join(' = ?, ')} = ? WHERE id = '${value.id}' and ip = '${value.ip}'`
    console.log('stat = ', stat)
    return this.dao.run(stat,
      vallist)
  }
  /**
   * 根据IP查询考勤设备数量，用于更新或插入验证
   * @param {*} ip IP
   */
  getCountByIP(ip) {
    return this.dao.run(
      `SELECT count(*) as num FROM machine WHERE ip = ?`,
      [ip])
  }
  /**
   * 根据关键词查询考勤设备数量
   * @param {*} keyword 关键词
   */
  getMachinesCount(keyword, projectid) {
    return this.dao.run(
      `SELECT count(id) as num from machine where projectId = ${projectid} and (port like '${keyword}%' or ip like '${keyword}%' or name like '${keyword}%')`)
  }
  /**
   * 根据关键词查询考勤设备数据
   * @param {*} keyword 关键词
   */
  getMachines(keyword, projectid) {
    return this.dao.run(
      `SELECT * from machine where projectId = ${projectid} and (port like '${keyword}%' or ip like '${keyword}%' or name like '${keyword}%')`)
  }
  /**
   * 获取考勤设备列表
   * @param {*} projectid 
   */
  getMachinesList(projectid) {
    return this.dao.run(
      `SELECT sn as value,name as label from machine where projectId = ${projectid} and name is not null`)
  }
  getUnuploadMachines(projectid) {
    return this.dao.run(
      `SELECT * from machine where projectId = ${projectid} and delFlag = -1 and name is not null`)
  }
  /**
   * 根据主键数组批量删除考勤设备记录
   * @param {*} dellist
   */
  delete(dellist) {
    return this.dao.run(
      `DELETE FROM machine WHERE id in (${dellist.toString()})`
    )
  }
  softdelete(dellist) {
    return this.dao.run(
      `UPDATE machine SET delFlag = -1 WHERE id in (${dellist.toString()})`
    )
  }
  uploaded(dellist) {
    return this.dao.run(
      `UPDATE machine SET delFlag = 1 WHERE id in (${dellist.toString()})`
    )
  }
}
