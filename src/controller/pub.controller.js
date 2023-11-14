const { createPubTopic, getTopicList } = require('../service/publish.service')
class PubController {
  async createTopic(ctx, next) {
    const { topic } = ctx.request.body
    const res = await createPubTopic(topic)
    ctx.body = res
  }
  async getTopic(ctx, next) {
    const res = await getTopicList()
    ctx.body = res
  }
}

module.exports = new PubController()