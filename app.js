var express = require('express');

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();


var routes = require('./routes/index');
var users = require('./routes/users');
var chats = require('./routes/chats');
var rooms = require('./routes/rooms')

var flash = require('connect-flash');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');

var db = require('./config/db.js');

var app = express();

mongoose.connect(db.url[app.settings.env]);
require('./config/passport')(passport);

var routes = require('./routes/index');
var users = require('./routes/users');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

// Should be environment variable
app.use(
	session({
		secret: 'yaca-secret',
		resave: false,
		saveUninitialized: true
	})
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


app.use('/', routes);
app.use('/users', users);
app.use('/chat', chats);
app.use('/rooms', rooms);

var socket_io = require( "socket.io" );
var io = socket_io();
var s_io = require('./routes/socket.js')(io);

app.io = io;

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
