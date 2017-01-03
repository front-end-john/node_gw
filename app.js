let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let log4js = require('log4js');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let session = require('express-session');
let os = require('os');
if(os.platform()=='linux'){
    global.wx_jsj_url="";
}else {
    global.wx_jsj_url="http://192.168.1.234:8080/txj-jsj";
}

let app = express();

// view engine setup
let engine = require('express-dot-engine');
app.engine('dot', engine.__express);
app.set('view engine', 'dot');

app.set('views', path.join(__dirname, 'views'));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

log4js.configure('./config/log4js.json',{ reloadSecs: 300 });
let logger = log4js.getLogger('app');
logger.setLevel(log4js.levels.INFO);
app.use(log4js.connectLogger(logger));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'redis@session',
    cookie: {
        //session时长,单位毫秒
        maxAge:3600000
    }
}));
app.use(express.static(path.join(__dirname, 'public')));

let routes = require('./routes/index');
let users = require('./routes/users');
let admin = require('./routes/admin');
let jsj=require('./routes/weixinjsj');

app.use('/', routes);
app.use('/users', users);
app.use('/admin', admin);
app.use('/jsj', jsj);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
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
