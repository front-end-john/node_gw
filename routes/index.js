let express = require('express');
let router = express.Router();
const fs = require('fs');
let mobileReg=/iphone os|ipod|ipad|android|midp|ucweb|rv:1.2.3.4|windows ce|windows mobile/i;

/**
 * pc gw page.
 */
router.get(['/','/index(.html)?'], function(req, res, next) {
    let userAgent=req.get('User-Agent').toLowerCase();
    if(mobileReg.test(userAgent)){
        res.render('gw/mobile/index', {});
    }else {
        res.render('gw/pc/index', {});
    }
});

router.get('/aboutus(.html)?',function (req, res, next) {
    res.render('gw/pc/aboutus', {});
});

router.get('/contact(.html)?',function (req, res, next) {
    let userAgent=req.get('User-Agent').toLowerCase();

    if(mobileReg.test(userAgent)){
        res.render('gw/mobile/contact', {});
    }else {
        res.render('gw/pc/contact', {});
    }
});

router.get('/evaluate(.html)?',function (req, res, next) {

    res.render('gw/pc/evaluate', {});
});

router.get('/feidou(.html)?',function (req, res, next) {
    res.render('gw/pc/feidou', {});
});

router.get('/joinus(.html)?',function (req, res, next) {
    res.render('gw/pc/joinus', {});
});


/**
 * mobile gw pages
 */
router.get('/comment(.html)?',function (req, res, next) {
    res.render('gw/mobile/comment', {});
});

router.get('/guide(.html)?',function (req, res, next) {
    res.render('gw/mobile/guide', {});
});
router.get('/history(.html)?',function (req, res, next) {
    res.render('gw/mobile/history', {});
});

router.get('/price(.html)?',function (req, res, next) {
    res.render('gw/mobile/price', {});
});

/**
 * 后台首页
 */
router.get('/duck',function (req, res, next) {
    console.log("duck");
    fs.readFile("views/admin/index.html",(err, data)=>{
        if(err){
            res.status(500).end("未找到该页面！");
        } else{
            res.set('Content-Type', 'text/html');
            res.send(data);
        }
    })
});

module.exports = router;
