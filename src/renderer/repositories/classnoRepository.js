export default class ClassnoRepository {
  constructor(dao) {
    this.dao = dao
  }
  /**
   * 建表
   */
  createTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS classno(
        id int(11) NOT NULL AUTO_INCREMENT,
        name varchar(255) NOT NULL COMMENT '班组名称',
        teamLeader varchar(255) DEFAULT NULL COMMENT '联系人',
        contract varchar(255) DEFAULT NULL COMMENT '联系方式',
        teamIdNumber varchar(255) DEFAULT NULL COMMENT '班组长身份证号码',
        responseIdNumber varchar(255) DEFAULT NULL COMMENT '责任人身份证号码',
        memo varchar(255) DEFAULT NULL COMMENT '备注',
        createUser varchar(255) DEFAULT NULL,
        projectId int(11) DEFAULT NULL,
        smzGroupId int(11) DEFAULT NULL,
        delFlag tinyint(2) NOT NULL DEFAULT '1' COMMENT 'C端数据有效与否标记 1：有效-1：无效',
        posttype tinyint(2) NOT NULL DEFAULT '0' COMMENT '是否是补考勤标志0：正常考勤1：补考勤',
        PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='班组信息表';
      `
    return this.dao.run(sql)
  }
  /**
   * 插入班组数据
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
      `INSERT INTO classno(${statlist.join(',')}) VALUES (${new Array(statlist.length).fill('?').join(',')})`
    return this.dao.run(stat,
      vallist)
  }
  /**
   * 更新班组数据
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
      `UPDATE classno SET ${statlist.join(' = ?, ')} = ? WHERE id = ${value.id} and delFlag <> 0`
    return this.dao.run(stat,
      vallist)
  }
  updateNew(value) {
    var statlist = []
    var vallist = []
    for (var i in value) {
      statlist.push(i)
      vallist.push(value[i])
    }
    var stat =
      `UPDATE classno SET ${statlist.join(' = ?, ')} = ? WHERE name = '${value.name}' and delFlag <> 0`
    return this.dao.run(stat,
      vallist)
  }
  /**
   * 根据名称和项目主键查询班组数量，用于更新或插入验证
   * @param {*} ip IP
   */
  getCount(name, projectId) {
    return this.dao.run(
      `SELECT count(*) as num FROM classno WHERE name = ? and projectId = ?`,
      [name, projectId])
  }
  /**
   * 根据关键词查询班组数量
   * @param {*} keyword 关键词
   */
  getClassnoCount(keyword) {
    return this.dao.run(
      `SELECT count(id) as num from classno where (name like '${keyword}%' or teamLeader like '${keyword}%' or contract like '${keyword}%') and delFlag = 1`)
  }
  /**
   * 根据关键词查询班组数据
   * @param {*} keyword 关键词
   */
  getClasses(keyword = '', projectId) {
    return this.dao.run(
      `SELECT * from classno where (name like '${keyword}%' or teamLeader like '${keyword}%' or contract like '${keyword}%') and delFlag = 1 and projectId = ${projectId}`)
  }
  /**
   * 根据主键数组批量删除班组记录
   * @param {*} dellist
   */
  delete(dellist) {
    return this.dao.run(
      `UPDATE classno SET delFlag = -1 WHERE id in (${dellist.toString()})`
    )
  }
  realdelete(dellist) {
    return this.dao.run(
      `DELETE from classno WHERE id in (${dellist.toString()})`
    )
  }
  softdelete(dellist) {
    return this.dao.run(
      `UPDATE classno SET delFlag = 0 WHERE id in (${dellist.toString()})`
    )
  }
  getUploadData() {
    return this.dao.run(
      `SELECT * from classno where delFlag = 0`)
  }
  patchAdd(data, projectId) {
    this.getCount(data.name, projectId).then((res) => {
      if (res.results[0].num <= 0) {
        this.create(data)
      } else {
        this.updateNew(data)
      }
    })

  }
}
