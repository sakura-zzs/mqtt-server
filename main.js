const { aedesApp, kApp } = require('./src/app')
const net = require('net')
const app = net.createServer(aedesApp.handle)

app.listen(1883, () => {
  console.log('server started and listening on port 1883')
})
kApp.listen(8883, () => {
  console.log('web server started and listening on port 8883')
})