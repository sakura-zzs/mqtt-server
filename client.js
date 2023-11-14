const mqtt = require('mqtt')

//连接到 MQTT 服务器
const client = mqtt.connect("mqtt://192.168.35.152:1883", {
  username: 'admin',   //用户名
  password: '123456',  //密码
  clientId: '1',      //客户端id
});

//订阅主题
client.on("connect", function () {
  console.log(2)
  //订阅服务器主题，以获取服务器该主题携带的数据
  client.subscribe("success", function (err) {
    if (!err) {
      console.log("Subscribed to success");
    }
  });
});

//处理服务器返回的信息
client.on("message", function (topic, message) {
  if (topic === "success") {
    console.log("Received message:", message.toString());
  }
});
//发布消息
setInterval(() => {
  client.publish("myMsg", '123123');
}, 2000);
