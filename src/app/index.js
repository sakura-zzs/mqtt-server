//mqtt服务端
const aedes = require('aedes')


const Koa = require('koa')
const useRoutes = require('../router')
const bodyParser = require('koa-bodyparser')
const { pubAttrVal, fetchAttrList, getLatestAttrVal } = require('../service/attr.service')
const { addGPSInfo, getGPSInfoLatest } = require('../service/gps.service')
const kApp = new Koa()
kApp.useRoutes = useRoutes
//创建aedes实例
/*
  配置项: mq: 消息队列，用于存储和处理消息。默认情况下，aedes 使用内存消息队列，但你可以使用其他消息队列实现，例如 Redis。
            id: 服务器的唯一标识符。如果未指定，则将自动生成一个唯一标识符。
            persistence: 持久化存储，用于将连接和会话状态存储到磁盘或数据库中。默认情况下，aedes 使用内存持久化存储，但你可以使用其他持久化存储实现，例如 LevelDB 或 MongoDB。
            concurrency: 最大并发连接数。默认情况下，aedes 允许无限制的并发连接。
            heartbeatInterval: 心跳间隔时间，用于检测连接是否处于活动状态。默认情况下，aedes 每 5 分钟发送一次心跳包。
            connectTimeout: 连接超时时间。默认情况下，aedes 允许无限制的连接超时时间。
            queueLimit: 消息队列长度限制，用于限制消息队列的最大长度。默认情况下，aedes 不限制消息队列长度。
            maxClientsIdLength: 最大客户端 ID 长度。默认情况下，aedes 允许客户端 ID 的最大长度为 23 个字符。
            preConnect: 在连接建立之前执行的处理程序。可以用于验证客户端的身份或执行其他预处理操作。
            authenticate: 身份验证处理程序，用于验证客户端的身份。可以使用用户名/密码、证书等进行身份验证。
            authorizePublish: 发布授权处理程序，用于授权客户端发布消息。
            authorizeSubscribe: 订阅授权处理程序，用于授权客户端订阅主题。
            authorizeForward: 转发授权处理程序，用于授权客户端转发消息。
            published: 发布处理程序，用于在消息发布后执行自定义操作，例如记录日志或触发事件。
*/

//我只用到三个配置项，其他配置项有需要可以自行配置
const aedesApp = new aedes({
  heartbeatInterval: 60000, //60s发送一次心跳包
  connectTimeout: 120000,   //如果与服务器120s没有收到连接客户端发过来的心跳包，则视为连接断开
});
//todo：加密，存储
//验证账号密码
aedesApp.authenticate = async function (client, username, password, callback) {
  // console.log(1)
  //client.id是客户端的id，是唯一的，username是客户端的用户名（密码为buffer，需要转化为string），password是客户端的密码
  //我们可以在这里进行用户的身份验证，是否允许客户端的这次连接请求
  const newPassword = password?.toString();
  if (username === 'kuroneko' && newPassword === '20010613') {
    callback(null, true); //callback函数需要传递两个参数，第一个是错误实例，第二个是是否同意连接
  } else {
    callback(null, false)
  }
}

//监听MQTT服务器端口，当有客户端连接上时，触发该回调
aedesApp.on('client', async (client) => {
  console.log('ClientConnect:', client.id)
})

//监听MQTT服务器端口，当有客户端主动断开连接或者服务器120s内没收到某个客户端的心跳包就会触发该回调
aedesApp.on('clientDisconnect', async (client) => {
  console.log('clientDisconnect:', client.id)
})

//订阅主题。该函数第一个参数是要订阅的主题； 第二个是用于处理收到的消息的函，它接受两个参数：packet 和 callback。packet 是一个 AedesPublishPacket 对象，表示收到的消息；callback 是一个函数，用于在消息处理完成后通知 aedes 服务器；第三个参数是订阅成功的回调函数
//创建主题，客户端可通过mqtt连接发布该主题来向mqtt服务器发送信息
aedesApp.subscribe("post", async function (packet, callback) {
  callback();
}, () => {
  console.log("订阅post成功");
});

//get topic
aedesApp.subscribe("get", async function (packet, callback) {
  callback();
}, () => {
  console.log("订阅get成功");
});
//qq
aedesApp.subscribe("qq", async function (packet, callback) {
  callback();
}, () => {
  console.log("订阅qq成功");
});

//gps
aedesApp.subscribe("gps", async function (packet, callback) {
  callback();
}, () => {
  console.log("订阅gps成功");
});
const publish = (topic, status = "success", params = '""') => {
  aedesApp.publish({
    topic, //发布主题
    payload: `{"status":${status},"params":${params}}`,//消息内容
    qos: 1,//MQTT消息的服务质量（quality of service）。服务质量是1，这意味着这个消息需要至少一次确认（ACK）才能被认为是传输成功
    retain: false,// MQTT消息的保留标志（retain flag），它用于控制消息是否应该被保留在MQTT服务器上，以便新的订阅者可以接收到它。保留标志是false，这意味着这个消息不应该被保留
    cmd: "publish",// MQTT消息的命令（command），它用于控制消息的类型。命令是"publish"，这意味着这个消息是一个发布消息
    dup: false//判断消息是否是重复的
  }, (err) => {
    if (err) {
      console.log('发布失败')
    }
  })
}
//处理收到的消息,我们订阅所有主题收到的消息都可以通过这个事件获取(我们可以把订阅收到消息的处理函数写在上面订阅主题函数的第二个参数里面，或者统一写在下面)
//监听客户端通过mqtt连接发起的发布事件
aedesApp.on("publish", async function (packet, client) {
  //packet.topic表示哪个主题，packet.payload是收到的数据，是一串二进制数据，我们需要用.toString()将它转化为字符串
  if (packet.topic === 'post') {
    const recv = JSON.parse(packet.payload.toString());
    const recvKeys = Object.keys(recv)
    // console.log("Received message:", recv, recvKeys);
    recvKeys.forEach(async attr => {
      const attrVal = recv[attr]
      await pubAttrVal(attr, attrVal)
    });
    publish("post_reply")
  }
  //获取属性状态
  else if (packet.topic === 'get') {
    const latestAttrList = {}
    const attrList = await fetchAttrList()
    for (let i = 0; i < attrList.length; i++) {
      const [latestAttrVal] = await getLatestAttrVal(attrList[i].attr)
      latestAttrList[attrList[i].attr] = latestAttrVal.attrVal
    }
    const attrKeys = Object.keys(latestAttrList)
    if (attrKeys.length) {
      publish("get_reply", "success", JSON.stringify(latestAttrList))
    }
  }
  else if (packet.topic === 'qq') {
    //qq message
    console.log(packet.payload.toString())
    publish("qq_reply", "success", packet.payload.toString())
  }
  else if (packet.topic === 'gps') {
    //gps parsed message
    // console.log(packet.payload.toString())
    const GPSInfo = JSON.parse(packet.payload.toString())
    // console.log(GPSInfo)
    if (GPSInfo.dateTime && GPSInfo.status == 'A') {
      //与上一次保存的位置相同不存储
      const { lat, lng } = await getGPSInfoLatest()

      //经度dddmm.mmmmm 纬度ddmm.mmmmm 转换为度分
      GPSInfo.lng = Math.floor(GPSInfo.lng / 100) + GPSInfo.lng % 100 / 60
      GPSInfo.lat = Math.floor(GPSInfo.lat / 100) + GPSInfo.lat % 100 / 60

      if (GPSInfo.lat == (lat - 0) && GPSInfo.lng == (lng - 0)) {
        return publish("gps_reply", "success,but this is not new location", packet.payload.toString())
      }
      //不同，进行存储
      //1节/h=1.852 km/h
      GPSInfo.speed *= 1.852
      await addGPSInfo(GPSInfo)
      //todo：返回地理信息
      publish("gps_reply", "success", packet.payload.toString())
    } else {
      publish("gps_reply", "error,check your data format", packet.payload.toString())
    }

  }
})

//发布主题
//服务器定时返回信息
//服务器订阅（创建）主题：subscribe myMsg
//客户端发布服务器定义好的主题，将数据携带给服务器 request：client publish myMsg(payload)->server
//服务器通过发布主题携带数据响应客户端发布的主题 response：server publish success(payload)->client
//客户端订阅服务器发布的主题接收主题携带的数据：client subscribe success->get payload
// setInterval(() => {          //两秒发布一次
//   aedesApp.publish({
//     topic: "success",  //发布主题
//     payload: "yes",    //消息内容
//     qos: 1,            //MQTT消息的服务质量（quality of service）。服务质量是1，这意味着这个消息需要至少一次确认（ACK）才能被认为是传输成功
//     retain: false,     // MQTT消息的保留标志（retain flag），它用于控制消息是否应该被保留在MQTT服务器上，以便新的订阅者可以接收到它。保留标志是false，这意味着这个消息不应该被保留
//     cmd: "publish",    // MQTT消息的命令（command），它用于控制消息的类型。命令是"publish"，这意味着这个消息是一个发布消息
//     dup: false         //判断消息是否是重复的
//   }, (err) => {          //发布失败的回调
//     if (err) {
//       console.log('发布失败')
//     }
//   });
// }, 2000)



kApp.use(bodyParser())
kApp.useRoutes()

module.exports = {
  aedesApp, kApp
}