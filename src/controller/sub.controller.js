const { createSubTopic, getTopicList } = require('../service/subscribe.service')
class SubController {
  async createTopic(ctx, next) {
    const { topic } = ctx.request.body
    const res = await createSubTopic(topic)
    ctx.body = res
  }
  async getTopic(ctx, next) {
    const res = await getTopicList()
    ctx.body = res
  }
}

module.exports = new SubController()