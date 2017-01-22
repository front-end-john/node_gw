let express = require('express');
let router = express.Router();
let fetch = require('node-fetch');
let log=require('../utils/mylog');

/**
 * 微信接送机_首页
 */
router.get('/main', function(req, res, next) {
    res.set({"User-Agent":req.get('User-Agent')});
    res.render('jsj/jsj_index', {});
});

/**
 * 微信接送机_更多服务
 */
router.get('/more_service', function(req, res, next) {
    res.set({"User-Agent":req.get('User-Agent')});
    res.render('jsj/more_service', {});
});

/**
 * 微信接送机_主页
 */
router.get('/', function(req, res, next) {
    res.set({"User-Agent":req.get('User-Agent')});
    res.render('jsj/index', {});
});

/**
 * 微信接送机_支付订单
 */
router.get('/order_pay', function(req, res, next) {
    res.set({"User-Agent":req.get('User-Agent')});
    res.render('jsj/jsj_order_pay', {});
});

/**
 * 微信接送机_订单列表
 */
router.get('/order_list', function(req, res, next) {
    res.set({"User-Agent":req.get('User-Agent')});
    res.render('jsj/jsj_order_list', {});
});

/**
 * 微信接送机_订单状态
 */
router.get('/order_status', function(req, res, next) {
    res.set({"User-Agent":req.get('User-Agent')});
    res.render('jsj/jsj_order_status', {});
});

/**
 * 微信接送机_订单详情
 */
router.get('/check_order_detail', function(req, res, next) {
    res.set({"User-Agent":req.get('User-Agent')});
    res.render('jsj/check_order_detail', {});
});

/**
 * 微信接送机_退订须知
 */
router.get('/cancel_order_know', function(req, res, next) {
    res.set({"User-Agent":req.get('User-Agent')});
    res.render('jsj/cancel_order_know', {});
});

/**
 * 微信接送机_退订规则
 */
router.get('/cancel_order_rule', function(req, res, next) {
    res.set({"User-Agent":req.get('User-Agent')});
    res.render('jsj/cancel_order_rule', {});
});

/**
 * 微信接送机_订单评论
 */
router.get('/order_comment', function(req, res, next) {
    res.set({"User-Agent":req.get('User-Agent')});
    res.render('jsj/order_comment', {});
});

/**
 * 微信接送机_联系人修改
 */
router.get('/modify_contact_person', function(req, res, next) {
    res.set({"User-Agent":req.get('User-Agent')});
    res.render('jsj/modify_contact_person', {});
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
