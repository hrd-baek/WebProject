const express = require("express");
const router = express.Router();
const loginRouter = require('./login/index.js')
const prodRouter = require('./production/index.js')


router.get('/', (req, res) => {
  let { user } = req.session;
  res.locals.styleNo = 1;
  res.render("dashboard");
})

router.use('/login', loginRouter);
router.use('/production', prodRouter);


module.exports = router;
