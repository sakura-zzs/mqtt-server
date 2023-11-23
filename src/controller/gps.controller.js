const { addGPSInfo, getGPSInfo } = require('../service/gps.service')
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
}

module.exports = new GPSController