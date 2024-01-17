const express = require("express");
const router = express.Router();
const loginRouter = require('./login/index.js')
// const server = require('../server.js')

router.get('/', (req, res) => {
  let { user } = req.session;
  res.locals.styleNo = 1;
  console.log(user);
  res.render("dashboard");
})

router.use('/login', loginRouter);


module.exports = router;
