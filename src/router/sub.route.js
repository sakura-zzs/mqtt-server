const route = require('@koa/router')
const { createTopic, getTopic } = require('../controller/sub.controller')
const subRouter = new route({ prefix: '/sub' })

subRouter.get('/', (ctx, next) => {
  ctx.body = 'mqtt test'
})
subRouter.post('/addTopic', createTopic)
subRouter.get('/getTopic', getTopic)


module.exports = subRouter