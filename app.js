var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var mongoose = require('mongoose');
var flash = require('connect-flash');
var session = require('express-session');
var cors = require('cors');

var app = express();

app.use(session({ 
  secret: 'shhsecret',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(cors());

require('./config/passport')(passport);

var indexRouter = require('./routes/index');


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

var createUser = require('./services/createUser');
var trackNumber = require('./services/trackNumber');
var trackedUsers = require('./services/trackedUsers');
var allNumbers = require('./services/allNumbers');
var onlineStatus = require('./services/onlineStatus');
var userFeed = require('./services/userFeed');
var getUsers = require('./services/getUsers');
var deleteAllRecords = require('./services/deleteallRecords');
var stopTrackNumber = require('./services/stopTrackNumber');
var myFeed = require('./services/myFeed');

createUser(app);
trackNumber(app);
trackedUsers(app);
allNumbers(app);
onlineStatus(app);
userFeed(app);
getUsers(app);
deleteAllRecords(app);
stopTrackNumber(app);
myFeed(app);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader('Content-Type', 'text/plain')
  res.end(JSON.stringify(req.body, null, 2))
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
  next();
});

module.exports = app;
