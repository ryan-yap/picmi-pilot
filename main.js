var express = require('express')
var cors = require('cors');
var path = require('path');
var favicon = require('serve-favicon');

var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('./passports/passport')
var expressSession = require('express-session');

var routes = require('./routes/index');
var users = require('./routes/users');
var sessions = require('./routes/sessions')
var photos = require('./routes/photos')
var locations = require('./routes/locations')
var videos = require('./routes/videos')
var streams = require('./routes/streams')
var reports = require('./routes/reports')
var notifications = require('./routes/notifications')
var jobs = require('./routes/jobs')
var tests = require('./routes/test')

var app = express();
app.use(cors());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//==============Configuration for passport.js====================
//Cookies Setting
var MongoStore = require('connect-mongo')(expressSession);

app.use(expressSession({
  name: 'PicMi',
  secret: 'njskdfjkjns72^2',
  duration: 60 * 60 * 24 * 365 * 10,
  activeDuration: 60 * 60 * 24 * 365 *10,
  saveUninitialized : true,
  resave: true,
  store: new MongoStore({ url: 'mongodb://52.8.188.79:27017/Session' })
  }));
//Initializing passport
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser('njskdfjkjns72^2'))

//===========================Routing==============================
//Description: This part of main.js routes incoming requests to 
//             their respective handling modules. All the modules 
//             are stored in the "routes" folder. 
app.use(express.static(__dirname + '/public'));
app.use('/', routes);
app.use('/users', users);
app.use('/sessions', sessions)
app.use('/photos', photos)
app.use('/locations', locations)
app.use('/videos', videos)
app.use('/streams', streams)
app.use('/reports', reports)
app.use('/notifications', notifications)
app.use('/test', tests)
app.use('/jobs', jobs)

//========================Socket.io Handling======================
//
//
//
//========================404 Error Handling======================
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;