const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const router = require('./routes/index.js');
const expressLayout = require('express-ejs-layouts');

app.use(express.static(`${__dirname}/src/public`));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressLayout);

app.set("layout", 'layout');
app.set("layout extractScripts", true);

app.set("views", "./views");
app.set("view engine", "ejs");

var maxAge = 60 * 60 * 1000;

app.use(session({
  secret: 'finalproject',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: maxAge,
    secure: false
  }
}))

app.use((req, res, next) => {
  res.locals.user = "";
  if (req.session.user) {
    res.locals.user = req.session.user
  }
  next()
})

app.use(router);

module.exports = app;