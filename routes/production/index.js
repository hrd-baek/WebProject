const express = require("express");
const router = express.Router();
const db = require('../../lib/db.js');
const common = require('../../src/private/common.js');

router.get('/list', (req, res) => {

    let startDate = common.getDate(0) + ' 00:00:00'
    let endDate = common.getDate(0) + ' 23:59:59'
    var sql = 'SELECT * FROM module WHERE finish_time between ?  AND ? order by finish_time ;';
    var values = [startDate, endDate];

    db.query(sql, values, (error, result) => {
        if (error) throw error;
        res.locals.styleNo = 2;
        res.render("list", { tableData: result });
    });

})

router.post('/list', (req, res) => {
    let startDate = req.body.startDate + ' 00:00:00'
    let endDate = req.body.endDate + ' 23:59:59'
    let option = req.body.option;
    let input = req.body.input;

    let sql = "";
    let values = [startDate, endDate];
    if (input == '') {
        sql = 'SELECT * FROM module WHERE finish_time BETWEEN ? AND ? ORDER BY finish_time';
    }
    else if (option == 1) {
        sql = 'SELECT * FROM module WHERE module_id LIKE ? AND finish_time BETWEEN ? AND ? ORDER BY finish_time';
        values.unshift(`%${input}%`);
    } else if (option == 2) {
        sql = 'SELECT * FROM module WHERE module_type_id LIKE ? AND finish_time BETWEEN ? AND ? ORDER BY finish_time';
        values.unshift(`%${input}%`);
    }
    db.query(sql, values, (error, result) => {
        if (error) throw error;
        res.json(result);
    });
})

router.post('/list/cell', (req, res) => {
    let moduleId = req.body.moduleId.trim();
    console.log(moduleId);
    var sql = `SELECT *
    FROM module_stacking ms
    LEFT JOIN stacking s ON ms.stacking_id = s.stacking_id
    LEFT JOIN cell c ON ms.stacking_id = c.stacking_id
    WHERE ms.module_id = ?; `;

    var values = [moduleId];
    db.query(sql, values, (error, result) => {
        if (error) throw error;
        // console.log(result);
        res.json(result);
    });
})

router.get('/defects', (req, res) => {
    let startDate = common.getDate(0) + ' 00:00:00'
    let endDate = common.getDate(0) + ' 23:59:59'
    var sql = 'SELECT * FROM module_defects md left join module m on md.module_id = m.module_id WHERE occur_time between ?  AND ? order by occur_time ;';
    var values = [startDate, endDate];

    db.query(sql, values, (error, result) => {
        if (error) throw error;
        res.locals.styleNo = 3;
        res.render("defects", { tableData: result });
    });

})

router.post('/defects', (req, res) => {
    let startDate = req.body.startDate + ' 00:00:00'
    let endDate = req.body.endDate + ' 23:59:59'
    let option = req.body.option;
    let input = req.body.input;


    let sql = "";
    let values = [startDate, endDate];
    if (input == '') {
        sql = 'SELECT * FROM module_defects md left join module m on md.module_id = m.module_id WHERE occur_time between ?  AND ? order by occur_time ;';
    }
    else if (option == 1) {
        sql = 'SELECT * FROM module_defects md left join module m on md.module_id = m.module_id WHERE m.module_id LIKE ? AND occur_time BETWEEN ? AND ? ORDER BY occur_time';
        values.unshift(`%${input}%`);
    } else if (option == 2) {
        sql = 'SELECT * FROM module_defects md left join module m on md.module_id = m.module_id WHERE type LIKE ? AND occur_time BETWEEN ? AND ? ORDER BY occur_time';
        values.unshift(`%${input}%`);
    }

    db.query(sql, values, (error, result) => {
        if (error) throw error;
        res.json(result);
    });
})

router.get('/cctv', (req, res) => {
    res.locals.styleNo = 4;
    res.render("cctv", { layout: false });
})

module.exports = router;
