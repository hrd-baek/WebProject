const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const router = require('./routes/index.js');

app.set("views", "./views");
app.set("view engine", "ejs");

app.use(express.static(`${__dirname}/src/public`));
app.use(bodyParser.urlencoded({ extended: false }));

var maxAge = 60 * 60 * 1000;

app.use(session({
  secret: 'baek',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: maxAge,
    secure: false
  }
}))

app.use((req, res, next) => {
  res.locals.user = "";
  if(req.session.user){
    res.locals.user = req.session.user
  }
  next()
})

app.use(router);

module.exports = app;