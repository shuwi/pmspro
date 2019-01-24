export default class WorkersRepository {
  constructor (dao) {
    this.dao = dao
  }
  /**
   * 建表
   */
  createTable () {
    const sql = `
        CREATE TABLE IF NOT EXISTS worker (
            id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
            userId varchar(255) NOT NULL,
            name varchar(255) NOT NULL,
            mobile varchar(255) NOT NULL,
            job varchar(255) DEFAULT NULL,
            groupname varchar(255) DEFAULT NULL,
            addtime varchar(255) DEFAULT NULL,
            checkinState int(2) NOT NULL DEFAULT ('0'),
            checkinTime datetime DEFAULT NULL,
            photo longtext DEFAULT NULL,
            projectId int(11) NOT NULL,
            workDate date DEFAULT NULL,
            urgentContractCellphone varchar(255) DEFAULT NULL,
            urgentContractName varchar(255) DEFAULT NULL,
            noBadMedicalHistory varchar(1) DEFAULT ('0'),
            cultureLevelType varchar(255) DEFAULT NULL,
            joinedTime date DEFAULT NULL,
            unJoined varchar(1) DEFAULT ('0'),
            politicsType varchar(255) DEFAULT NULL,
            birthPlaceCode varchar(255) DEFAULT NULL,
            nation varchar(255) DEFAULT NULL,
            idCardType int(255) DEFAULT NULL,
            classNo varchar(255) DEFAULT NULL,
            personType varchar(255) DEFAULT NULL,
            homeAddress varchar(255) DEFAULT NULL,
            workKind int(6) DEFAULT NULL,
            workKindName varchar(255) DEFAULT NULL,
            birthday varchar(255) DEFAULT NULL,
            gender varchar(1) DEFAULT NULL,
            ptype varchar(1) DEFAULT NULL,
            currentAddresss varchar(255) DEFAULT NULL,
            workAccommodationType varchar(1) DEFAULT ('0'),
            workKindType varchar(1) DEFAULT ('1'),
            beginnew varchar(255) DEFAULT NULL,
            endnew varchar(255) DEFAULT NULL,
            uploaded int(2) DEFAULT ('0'),
            inState varchar(255) DEFAULT ('0')
          )
        `
    return this.dao.run(sql)
  }
  /**
   * 插入工人数据
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
      `INSERT INTO worker(${statlist.join(',')}) VALUES (${new Array(statlist.length).fill('?').join(',')})`
    return this.dao.run(stat,
      vallist)
  }
  /**
   * 更新工人数据
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
      `UPDATE worker SET ${statlist.join(' = ?, ')} = ? WHERE userId = '${value.userId}' AND projectId = ${value.projectId}`
    return this.dao.run(stat,
      vallist)
  }
  /**
   * 根据用户身份证号和项目主键查询人数，用于更新或插入验证
   * @param {*} userid 用户身份证号
   * @param {*} projectId 项目主键
   */
  getCount (userid, projectId) {
    return this.dao.get(
      `SELECT count(id) as num FROM worker WHERE userId = ? AND projectId = ?`,
      [userid, projectId])
  }
  /**
   * 根据班组名称和项目主键查询班组数量，用于删除前判断
   * @param {*} classNo 班组名称
   * @param {*} projectId 项目主键
   */
  getClassNoNum (classNo, projectId) {
    return this.dao.get(
      `SELECT COUNT(id) as num from worker WHERE classNo = ? AND projectId = ?`,
      [classNo, projectId])
  }
  /**
   * 根据关键词和项目主键查询工人数量
   * @param {*} keyword 关键词
   * @param {*} pid 项目主键
   */
  getWorkersCount (keyword, pid) {
    return this.dao.get(
      `SELECT count(id) as num from worker where (groupname like '${keyword}%' or userId like '${keyword}%' or mobile like '${keyword}%' or name like '${keyword}%') and projectId = ${pid}`)
  }
  /**
   * 根据关键词和项目主键、页码等查询工人数据
   * @param {*} keyword 关键词
   * @param {*} pid 项目主键
   * @param {*} pagenum 页码
   * @param {*} pagesize 页大小
   */
  getWorkers (keyword, pid, pagenum, pagesize) {
    return this.dao.all(
      `SELECT * from worker where (groupname like '${keyword}%' or userId like '${keyword}%' or mobile like '${keyword}%' or name like '${keyword}%') and projectId = ? limit ?,?`,
      [pid, (pagenum - 1) * pagesize, pagesize])
  }
  /**
   * 更新工人进出场信息
   * @param {*} state 进出场状态
   * @param {*} workerList 工人主键数组
   */
  updateWorkersInState (state, workerList) {
    var stat =
      `UPDATE worker set inState = ${state} WHERE userId in (${workerList.join(',')})`
    return this.dao.run(stat)
  }
}
