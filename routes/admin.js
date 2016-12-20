let express = require('express');
let router = express.Router();

router.get('/',function (req, res, next) {
    res.render('admin/index', {});
});

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

module.exports = router;
