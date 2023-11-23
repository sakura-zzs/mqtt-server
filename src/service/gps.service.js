const connection = require('../app/database')

class GPSService {
  async addGPSInfo(GPSInfo) {
    const { dateTime, lat, lng, high, speed, direction, status, ns, ew } = GPSInfo
    const statement = `INSERT INTO gps(dateTime,lat,lng,high,speed,direction,status,ns,ew) VALUES(?,?,?,?,?,?,?,?,?);`
    const [res] = await connection.execute(statement, [dateTime, lat, lng, high, speed, direction, status, ns, ew])
    return res
  }
  async getGPSInfo() {
    const statement = `SELECT * FROM gps;`
    const [res] = await connection.execute(statement)
    return res
  }
  async getGPSInfoLatest() {
    const statement = `SELECT * FROM gps ORDER BY createTime DESC LIMIT 1;`
    const [res] = await connection.execute(statement)
    return res[0]
  }
  async deleteGPSInfo() {
    const statement = `DELETE FROM gps;`
    const [res] = await connection.execute(statement)
    return res
  }
}


module.exports = new GPSService