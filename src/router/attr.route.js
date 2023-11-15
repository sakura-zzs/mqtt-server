const route = require('@koa/router')
const { createAttr, publishAttr, getAttrValList, getLatestVal, getAttrList } = require('../controller/attr.controller')
const attrRouter = new route({ prefix: '/attr' })

attrRouter.get('/', (ctx, next) => {
  ctx.body = 'mqtt attr test'
})
attrRouter.post('/addAttr', createAttr)
attrRouter.post('/pubAttr', publishAttr)
attrRouter.get('/getAttrVal', getAttrValList)
attrRouter.get('/getLatestVal', getLatestVal)
attrRouter.get('/getAttrList', getAttrList)

module.exports = attrRouter