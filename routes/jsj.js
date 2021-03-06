let express = require('express');
let router = express.Router();
let fetch = require('node-fetch');
let log=require('../utils/mylog');
const fs = require('fs');

/**
 * 微信接送机_页面
 */
router.get('/:page', function(req, res, next) {
    res.set({"User-Agent":req.get('User-Agent')});
    res.set('Content-Type', 'text/html');
    let pg=req.params.page;
    let filePath="public/mobile/jsj/www/"+pg+".html";
    if(pg==="customer_pay") {
        filePath="public/mobile/jsj/additional/www/"+pg+".html";
    }
    console.log(filePath);
    if(fs.existsSync(filePath)){
        let html=fs.readFileSync(filePath,"utf-8");
        if(html){
            res.end(html);
        }else {
            res.status(500).end();
        }
    }else {
        res.status(404);
        res.end(fs.readFileSync("public/404.html","utf-8"));
    }
});

/**
 * 微信接送机_主页
 */
router.get('/', function(req, res, next) {
    res.set({"User-Agent":req.get('User-Agent')});
    res.set('Content-Type', 'text/html');
    let html=fs.readFileSync("public/mobile/jsj/www/index.html","utf-8");
    if(html){
        res.end(html);
    }else {
        res.status(404);
        res.end(fs.readFileSync("public/404.html","utf-8"));
    }
});

let proxy=function(req, res) {
    let url=wx_jsj_url+req.originalUrl;
    log.info(url,__filename);
    res.set({"User-Agent":req.get('User-Agent')});
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
 * 获取车型列表
 */
router.get('/user/querycartype', function(req, res, next){
    proxy(req, res);
});
/**
 * 获取当前用户信息
 */
router.get('/user/queryuser', function(req, res, next){
    proxy(req, res);
});
/**
 * 创建新订单
 */
router.get('/user/new', function(req, res, next){
    proxy(req, res);
});
/**
 * 获取相关航班数据
 */
router.get('/user/queryflight', function(req, res, next){
    proxy(req, res);
});
/**
 * 获取用户订单详情
 */
router.get('/user/detail', function(req, res, next){
    proxy(req, res);
});
/**
 * 用户取消订单
 */
router.get('/user/cancel', function(req, res, next){
    proxy(req, res);
});
/**
 * 提交用户评论
 */
router.get('/user/comment', function(req, res, next){
    proxy(req, res);
});
/**
 * 获取进行中的订单列表
 */
router.get('/user/runninglist', function(req, res, next){
    proxy(req, res);
});
/**
 * 获取已完成的订单列表
 */
router.get('/user/historylist', function(req, res, next){
    proxy(req, res);
});
/**
 * 获取微信支付参数
 */
router.get('/user/wechat/payconfig', function(req, res, next){
    proxy(req, res);
});
/**
 * 微信支付成功后更新订单
 */
router.get('/user/wechatpaysuccess', function(req, res, next){
    proxy(req, res);
});

module.exports = router;
