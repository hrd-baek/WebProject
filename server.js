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

Stream = require('node-rtsp-stream')
stream = new Stream({
  name: 'name',
  streamUrl: 'rtsp://hrdfinalproject4:1q2w3e4r@192.168.0.103/stream1',
  wsPort: 9999,
  ffmpegOptions: { // options ffmpeg flags
    '-stats': '', // an option with no neccessary value uses a blank string
    '-r': 30 // options with required values specify the value after the key
  }
})
stream2 = new Stream({
  name: 'name2',
  streamUrl: 'rtsp://qwe123:qwe123@192.168.0.101/stream1',
  wsPort: 9900,
  ffmpegOptions: { // options ffmpeg flags
    '-stats': '', // an option with no neccessary value uses a blank string
    '-r': 30 // options with required values specify the value after the key
  }
})


module.exports = app;