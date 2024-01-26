// MQTT client
var mqttClient = null;

//MQTT info
// 각자 상황에 맞는 host, port, topic 을 사용합니다.
var mqtt_host = "broker.hivemq.com";
var mqtt_port = "8000";
var mqtt_clientId = "clientID-" + parseInt(Math.random() * 100); // 랜덤 클라이언트 ID 
var mqtt_topic = "chn/final/project/4";

mqttClient = new Paho.MQTT.Client(mqtt_host, Number(mqtt_port), mqtt_clientId);

mqttClient.onConnectionLost = onConnectionLost;
mqttClient.onMessageArrived = onMessageArrived;

mqttClient.connect({
    onSuccess: onConnect,
    onFailure: onFailure
});

// 연결 성공 시 실행되는 function
function onConnect() {
    console.log("connet : onConnect..");

    mqttClient.subscribe(mqtt_topic);
}

// 연결 실패 시 실행되는 function
function onFailure() {
    console.log("connet : onFailure..");

}

function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost : " + responseObject.errorMessage);

        // 연결 재시도
        fncConnMqtt();
    }
}

let cycleCheck = 0;
let xdCheck = 0;

// 메시지 받는 부분
function onMessageArrived(message) {

    const json = message.payloadString;
    const obj = JSON.parse(json);

    processVisible(obj.X2, $(".process_unit_1"));
    processVisible(obj.X3, $(".process_unit_2"));

    if (obj.X8) {
        processVisible(true, $(".process_unit_2"));
        document.querySelector(".process_unit_2").classList.add("go_left_1");
    }

    if (obj.XA) {
        processVisible(true, $(".process_unit_2"));
        document.querySelector(".process_unit_2").classList.add("go_left_2");
    }

    if (obj.X15) {
        processVisible(true, $(".process_unit_2"));
        document.querySelector(".process_unit_2").classList.add("go_bottom_1");
    }
    
    if (obj.X14) {
        processVisible(true, $(".process_unit_2"));
        document.querySelector(".process_unit_2").classList.add("go_top_1");
    }

    if (obj.XD && xdCheck == 0) {
        processVisible(true, $(".process_unit_2"));
        document.querySelector(".process_unit_2").classList.add("go_left_3");
        xdCheck = 1;
    }

    if (obj.X20) {
        processVisible(true, $(".process_unit_2"));
        document.querySelector(".process_unit_2").classList.add("go_top_2");
        cycleCheck = 1;
    }

    if (obj.X21 && cycleCheck) {
        processVisible(true, $(".process_unit_2"));
        $(".process_unit_2").removeClass('go_left_1 go_left_2 go_bottom_1 go_top_1 go_left_3 go_top_2');
        xdCheck = 0;
        cycleCheck = 0;

    }

    storageVisible(obj.X24, $(".storage_good .storage_work_1"));
    storageVisible(obj.X25, $(".storage_good .storage_work_2"));
    storageVisible(obj.X26, $(".storage_good .storage_work_3"));
    storageVisible(obj.X27, $(".storage_defects .storage_work_1"));
    storageVisible(obj.X28, $(".storage_defects .storage_work_2"));
    storageVisible(obj.X29, $(".storage_defects .storage_work_3"));


    // fncMqttAction(message.payloadString);
}

function processVisible(objBool, obj) {
    objBool ? obj.css('visibility', 'visible') : obj.css('visibility', 'hidden');
}

function storageVisible(objBool, obj) {
    objBool ? obj.css('visibility', 'visible') : obj.css('visibility', 'hidden');
}

// 메시지 보내기
// 각 화면에서 메시지를 보내려면 각 화면에서 아래 function 선언하여 사용
function fncMqttDoSend(sendMsg) {
    mqttClient.send(mqtt_topic, sendMsg);
}

function fncMqttAction(mqttMsg) {
    result = mqttMsg
    return (mqttMsg);
}