const route = require('@koa/router')
const { up, down, getUpdate, update } = require('../controller/gps.controller')
const gpsRouter = new route({ prefix: '/gps' })

gpsRouter.get('/', (ctx, next) => {
  ctx.body = "gps test~"
})

//上传
gpsRouter.post('/up', up)
//获取
gpsRouter.get('/down', down)
//获取更新列表
gpsRouter.get('/down/updateList', getUpdate)
//更新列表
gpsRouter.patch('/update', update)

module.exports = gpsRouter