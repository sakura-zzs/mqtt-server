const route = require('@koa/router')
const { createTopic, getTopic } = require('../controller/pub.controller')
const pubRouter = new route({ prefix: '/pub' })

pubRouter.get('/', (ctx, next) => {
  ctx.body = 'mqtt pub test'
})
pubRouter.post('/addTopic', createTopic)
pubRouter.get('/getTopic', getTopic)

module.exports = pubRouter