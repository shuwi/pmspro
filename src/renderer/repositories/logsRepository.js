export default class LogsRepository {
  constructor(dao) {
    this.dao = dao
  }
  /**
   * 建表
   */
  createTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS postlog(
        id int(11) NOT NULL AUTO_INCREMENT,
        userid varchar(255) NOT NULL COMMENT '用户身份证号',
        machinesn varchar(20) NOT NULL,
        projectid int(11) NOT NULL,
        logdate varchar(255) NOT NULL COMMENT '考勤时间',
        photo text,
        uploaded tinyint(2) NOT NULL DEFAULT '0' COMMENT '是否已上传',
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
      `INSERT INTO postlog(${statlist.join(',')}) VALUES (${new Array(statlist.length).fill('?').join(',')})`
      console.log(stat)
    return this.dao.run(stat,
      vallist)
  }
  /**
   * 根据用户身份证号查询考勤数据，用于更新或插入验证
   * @param {*} userid 用户身份证号
   */
  getCount(userid) {
    return this.dao.run(
      `SELECT count(id) as num FROM postlog WHERE userid = ?`,
      [userid])
  }
  /**
   * 根据关键词查询考勤数据量
   * @param {*} keyword 关键词
   */
  getLogsCount(keyword, projectId) {
    console.log('getLogsCount')
    return this.dao.run(
      `SELECT
      count(p.id) as num
      FROM
        postlog p
      LEFT JOIN machine m ON p.machinesn = m.sn
      LEFT JOIN worker w ON p.userid = w.userId
      WHERE
        p.projectid = ${projectId}
        AND w.inState = 1
        AND m.projectId = ${projectId}
        AND w.projectId = ${projectId}
 AND (p.userid like '${keyword}%' or p.machinesn like '${keyword}%' or p.logdate like '${keyword}%')`)
  }
  getUploadLogs(projectId) {
    return this.dao.run(
      `SELECT
      w.id AS uid,
      m.id AS snId,
      p.projectid AS ngProjectId,
      p.logdate AS time,
      m.deviceProperty AS type,
      p.photo AS photo,
      p.id AS lablorId,
      p.uploaded AS delFlag,
      p.posttype AS posttype,
      p.userid AS idCard
      FROM
        postlog p
      LEFT JOIN machine m ON p.machinesn = m.sn
      LEFT JOIN worker w ON p.userid = w.userId
      WHERE
        p.projectid = ${projectId}
        AND w.inState = 1
        AND m.projectId = ${projectId}
        AND w.projectId = ${projectId}
      AND p.uploaded = 0`)
  }
  /**
   * 根据关键词、页码等查询考勤数据
   * @param {*} keyword 关键词
   * @param {*} pagenum 页码
   * @param {*} pagesize 页大小
   */
  getLogs(keyword, pagenum, pagesize, projectId) {
    return this.dao.run(
      `SELECT
      w.id AS uid,
      w.userId as userId,
      w.name as userName,
      w.workKindName as workKindName,
      w.groupname as groupName,
      w.mobile as mobile,
      m.id AS snId,
      m.name as mName,
      p.projectid AS ngProjectId,
      p.logdate AS time,
      p.machinesn AS machinesn,
      m.deviceProperty AS type,
      p.photo AS photo,
      p.id AS lablorId,
      p.uploaded AS delFlag
      FROM
        postlog p
      LEFT JOIN machine m ON p.machinesn = m.sn
      LEFT JOIN worker w ON p.userid = w.userId
      WHERE
        p.projectid = ${projectId}
        AND w.inState = 1
        AND m.projectId = ${projectId}
        AND w.projectId = ${projectId}
      AND (p.userid like '${keyword}%' or p.machinesn like '${keyword}%' or p.logdate like '${keyword}%') limit ?,?`,
      [(pagenum - 1) * pagesize, pagesize])
  }
  uploaded(dellist) {
    return this.dao.run(
      `UPDATE postlog SET uploaded = 1 WHERE id in (${dellist.toString()})`
    )
  }
}
