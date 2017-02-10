let express = require('express');
let fetch = require('node-fetch');
let log=require('../utils/mylog');
let router = express.Router();

let proxy=function(req, res) {
    let url=admin_url+req.originalUrl;
    log.info(url,__filename);
    fetch(url).then(function(res){
        log.info("响应状态："+res.status);
        return res.text();
    }).then(function(body) {
        //log.info("响应内容："+body);
        res.end(body);
    }).catch(function(e){
        log.error(e,__filename);
        res.status(500).end();
    });
};

/**
 * 获取接送机订单详情数据
 */
router.get('/system/orderlist', function(req, res, next){
    proxy(req, res);
});

/**
 * 获取接送机订单详情数据_条件查询
 */
router.get('/system/query', function(req, res, next){
    proxy(req, res);
});

/**
 * 接送机订单详情_添加备注
 */
router.get('/system/addremark', function(req, res, next){
    proxy(req, res);
});

/**
 * 获取接送机进行中的订单数量
 */
router.get('/system/runningordernumber', function(req, res, next){
    proxy(req, res);
});

/**
 * 获取接送机的订单详情
 */
router.get('/system/orderdetail', function(req, res, next){
    proxy(req, res);
});


module.exports = router;
