const express = require("express");
const router = express.Router();
const db = require('../../lib/db.js');

router.get('/', (req, res) => {
  res.render("login", { layout: false });
})

router.post('/', (req, res) => {
  const id = req.body.id;
  const password = req.body.password;
  var a = `${id} ${password}`;

  var sql = `select * from users where users_id = ? and password = ?;`;
  var values = [id, password];

  db.query(sql, values, (error, result) => {
    if (error) throw error;
    if (result.length > 0) {
      req.session.user = result[0];
      res.send("<script>alert('로그인 되었습니다.'); location.href ='/' </script>");
    }
    else {
      res.send("<script>alert('잘못된 정보입니다.');location.href ='/login' </script>");
    }
  });
})

module.exports = router;
