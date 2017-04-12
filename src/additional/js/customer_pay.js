import React from 'react';
import ReactDOM from 'react-dom';
import es6 from "es6-promise";
es6.polyfill();
import 'whatwg-fetch';

import PulldownTip from '../widgets/pulldown_tip';
import {decLocSearch} from '../util';
let Page=React.createClass({
    componentWillMount(){
        document.body.addEventListener("touchstart",()=>{});
        let {openid}=decLocSearch(location.search);
        openid && sessionStorage.setItem("OpenId",openid);
    },
    componentDidMount(){

    },
    handleWXPay(){
        /**
         * 从后台获取微信支付验证参数
         */
        let dom=document.getElementById("dialog");
        let openid=sessionStorage.getItem("OpenId");
        let url="/api3/payment/config/wechatchehou?chargeid=105&openid="+openid;
        //console.log(url);
        fetch(url,{credentials:'include'}).then((res)=>{
            console.log("请求微信支付参数响应状态：",res.status);
            //console.log(res);
            if(+res.status < 400){
                return res.json();
            }else {
                throw new Error("服务异常");
            }
        }).then((obj)=>{
            console.log("微信支付验证参数：",obj);
            if(obj.code === 0){
                wx.config({
                    debug: true, // 开启调试模式,仅在pc端时才会打印。
                    appId: obj.record.appid, // 必填，公众号的唯一标识
                    timestamp: obj.record.timestamp, // 必填，生成签名的时间戳
                    nonceStr:  obj.record.noncstr, // 必填，生成签名的随机串
                    signature: obj.record.paymentpackage,// 必填，签名，见附录1
                    jsApiList: ["chooseWXPay"] // 必填
                });
                wx.ready(()=>{
                    wx.chooseWXPay({
                        timestamp: obj.record.timestamp,
                        nonceStr: obj.record.noncstr,
                        package: "prepay_id="+obj.record.prepayid,
                        signType: "MD5",
                        paySign: obj.record.sign,
                        success: function (res) {
                            let errMsg=res.errMsg;
                            if(errMsg==="chooseWXPay:cancel" || errMsg==="chooseWXPay:fail" ){
                                ReactDOM.render(<PulldownTip msg="支付失败！" />,dom);
                                return 0;
                            }else if(errMsg==="chooseWXPay:ok"){
                                ReactDOM.render(<PulldownTip msg="支付成功！" />,dom);
                            }
                        }
                    });
                });
                wx.error((res)=>{
                    console.log("微信验证错误：",res);
                    ReactDOM.render(<PulldownTip msg="微信验证失败！" />,dom);
                });
            }else {
                console.log("获取微信验证参数错误：",obj);
                ReactDOM.render(<PulldownTip msg={obj.message} />,dom);
            }
        }).catch((e)=>{
            ReactDOM.render(<PulldownTip msg="获取微信支付参数失败！" />,dom);
            console.warn('错误', e);
        });
    },
    render(){
        return(
            <div>
                <section>
                    <label>付款金额</label> <label>¥2480</label>
                    <p>根据4S店检测结果，出具保养项目所需费用，支付后飞泊通车
                        管家会全程跟进您爱车的保养情况。</p>
                </section>
                <button onClick={this.handleWXPay}>立即支付</button>
            </div>
        );
    },
    componentWillUnmount(){
        let dom=document.getElementById("dialog");
        dom.style.display="none";
    }
});

ReactDOM.render(<Page /> , document.getElementById("appContainer"));