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

let proxy=function(req, res) {
    let url=admin_url+req.originalUrl;
    log.info(url,__filename);
    let cookie=`admin="${req.cookies.admin}";admin_skey="${req.cookies.admin_skey}";username=${req.cookies.username}`;
    log.warn("cookie:"+cookie);
    fetch(url,{headers:req.headers}).then((res)=>{
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

let proxyWithCookie=(req, res)=>{
    let cookie=`admin="${req.cookies.admin}";admin_skey="${req.cookies.admin_skey}";username=${req.cookies.username}`;
    let host=admin_url.replace(/^https?:\/\//,"");
    log.warn("cookie:"+cookie);
    console.dir(req.headers);
    let options = {
        "method": "GET",
        "hostname": host,
        "port": null,
        "path": req.originalUrl,
        "headers": req.headers
    };
    let proxyReq = http.request(options, (proxyRes)=>{
        let chunks = [];
        proxyRes.on("data", function (chunk) {
            chunks.push(chunk);
        });
        proxyRes.on("end", function () {
            let body = Buffer.concat(chunks);
            body = body.toString();
            log.info("响应内容："+body);
            res.end(body);
        });
    });
    proxyReq.on('error', (e) => {
        log.error(`problem with request: ${e.message}`);
    });
    proxyReq.end();
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

module.exports = router;
