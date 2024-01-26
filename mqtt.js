const db = require('./lib/db.js');
const moment = require("moment");
const mqtt = require("mqtt")
const client = mqtt.connect('mqtt://mqtt-dashboard.com:1883')
const topic = 'chn/final/project/4/web';

// const message = {
//   a: 1,
//   b: 2
// }
// setInterval(
//   () => client.publish(topic, JSON.stringify("test")
//   ), 1000)
// let lastModule = "";
let dataCheckList = { lastModule: "", stacking: false, welding: false, barcode: false, storage: false }

client.on('connect', () => {
    //mqtt가 연결되어있는지 확인
    console.log("mqtt connected :", client.connected, ", topic :", topic);
    getLastModule();
    //topic 구독
    client.subscribe(topic); //topic 구독
    //구독해놓은 메시지가 들어오면 실행
    client.on("message", (topic, message) => {
        console.log(topic, JSON.parse(message));
        console.log(dataCheckList);
        // createModule();
        // setModuleStacking();
        // setWeldingDefects(0);
    })
})

function setBarcode(barcode) {

}

function insertBarcode(type, volt) {
    var sql = 'update module set module_type_id = ? and voltage = ? where module_id =?;';
    var values = [type, volt, dataCheckList.lastModule];

    db.query(sql, values, (error, result) => {
        if (error) throw error;
        console.log('update module storage : ' + dataCheckList.lastModule);
        dataCheckList.barcode = true;
    });
}

function setStorage(position) {
    var sql = 'update module set storage = ? where module_id =?;';
    var values = [position, dataCheckList.lastModule];

    db.query(sql, values, (error, result) => {
        if (error) throw error;
        console.log('update module storage : ' + dataCheckList.lastModule);
        dataCheckList.storage = true;
    });
}

function setWeldingDefects(bool) {
    var sql = 'update module set defects = ? where module_id =?;';
    var values = [bool, dataCheckList.lastModule];

    db.query(sql, values, (error, result) => {
        if (error) throw error;
        console.log('update module welding : ' + dataCheckList.lastModule);
        dataCheckList.welding = true;
    });
}


function setModuleStacking() {
    var sql = 'SELECT stacking_id FROM stacking ORDER BY stacking_id DESC LIMIT 3;';
    db.query(sql, (error, result) => {
        if (error) throw error;
        if (result.length > 0) {

            insertModuleStacking(result)
        }
        else {
            console.log(result);
        }
    });
}

function insertModuleStacking(res) {
    var sql = '';
    for (var i = res.length - 1; i >= 0; i--) {
        console.log(i);
        sql += `insert into module_stacking values (0,'${dataCheckList.lastModule}', '${res[i].stacking_id}'); `;
    }
    db.query(sql, (error, result) => {
        if (error) throw error;
        console.log(result);
        dataCheckList.stacking = true;
    });
}


function getLastModule() {
    var sql = `SELECT module.*, module_stacking.stacking_id
                FROM module
                LEFT JOIN module_stacking ON module.module_id = module_stacking.module_id
                ORDER BY module.module_id DESC
                LIMIT 1;`;

    db.query(sql, (error, result) => {
        if (error) throw error;
        if (result.length > 0) {
            if (result[0].finish_time == null) {
                dataCheckList.lastModule = result[0].module_id;
                console.log(result[0].module_id)
            }
            if (result[0].stacking_id != null) {
                dataCheckList.stacking = true;
            }
            if (result[0].defects != null) {
                dataCheckList.welding = true;
            }
            if (result[0].voltage != null) {
                dataCheckList.barcode = true;
            }
            if (result[0].storage != null) {
                dataCheckList.storage = true;
            }
        }
        else {
            console.log(result);
        }
    });
}

function createModule() {
    var sql = 'SELECT RIGHT(module_id, 12) as module_id, start_time, finish_time FROM module ORDER BY module_id DESC LIMIT 1;';
    db.query(sql, (error, result) => {
        if (error) throw error;
        if (result.length > 0) {
            if (result[0].finish_time == null) {
                // console.log(result[0].finish_time)
                return;
            } else {
                let date = result[0].module_id.substr(0, 8);
                let cnt = parseInt(result[0].module_id.substr(9, 11)) + 1;
                let today = moment().format("YYYYMMDD");
                let newCnt = cnt.toString().padStart(3, "0");
                console.log(date, today)
                if (date == today) {
                    insertModule(today, newCnt);
                }
                else {
                    insertModule(today, '001');
                }
            }
        }
        else {
            console.log(result);
        }
    });
}

function insertModule(day, number) {
    var newModule = 'M' + day + '-' + number;
    var sql = 'insert into module (module_Id, start_time) values(?, now());';
    var values = [newModule];

    db.query(sql, values, (error, result) => {
        if (error) throw error;
        console.log('insert module : ' + newModule);
        dataCheckList.lastModule = newModule;
    });
}