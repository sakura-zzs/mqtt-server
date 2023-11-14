const mysql = require('mysql2')

const config = require('./config')
//创建连接池
const pool = mysql.createPool({
  host: config.MYSQL_HOST,
  port: config.MYSQL_PORT,
  database: config.MYSQL_DATABASE,
  user: config.MYSQL_USER,
  password: config.MYSQL_PASSWORD,
  // timezone: '+08:00',
  dateStrings: true,//设置时区虽然解决了时区问题，但是返回的是js的DATE对象，使用dateStrings让mysql2强制返回字符串格式时间
})

//监听数据库连接状态
pool.getConnection((err, connection) => {
  if (err) {
    console.log("获取连接失败", err)
    return
  }
  //获取connection尝试与数据库进行连接
  connection.connect(err => {
    if (err) {
      console.log("数据库连接失败", err)
      return
    }
    console.log("数据库连接成功")
  })
})

module.exports = pool.promise()