let express = require('express');
let fetch = require('node-fetch');
let log=require('../utils/mylog');
let router = express.Router();
let http = require("http");
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
    fs.readFile("views/admin/index.html",(err, data)=>{
        if(err){
            res.status(500).end("未找到该页面！");
        } else{
            res.set('Content-Type', 'text/html');
            res.send(data);
        }
    })
});

let proxy=function(proxyReq, proxyRes) {
    let url=admin_url+proxyReq.originalUrl;
    log.info(url,__filename);
    fetch(url,{headers:proxyReq.headers}).then((res)=>{
        log.info("响应状态："+res.status);
        proxyRes.status(res.status);
        return res.text();
    }).then(function(body) {
        //log.info("响应内容："+body);
        proxyRes.end(body);
    }).catch(function(e){
        log.error(e,__filename);
        proxyRes.status(500).end();
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

/**
 * 获取机场列表数据
 */
router.get('/api/areas/airports', function(req, res, next){
    proxy(req, res);
});

/**
 * 获取订单来源列表数据
 */
router.get('/api/orders/get_comefroms', function(req, res, next){
    proxy(req, res);
});

/**
 * 添加用户标签
 */
router.get('/api/users/marking', function(req, res, next){
    proxy(req, res);
});

/**
 * 修改用户信息
 */
router.get('/api/users/edit', function(req, res, next){
    proxy(req, res);
});

/**
 * 修改车辆信息
 */
router.get('/api/cars/edit_car_info', function(req, res, next){
    proxy(req, res);
});

/**
 * 修改返程航班信息
 */
router.get('/api/orders/edit_returning_info', function(req, res, next){
    proxy(req, res);
});

/**
 * 修改航班落地时间
 */
router.get('/api/orders/set_flight_landing_time', function(req, res, next){
    proxy(req, res);
});

/**
 * 获取紧急订单
 */
router.get('/api/orders/check_new', function(req, res, next){
    proxy(req, res);
});

/**
 * 获取航站楼列表
 */
router.get('/api/areas/terminals', function(req, res, next){
    proxy(req, res);
});

/**
 * 获取用户信息
 */
router.get('/api/users/userinfo', function(req, res, next){
    proxy(req, res);
});

/**
 * 获取用户车辆信息
 */
router.get('/api/cars/list_by_userid', function(req, res, next){
    proxy(req, res);
});

/**
 * 客服下单
 */
router.get('/api/orders/neworder', function(req, res, next){
    proxy(req, res);
});

module.exports = router;
