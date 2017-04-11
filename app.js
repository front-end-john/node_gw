let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let log4js = require('log4js');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let session = require('express-session');
let os = require('os');
const fs = require('fs');
let env="development";
if(os.platform()=='linux'){
    let text=fs.readFileSync("host.tag","utf-8");
    hostType=text.trim();
    if(hostType==="test"){
        global.wx_jsj_url="http://test.feibotong.com";
        global.admin_url="http://test.feibotong.com";
    }else if(hostType==="dev"){
        global.wx_jsj_url="http://dev.feibotong.com";
        global.admin_url="http://dev.feibotong.com";
    }else if(hostType==="production"){
        env="production";
        global.wx_jsj_url="http://admin.feibotong.com";
        global.admin_url="http://admin.feibotong.com";
    }
}else {
    global.wx_jsj_url="http://192.168.1.181:8080/txj-jsj";
    global.admin_url="http://dev.feibotong.com";
}

let app = express();
app.set('env', env);
if(env=="production"){
    app.set('port', 19000);
}else {
    app.set('port', 8180);
}
// view engine setup
let engine = require('express-dot-engine');
app.engine('dot', engine.__express);
app.set('view engine', 'dot');

app.set('views', path.join(__dirname, 'views'));


log4js.configure('./log4js.json',{ reloadSecs: 300 });
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
    cookie:{
        //session时长,单位毫秒
        maxAge:1800000
    }
}));
app.use(express.static(path.join(__dirname, 'public')));

let admin = require('./routes/admin');
let jsj=require('./routes/jsj');
let jsjAdmin=require('./routes/jsj_admin');

app.use('/duck', admin);
app.use('/mobile/jsj', jsj);
app.use('/jsj', jsjAdmin);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});


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
