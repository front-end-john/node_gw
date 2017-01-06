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
        log.info(body);
        res.end(body);
    }).catch(function(e){
        log.error(e,__filename);
        res.status(500).end();
    });
};
/**
 * 获取车型列表
 */
router.get('/jsjorder/querycartype', function(req, res, next){
    proxy(req, res);
});
/**
 * 获取当前用户信息
 */
router.get('/jsjorder/queryuser', function(req, res, next){
    proxy(req, res);
});
/**
 * 创建新订单
 */
router.get('/jsjorder/new', function(req, res, next){
    proxy(req, res);
});
/**
 * 获取相关航班数据
 */
router.get('/jsjorder/queryflight', function(req, res, next){
    proxy(req, res);
});
/**
 * 获取用户订单详情
 */
router.get('/jsjorder/detail', function(req, res, next){
    proxy(req, res);
});
/**
 * 用户取消订单
 */
router.get('/jsjorder/cancel', function(req, res, next){
    proxy(req, res);
});
/**
 * 提交用户评论
 */
router.get('/jsjorder/comment', function(req, res, next){
    proxy(req, res);
});
/**
 * 获取进行中的订单列表
 */
router.get('/jsjorder/runninglist', function(req, res, next){
    proxy(req, res);
});
/**
 * 获取已完成的订单列表
 */
router.get('/jsjorder/historylist', function(req, res, next){
    proxy(req, res);
});

module.exports = router;
