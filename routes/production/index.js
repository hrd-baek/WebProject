const express = require("express");
const router = express.Router();
const db = require('../../lib/db.js');

router.get('/list', (req, res) => {
    res.locals.styleNo = 2;
    res.render("list");
})

router.post('/list', (req, res) => {
    console.log(req.body);
    const id = req.body.id;
    const password = req.body.password;
    console.log(id, password);
})


router.get('/defects', (req, res) => {
    res.locals.styleNo = 3;
    res.render("defects");
})

router.get('/cctv', (req, res) => {
    res.locals.styleNo = 4;
    res.render("cctv", { layout: false });
})

module.exports = router;
