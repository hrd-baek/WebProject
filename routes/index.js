const express = require("express");
const router = express.Router();
const loginRouter = require('./login/index.js')

router.get('/', (req, res) => {
  let { user } = req.session;
  console.log(user);

  res.render("index");
})

router.use('/login', loginRouter);

module.exports = router;
