const { addGPSInfo, getGPSInfo, getUpdateList, updateGPSInfo } = require('../service/gps.service')
class GPSController {
  async up(ctx, next) {
    const GPSInfo = ctx.request.body
    const res = await addGPSInfo(GPSInfo)
    ctx.body = res
  }
  async down(ctx, next) {
    const res = await getGPSInfo()
    ctx.body = res
  }
  async getUpdate(ctx, next) {
    const res = await getUpdateList()
    ctx.body = res
  }
  async update(ctx, next) {
    const updateInfo = ctx.request.body
    const res = await updateGPSInfo(updateInfo)
    ctx.body = res

  }
}

module.exports = new GPSController