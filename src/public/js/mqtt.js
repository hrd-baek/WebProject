// MQTT client
var mqttClient = null;

//MQTT info
// 각자 상황에 맞는 host, port, topic 을 사용합니다.
var mqtt_host = "broker.hivemq.com";
var mqtt_port = "8000";
var mqtt_clientId = "clientID-" + parseInt(Math.random() * 100); // 랜덤 클라이언트 ID 
var mqtt_topic_x = "chn/final/project/4/x";
var mqtt_topic_m = "chn/final/project/4/m";

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

    mqttClient.subscribe(mqtt_topic_x);
    mqttClient.subscribe(mqtt_topic_m);
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

// 메시지 받는 부분
function onMessageArrived(message) {
    // console.log(message.destinationName);

    const json = message.payloadString;
    const obj = JSON.parse(json);

    if (message.destinationName == mqtt_topic_m) {
        if (obj.M8186) {
            processVisible(true, $(".process_unit_2"));
            document.querySelector(".process_unit_2").classList.add("go_con_1");
            processStatusStart('process_packaging');

        }
        if (obj.M8181) {
            processVisible(true, $(".process_unit_2"));
            document.querySelector(".process_unit_2").classList.add("go_left_1");
            processStatusEnd('process_packaging');
            processStatusStart('process_welding');

        }

        if (obj.M8175) {
            processVisible(true, $(".process_unit_2"));
            document.querySelector(".process_unit_2").classList.add("go_left_2");
            processStatusEnd('process_welding');
            processStatusStart('process_inspection');
        
        }

        if (obj.M8170) {
            processVisible(true, $(".process_unit_2"));
            document.querySelector(".process_unit_2").classList.add("go_bottom_1");
        }

        if (obj.M8164) {
            processVisible(true, $(".process_unit_2"));
            document.querySelector(".process_unit_2").classList.add("go_top_1");
        }

        if (obj.M8161) {
            processVisible(true, $(".process_unit_2"));
            document.querySelector(".process_unit_2").classList.add("go_left_3");
            processStatusEnd('process_inspection');
            processStatusStart('process_loading');
        }

        if (obj.M8132) {
            processVisible(true, $(".process_unit_2"));
            document.querySelector(".process_unit_2").classList.add("go_top_2");
        }

        if (obj.M8131 || obj.M8119) {
            processVisible(true, $(".process_unit_2"));
            $(".process_unit_2").removeClass('go_con_1 go_left_1 go_left_2 go_bottom_1 go_top_1 go_left_3 go_top_2');
            processVisible(false, $(".process_unit_2"));
            processStatusEnd('process_loading');
        }
    }

    if (message.destinationName == mqtt_topic_x) {
        processVisible(obj.X2, $(".process_unit_1"));
        storageVisible(obj.X24, $(".storage_good .storage_work_1"));
        storageVisible(obj.X25, $(".storage_good .storage_work_2"));
        storageVisible(obj.X26, $(".storage_good .storage_work_3"));
        storageVisible(obj.X27, $(".storage_defects .storage_work_1"));
        storageVisible(obj.X28, $(".storage_defects .storage_work_2"));
        storageVisible(obj.X29, $(".storage_defects .storage_work_3"));
    }
    // fncMqttAction(message.payloadString);
}

function processStatusStart(obj) {
    // console.log(obj1)
    var objId = $('#' + obj);
    var objIId = $('#' + obj + '_i');
    var objH5Id = $('#' + obj + '_h5');
    var objH6Id = $('#' + obj + '_h6');

    objId.css({
        "background-color": "rgb(24,176,24)"
    });
    objIId.css({
        "color": "white"
    });
    objH5Id.css({ "display": "block" });
    objH6Id.css({ "display": "none" });

    objId.addClass("blinking");
}
function processStatusEnd(obj) {
    var objId = $('#' + obj);
    var objIId = $('#' + obj + '_i');
    var objH5Id = $('#' + obj + '_h5');
    var objH6Id = $('#' + obj + '_h6');

    objId.css({
        "background-color": "hsl(217, 88.2%, 90%)"
    });
    objIId.css({
        "color": "hsl(217, 88.8%, 35.1%)"
    });
    objH6Id.css({ "display": "block" });
    objH5Id.css({ "display": "none" });
    objId.removeClass("blinking");
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