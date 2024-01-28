const express = require("express");
const router = express.Router();
const loginRouter = require('./login/index.js')
const prodRouter = require('./production/index.js')
const mqtt = require('../mqtt.js');
const db = require('../lib/db.js');
const common = require('../src/private/common.js');

router.get('/', (req, res) => {
  res.locals.styleNo = 1;
  let startDate = common.getDate(0) + ' 00:00:00';
  let endDate = common.getDate(0) + ' 23:59:59';
  let yesterdayStart = common.getDate(-1) + ' 00:00:00';
  let yesterdayEnd = common.getDate(-1) + ' 23:59:59';
  var sql1 = 'SELECT * FROM module WHERE finish_time BETWEEN ? AND ? ORDER BY finish_time DESC; ';
  var sql2 = 'SELECT (SELECT COUNT(DISTINCT module_id) FROM module_defects WHERE occur_time BETWEEN ? AND ? ) AS distinct_module_count,  module_defects.*' +
    'FROM module_defects ' +
    'WHERE occur_time BETWEEN ? AND ? ' +
    'ORDER BY occur_time DESC;'
  var sql3 = `SELECT 'module_defects' AS source, COUNT(DISTINCT module_id) AS module_count
              FROM module_defects  
              WHERE occur_time BETWEEN ? AND ?
              UNION
              SELECT 'module' AS source, COUNT(DISTINCT module_id) AS module_count
              FROM module
              WHERE finish_time BETWEEN ? AND ?
              ORDER BY module_count DESC; `

  var values = [startDate, endDate, startDate, endDate, startDate, endDate, yesterdayStart, yesterdayEnd, yesterdayStart, yesterdayEnd];
  db.query(sql1 + sql2 + sql3, values, (error, result) => {
    if (error) throw error;
    if (result.length > 0) {
      let yDefData = result[2][1].module_count;
      let yProdData = result[2][0].module_count - yDefData;
      let yTotalData = result[2][0].module_count;

      let tDefData = result[1][0].length > 0 ? result[1][0].distinct_module_count : 0;
      let tProdData = result[0].length - tDefData;
      let tTotalData = result[0].length;

      let productionDifference = tProdData - yProdData;
      let prodPercentageChange = ((productionDifference / yProdData) * 100).toFixed(1);

      let defectsDifference = tDefData - yDefData;
      let defectsPercentageChange = ((defectsDifference / yDefData) * 100).toFixed(1);

      let totalDifference = tTotalData - yTotalData;
      let totalPercentageChange = ((totalDifference / yTotalData) * 100).toFixed(1);

      var data = {
        prodData: result[0],
        defectsData: result[1],
        prodChange: parseFloat(prodPercentageChange),
        defectsChange: parseFloat(defectsPercentageChange),
        totalChange: parseFloat(totalPercentageChange)
      }
      res.render("dashboard", data);
    }
    else {
      console.log(result);
    }
  });
})

router.post('/', (req, res) => {
  let startDate = common.getDate(0) + ' 00:00:00'
  let endDate = common.getDate(0) + ' 23:59:59'
  let yesterdayStart = common.getDate(-1) + ' 00:00:00';
  let yesterdayEnd = common.getDate(-1) + ' 23:59:59';

  var sql1 = 'SELECT * FROM module WHERE finish_time BETWEEN ? AND ? ORDER BY finish_time DESC; ';
  var sql2 = 'SELECT (SELECT COUNT(DISTINCT module_id) FROM module_defects WHERE occur_time BETWEEN ? AND ? ) AS distinct_module_count,  module_defects.*' +
    'FROM module_defects ' +
    'WHERE occur_time BETWEEN ? AND ? ' +
    'ORDER BY occur_time DESC;'
  var sql3 = `SELECT 'module_defects' AS source, COUNT(DISTINCT module_id) AS module_count
    FROM module_defects  
    WHERE occur_time BETWEEN ? AND ?
    UNION
    SELECT 'module' AS source, COUNT(DISTINCT module_id) AS module_count
    FROM module
    WHERE finish_time BETWEEN ? AND ?
    ORDER BY module_count DESC; `
  var values = [startDate, endDate, startDate, endDate, startDate, endDate, yesterdayStart, yesterdayEnd, yesterdayStart, yesterdayEnd];

  db.query(sql1 + sql2 + sql3, values, (error, result) => {
    if (error) throw error;
    let yDefData = result[2][1].module_count;
    let yProdData = result[2][0].module_count - yDefData;
    let yTotalData = result[2][0].module_count;

    let tDefData = result[1][0].length > 0 ? result[1][0].distinct_module_count : 0;
    let tProdData = result[0].length - tDefData;
    let tTotalData = result[0].length;

    let productionDifference = tProdData - yProdData;
    let prodPercentageChange = ((productionDifference / yProdData) * 100).toFixed(1);

    let defectsDifference = tDefData - yDefData;
    let defectsPercentageChange = ((defectsDifference / yDefData) * 100).toFixed(1);

    let totalDifference = tTotalData - yTotalData;
    let totalPercentageChange = ((totalDifference / yTotalData) * 100).toFixed(1);

    var data = {
      prodData: result[0],
      defectsData: result[1],
      prodChange: parseFloat(prodPercentageChange),
      defectsChange: parseFloat(defectsPercentageChange),
      totalChange: parseFloat(totalPercentageChange)
    }

    res.json(data);
  });
})


router.get('/group1', (req, res) => {
  res.locals.styleNo = 100;
  res.render("group1", { layout: false });
})


router.use('/login', loginRouter);
router.use('/production', prodRouter);



module.exports = router;
