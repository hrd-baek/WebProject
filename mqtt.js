const db = require('./lib/db.js');
const moment = require("moment");
const mqtt = require("mqtt")
const client = mqtt.connect('mqtt://mqtt-dashboard.com:1883')
const topic_m = 'chn/final/project/4/m';
const topic_barcode = 'chn/final/project/4/barcode';
const topic_welding = 'chn/final/project/4/welding';
const topic_array = [topic_m, topic_barcode, topic_welding];

// const message = {
//   a: 1,
//   b: 2
// }
// setInterval(
//   () => client.publish(topic, JSON.stringify("test")
//   ), 1000)


let dataCheckList = { lastModule: "", stacking: false, welding: false, barcode: false, storage: false }

client.on('connect', () => {
    //mqtt가 연결되어있는지 확인
    console.log("mqtt connected :", client.connected, ", topic :", topic_array);
    getLastModule();
    //topic 구독
    client.subscribe(topic_array); //topic 구독
    //구독해놓은 메시지가 들어오면 실행

    client.on("message", (topic, message) => {
        let data = JSON.parse(message);
        if (topic == topic_m) {
            if (data.M8186 && dataCheckList.lastModule == "") {
                createModule();
            }
            if (dataCheckList.lastModule != "") {
                if (data.M8181 && dataCheckList.stacking == false) {
                    setModuleStacking();
                }
                if (data.M8131 || data.M8119) {
                    if (dataCheckList.storage == false) {
                        setModuleStorage();
                    }
                }
            }
        }
        if (dataCheckList.lastModule != "") {
            if (topic == topic_barcode) {
                if (dataCheckList.barcode == false) {
                    var type = data.barcode.substr(0, 3).toString();
                    var voltTemp = parseInt(data.barcode.substr(3, 2));
                    var volt = 0;
                        console.log(type, voltTemp);
                    if (type == '752' || type == '491' || type == '251') {
                        if (type == '752') {
                            volt = voltTemp * 2;
                            if (volt < 30 || volt > 70) {
                                insertModuleDefects("전압 이상");
                            }
                        } else if (type == '491') {
                            volt = voltTemp * 10
                            if (volt < 70 || volt > 90) {
                                insertModuleDefects("전압 이상");
                            }
                        } else if (type == '251') {
                            volt = voltTemp;
                            if (volt < 20 || volt > 30) {
                                insertModuleDefects("전압 이상");
                            }
                        }
                        insertBarcode('module-'+type, volt);
                    } else {
                        insertModuleDefects("바코드 에러");
                    }
                }
            }
            if (topic == topic_welding) {
                if (dataCheckList.welding == false) {
                    if (data.M802) {
                        setWeldingDefects(false);
                    }
                    else {
                        setWeldingDefects(true);
                        insertModuleDefects("용접 불량");
                    }
                }
            }
        }
    })
})


function setModuleStorage() {
    var sql = 'update module set finish_time = now() where module_id =?;';
    var values = [dataCheckList.lastModule];

    db.query(sql, values, (error, result) => {
        if (error) throw error;
        console.log('update module finish time : ' + dataCheckList.lastModule);
        dataCheckList.storage = true;
        resetDataCheckList("");
    });
}

function insertBarcode(type, volt) {
    var sql = 'update module set module_type_id = ?, voltage = ? where module_id =?;';
    var values = [type, volt, dataCheckList.lastModule];

    db.query(sql, values, (error, result) => {
        if (error) throw error;
        console.log('insert module barcode : ' + dataCheckList.lastModule);
        dataCheckList.barcode = true;
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

function insertModuleDefects(type) {
    var sql = 'insert module_defects values(0,?,?,now());';
    var values = [dataCheckList.lastModule, type];

    db.query(sql, values, (error, result) => {
        if (error) throw error;
        console.log('insert module defecs ' + type + ' : ' + dataCheckList.lastModule);
    });
}

function setModuleStacking() {
    var sql = 'SELECT stacking_id FROM stacking WHERE b_test = 0 ORDER BY stacking_id DESC LIMIT 3;';
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


function createModule() {
    var sql = 'SELECT RIGHT(module_id, 12) as module_id, start_time, finish_time FROM module ORDER BY module_id DESC LIMIT 1;';
    db.query(sql, (error, result) => {
        if (error) throw error;
        if (result.length > 0) {
            if (result[0].finish_time == null) {
                return;
            } else {
                let date = result[0].module_id.substr(0, 8);
                let cnt = parseInt(result[0].module_id.substr(9, 11)) + 1;
                let today = moment().format("YYYYMMDD");
                let newCnt = cnt.toString().padStart(3, "0");
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
        resetDataCheckList(newModule);
    });
}

function resetDataCheckList(module) {
    dataCheckList = { lastModule: module, stacking: false, welding: false, barcode: false, storage: false };
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