const connection = require('../app/database')

class SubService {
  async createSubTopic(topic) {
    const statement = `INSERT INTO sub(topic) VALUES(?);`
    const res = await connection.execute(statement, [topic])
    return res[0]
  }
  async getTopicList() {
    const statement = `SELECT * FROM sub;`
    const [res] = await connection.execute(statement)
    return res
  }
}

module.exports = new SubService