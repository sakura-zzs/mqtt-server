const route = require('@koa/router')
const { up, down } = require('../controller/gps.controller')
const gpsRouter = new route({ prefix: '/gps' })

gpsRouter.get('/', (ctx, next) => {
  ctx.body = "gps test~"
})

//上传
gpsRouter.post('/up', up)
//获取
gpsRouter.get('/down', down)

module.exports = gpsRouter