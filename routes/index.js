const express = require("express");
const router = express.Router();
const loginRouter = require('./login/index.js')
const prodRouter = require('./production/index.js')
const mqtt = require('../mqtt.js');
const db = require('../lib/db.js');
const common = require('../src/private/common.js');
const moment = require("moment");


router.get('/', (req, res) => {
  let { user } = req.session;
  res.locals.styleNo = 1;


  let startDate = common.getToday() + ' 00:00:00'
  let endDate = common.getToday() + ' 23:59:59'

  var sql1 = 'SELECT * FROM module WHERE finish_time BETWEEN ? AND ? ORDER BY finish_time DESC; ';
  var sql2 = 'SELECT * FROM module_defects WHERE occur_time BETWEEN ? AND ? ORDER BY occur_time DESC; ';
  var values = [startDate, endDate, startDate, endDate];

  db.query(sql1 + sql2, values, (error, result) => {
    if (error) throw error;
    if (result.length > 0) {
      res.render("dashboard", { prodData: result[0], defectsData: result[1], moment });
    }
    else {
      console.log(result);
    }
  });

})

router.get('/group1', (req, res) => {
  res.locals.styleNo = 100;
  res.render("group1", { layout: false });
})


router.use('/login', loginRouter);
router.use('/production', prodRouter);



module.exports = router;
