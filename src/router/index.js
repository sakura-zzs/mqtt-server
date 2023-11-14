//自动注册路由
const fs = require('fs')

function registerRouters() {
  //获取所有路由文件，入口文件除外
  const files = fs.readdirSync(__dirname)
  files.forEach(file => {
    if (!file.endsWith('.route.js')) return
    const router = require(`./${file}`)
    //注册
    this.use(router.routes())
    //匹配该路由未设置的路径返回错误码
    this.use(router.allowedMethods())
  })
}
module.exports = registerRouters