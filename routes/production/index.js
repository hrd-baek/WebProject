const express = require("express");
const router = express.Router();
const db = require('../../lib/db.js');

router.get('/list', (req, res) => {
    res.locals.styleNo = 2;
    res.render("list");
})


router.get('/defect', (req, res) => {
    res.locals.styleNo = 3;
    res.render("defect");
})


module.exports = router;
