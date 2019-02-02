export default class WorkersMySQLRepository {
  constructor(dao) {
    this.dao = dao
  }
  /**
   * 建表
   */
  createTable() {
    const sql = `
          CREATE TABLE IF NOT EXISTS worker (
            id int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
            userId varchar(255) NOT NULL COMMENT '身份证号',
            name varchar(255) NOT NULL COMMENT '人员姓名',
            mobile varchar(255) NOT NULL COMMENT '电话号码',
            job varchar(255) DEFAULT NULL,
            groupname varchar(255) DEFAULT NULL,
            addtime varchar(255) DEFAULT NULL,
            checkinState int(2) NOT NULL DEFAULT '0',
            checkinTime datetime DEFAULT NULL,
            photo longtext DEFAULT NULL,
            projectId int(11) NOT NULL,
            workDate date DEFAULT NULL COMMENT '开始工作日期',
            urgentContractCellphone varchar(255) DEFAULT NULL COMMENT '紧急联系人电话',
            urgentContractName varchar(255) DEFAULT NULL COMMENT '紧急联系人',
            noBadMedicalHistory varchar(1) DEFAULT '0' COMMENT '是否有重大病史',
            cultureLevelType varchar(255) DEFAULT NULL COMMENT '文化程度',
            joinedTime date DEFAULT NULL COMMENT '加入工会时间',
            unJoined varchar(1) DEFAULT '0' COMMENT '是否加入公会',
            politicsType varchar(255) DEFAULT NULL COMMENT '政治面貌',
            birthPlaceCode varchar(255) DEFAULT NULL COMMENT '籍贯',
            nation varchar(255) DEFAULT NULL COMMENT '民族',
            idCardType int(255) DEFAULT NULL COMMENT '证件类型',
            classNo varchar(255) DEFAULT NULL COMMENT '班组',
            personType varchar(255) DEFAULT NULL COMMENT '人员类型',
            homeAddress varchar(255) DEFAULT NULL COMMENT '家庭住址',
            workKind int(6) DEFAULT NULL COMMENT '工种',
            workKindName varchar(255) DEFAULT NULL COMMENT '工种名称',
            birthday varchar(255) DEFAULT NULL,
            gender varchar(1) DEFAULT NULL COMMENT '性别',
            ptype varchar(1) DEFAULT NULL COMMENT '人员类别',
            currentAddresss varchar(255) DEFAULT NULL COMMENT '暂住地址',
            workAccommodationType varchar(1) DEFAULT '0' COMMENT '工人住宿类型',
            workKindType varchar(1) DEFAULT '1' COMMENT '工种类别',
            beginnew varchar(255) DEFAULT NULL,
            endnew varchar(255) DEFAULT NULL,
            inState varchar(255) DEFAULT '0',
            delFlag tinyint(2) DEFAULT '1' COMMENT 'C端数据有效与否标记 1：有效-1：无效',
            machinepost longtext DEFAULT NULL COMMENT '设备端用户数据',
            PRIMARY KEY (id)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='工人信息表';
          `
    return this.dao.run(sql)
  }
  /**
   * 插入工人数据
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
      `INSERT INTO worker(${statlist.join(',')}) VALUES (${new Array(statlist.length).fill('?').join(',')})`
    return this.dao.run(stat,
      vallist)
  }
  /**
   * 更新工人数据
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
      `UPDATE worker SET ${statlist.join(' = ?, ')} = ? WHERE userId = '${value.userId}' AND projectId = ${value.projectId}`
    return this.dao.run(stat,
      vallist)
  }
  /**
   * 根据用户身份证号和项目主键查询人数，用于更新或插入验证
   * @param {*} userid 用户身份证号
   * @param {*} projectId 项目主键
   */
  getCount(userid, projectId) {
    return this.dao.run(
      `SELECT count(id) as num FROM worker WHERE userId = ? AND projectId = ?`,
      [userid, projectId])
  }
  /**
   * 根据班组名称和项目主键查询班组数量，用于删除前判断
   * @param {*} classNo 班组名称
   * @param {*} projectId 项目主键
   */
  getClassNoNum(classNo, projectId) {
    return this.dao.run(
      `SELECT COUNT(id) as num from worker WHERE classNo = ? AND projectId = ?`,
      [classNo, projectId])
  }
  /**
   * 根据关键词和项目主键查询工人数量
   * @param {*} keyword 关键词
   * @param {*} pid 项目主键
   */
  getWorkersCount(keyword, pid) {
    return this.dao.run(
      `SELECT count(id) as num from worker where (groupname like '${keyword}%' or userId like '${keyword}%' or mobile like '${keyword}%' or name like '${keyword}%') and projectId = ${pid}`)
  }
  /**
   * 根据关键词和项目主键、页码等查询工人数据
   * @param {*} keyword 关键词
   * @param {*} pid 项目主键
   * @param {*} pagenum 页码
   * @param {*} pagesize 页大小
   */
  getWorkers(keyword, pid, pagenum, pagesize) {
    return this.dao.run(
      `SELECT * from worker where (groupname like '${keyword}%' or userId like '${keyword}%' or mobile like '${keyword}%' or name like '${keyword}%') and projectId = ? limit ?,?`,
      [pid, (pagenum - 1) * pagesize, pagesize])
  }
  getUploadWorkers(pid) {
    return this.dao.run(
      `SELECT * from worker where projectId = ? and delFlag = -1`,
      [pid])
  }
  /**
   * 更新工人进出场信息
   * @param {*} state 进出场状态
   * @param {*} workerList 工人主键数组
   */
  updateWorkersInState(state, workerList) {
    var stat =
      `UPDATE worker set inState = ${state} WHERE userId in (${workerList.join(',')})`
    return this.dao.run(stat)
  }
  updateWorkersDel(state, workerList) {
    var stat =
      `UPDATE worker set delFlag = ${state} WHERE userId in (${workerList.join(',')})`
    return this.dao.run(stat)
  }
  updateWorkerMachineInfo(state, userId) {
    var stat =
      `UPDATE worker set machinepost = ? WHERE userId = ?`
    return this.dao.run(stat, [state, userId])
  }
  getRemovals(keyword, pid, pagenum, pagesize) {
    return this.dao.run(
      `SELECT userId,name,projectId,machinepost from worker where (groupname like '%${keyword}%' or userId like '%${keyword}%' or mobile like '%${keyword}%' or name like '%${keyword}%') and projectId = ? and machinepost is not null limit ?,?`, [pid, (pagenum - 1) * pagesize, pagesize])
  }
  getRemovalsNum(keyword, pid){
    return this.dao.run(
      `SELECT count(id) as num from worker where (groupname like '%${keyword}%' or userId like '%${keyword}%' or mobile like '%${keyword}%' or name like '%${keyword}%') and projectId = ? and machinepost is not null`, [pid])
  }
}
