let express = require('express');
let fetch = require('node-fetch');
let log=require('../utils/mylog');
let router = express.Router();
const fs = require('fs');

/**
 * admin加载缓存配置
 */
router.get('/local_cache', function(req, res, next) {
    let text=fs.readFileSync("public/local-cache.json","utf-8");
    if(text){
        res.json(JSON.parse(text));
    }else {
        res.status(305).end();
    }
});

/**
 * 后台首页
 */
router.get('/',function (req, res, next) {
    res.render('admin/index', {});
});
/**
 * 后台登陆验证
 */
router.post('/login',function (req, res, next) {
    let user={name:'fbt',password:'123'};
    let reqMsg=req.body;
    console.log(reqMsg);
    if(reqMsg.account===user.name && reqMsg.password===user.password){
        res.end("ok");
    }else {
        res.end("reject");
    }
});

let proxy=function(req, res) {
    let url=admin_url+req.originalUrl;
    log.info(url,__filename);
    fetch(url).then(function(res){
        log.info("响应状态："+res.status);
        return res.text();
    }).then(function(body) {
        log.info("响应内容："+body);
        res.end(body);
    }).catch(function(e){
        log.error(e,__filename);
        res.status(500).end();
    });
};
/**
 * 获取订单查询列表
 */
router.get('/api/orders/query', function(req, res, next){
    proxy(req, res);
});
/**
 * 获取订单详情数据
 */
router.get('/api/orders/orderdetails', function(req, res, next){
    proxy(req, res);
});


module.exports = router;
