let express = require('express');
let router = express.Router();
let fetch = require('node-fetch');
let log=require('../utils/mylog');

router.get('/', function(req, res, next) {
    res.render('weixinjsj/index', {});
});

let proxy=function(req, res) {
    let url=wx_jsj_url+req.originalUrl;
    log.info(url,__filename);
    fetch(url).then(function(res){
        log.info("响应状态："+res.status);
        return res.text();
    }).then(function(body) {
        console.log(body);
        res.end(body);
    }).catch(function(e){
        log.error(e,__filename);
        res.status(500).end(url+"  请求失败");
    });
};
router.get('/jsjorder/querycartype', function(req, res, next){
    proxy(req, res);
});

module.exports = router;
