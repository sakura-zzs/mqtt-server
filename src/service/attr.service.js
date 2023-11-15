const connection = require('../app/database')

class AttrService {
  async addAttr(attr) {
    const statement = `INSERT INTO attr(attr) VALUES(?);`
    const res = await connection.execute(statement, [attr])
    return res[0]
  }
  async pubAttrVal(attr, attrVal) {
    const statement0 = `SELECT * FROM attr WHERE attr=?;`
    const [attrInfo] = await connection.execute(statement0, [attr])
    const attrId = attrInfo[0].id
    const statement = `INSERT INTO attrVal(id,attrVal) VALUES(?,?);`
    const [res] = await connection.execute(statement, [attrId, attrVal])
    return res
  }
  async getAttrVal(attr) {
    const statement = `SELECT * FROM attrVal WHERE id=(SELECT id FROM attr WHERE attr=?) ORDER BY createTime DESC;`
    const [res] = await connection.execute(statement, [attr])
    return res

  }
  async getLatestAttrVal(attr) {
    const statement = `SELECT * FROM attrVal WHERE id=(SELECT id FROM attr WHERE attr=?) ORDER BY createTime DESC LIMIT 1;`
    const [res] = await connection.execute(statement, [attr])
    return res
  }
  async fetchAttrList() {
    const statement = `SELECT * FROM attr;`
    const [res] = await connection.execute(statement)
    return res
  }
}

module.exports = new AttrService