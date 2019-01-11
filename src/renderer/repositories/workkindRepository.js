export default class WorkKindRepository {
  constructor(dao) {
    this.dao = dao
  }
  /**
   * 建表
   */
  createTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS workkind(
        id int(11) NOT NULL AUTO_INCREMENT,
        smzId int(11) NOT NULL,
        name varchar(255) NOT NULL COMMENT '工种名称',
        workKindType varchar(20) NOT NULL COMMENT '工种类别',
        workKindTypeName varchar(255) NOT NULL COMMENT '工种类别名称',
        delFlag tinyint(2) NOT NULL DEFAULT '1' COMMENT 'C端数据有效与否标记 1：有效-1：无效',
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
      `
    return this.dao.run(sql)
  }
  /**
   * 插入工种数据
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
      `INSERT INTO workkind(${statlist.join(',')}) VALUES (${new Array(statlist.length).fill('?').join(',')})`
      console.log(stat)
    return this.dao.run(stat,
      vallist)
  }
  createNew(value) {
    console.log('value = ',value)
    var statlist = []
    var vallist = []
    for (var i in value) {
      statlist.push(i)
      vallist.push(value[i])
    }
  }
  /**
   * 更新工种数据
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
      `UPDATE workkind SET ${statlist.join(' = ?, ')} = ? WHERE id = '${value.id}' and workKindType = '${value.workKindType}'`
    return this.dao.run(stat,
      vallist)
  }
  updateWithName(value) {
    var statlist = []
    var vallist = []
    for (var i in value) {
      statlist.push(i)
      vallist.push(value[i])
    }
    var stat =
      `UPDATE workkind SET ${statlist.join(' = ?, ')} = ? WHERE name = '${value.name}'`
    return this.dao.run(stat,
      vallist)
  }
  /**
   * 根据工种名查询工人数量
   * @param {*} name name
   */
  getCountByName(name) {
    return this.dao.run(
      `SELECT count(*) as num FROM worker WHERE workKindName = ?`,
      [name])
  }
  /**
   * 根据关键词查询工种数量
   * @param {*} keyword 关键词
   */
  getworkkindsCount() {
    return this.dao.run(
      `SELECT count(id) as num from workkind where delFlag = 1`)
  }
  /**
   * 根据关键词查询工种数据
   * @param {*} keyword 关键词
   */
  getWorkkinds(pagenum, pagesize) {
    return this.dao.run(
      `SELECT * from workkind where delFlag = 1 limit ?,?`,[(pagenum - 1) * pagesize, pagesize])
  }
  /**
   * 根据主键数组批量删除工种记录
   * @param {*} dellist
   */
  delete(dellist) {
    return this.dao.run(
      `UPDATE workkind SET delFlag = -1 WHERE id in (${dellist.toString()})`
    )
  }
  pathAdd(data) {
    this.getworkkindsCount().then((res) => {
      if (res.results[0].num <= 0) {
        this.create(data)
      } else {
        this.updateWithName(data)
      }
    })

  }
}
