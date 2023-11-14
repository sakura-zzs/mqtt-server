const connection = require('../app/database')

class PubService {
  async createPubTopic(topic) {
    const statement = `INSERT INTO pub(topic) VALUES(?);`
    const res = await connection.execute(statement, [topic])
    return res[0]
  }
  async getTopicList() {
    const statement = `SELECT * FROM pub;`
    const [res] = await connection.execute(statement)
    return res
  }
}

module.exports = new PubService