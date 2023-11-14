const { addAttr, pubAttrVal, getAttrVal, getLatestAttrVal } = require('../service/attr.service')
class AttrController {
  async createAttr(ctx, next) {
    const { attr } = ctx.request.body
    const res = await addAttr(attr)
    ctx.body = res
  }
  async publishAttr(ctx, next) {
    const { attr, attrVal } = ctx.request.body
    const res = await pubAttrVal(attr, attrVal)
    ctx.body = res
  }
  async getAttrValList(ctx, next) {
    const { attr } = ctx.query
    const res = await getAttrVal(attr)
    ctx.body = res
  }
  async getLatestVal(ctx, next) {
    const { attr } = ctx.query
    const res = await getLatestAttrVal(attr)
    ctx.body = res
  }
}

module.exports = new AttrController()