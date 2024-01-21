const mqtt = require("mqtt")
const client = mqtt.connect('mqtt://mqtt-dashboard.com:1883')

const topic = 'final_project_team_4';
// const message = {
//   a: 1,
//   b: 2
// }
// setInterval(
//   () => client.publish(topic, JSON.stringify("test")
//   ), 1000)

client.on('connect', () => {
  //mqtt가 연결되어있는지 확인
  console.log("mqtt connected :", client.connected, ", topic :", topic);
  //topic 구독
  client.subscribe(topic); //topic 구독
  //구독해놓은 메시지가 들어오면 실행
  client.on("message", (topic, message) => {
    console.log(topic, JSON.parse(message));
  })
})
