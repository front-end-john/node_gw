
import React from 'react';
import ReactDOM from 'react-dom';
import Loading from '../widgets/loading';
import PulldownTip from '../widgets/pulldown_tip';
import {decDatetime,decLocSearch} from '../util';

import es6 from "es6-promise";
es6.polyfill();
import 'whatwg-fetch';
global.jsj_static_path="/mobile/jsj";
global.jsj_api_path="/jsj";
let OrderPay=React.createClass({
    getInitialState(){
        return {ccp:{},detail:{}}
    },
    componentWillMount(){
        this.carImgList=[jsj_static_path+"/img/07.png",jsj_static_path+"/img/08.png",
            jsj_static_path+"/img/09.png",jsj_static_path+"/img/10.png"];
        let detail=sessionStorage.getItem("TravelDetailInfo");
        //console.log(decLocSearch(location.search));
        let {name,phonenumber}=decLocSearch(location.search);
        detail=detail?JSON.parse(detail):{};
        this.setState({detail});
        sessionStorage.setItem("ChangedContactPerson",JSON.stringify({name,phonenumber}));
    },
    componentDidMount(){
        let {serialnumber,openid}=decLocSearch(location.search);
        openid && sessionStorage.setItem("OpenId",openid);
        serialnumber && sessionStorage.setItem("OrderSerialNumber",serialnumber);
        let detail=sessionStorage.getItem("TravelDetailInfo");
        if(detail) return 0;
        /**
         * 显示加载中
         */
        let dom=document.getElementById("dialog");
        ReactDOM.render(<Loading />,dom);
        let url=jsj_api_path+"/user/detail";
        url+="?serialnumber="+serialnumber;
        console.log("获取订单详情url",url);
        fetch(url,{credentials:'include'}).then(function(res){
            console.log("查询订单详情响应状态：",res.status);
            dom.style.display="none";
            if(+res.status < 400){
                return res.text();
            }else {
                throw new Error("服务异常");
            }
        }).then((str)=>{
            let obj=JSON.parse(str);
            console.log("订单详细数据：",obj);
            if(obj.code==0){
                this.setState({detail:obj.record});
                sessionStorage.setItem("TravelDetailInfo",JSON.stringify(obj.record));
            }else {
                ReactDOM.render(<PulldownTip msg={obj.message} />,dom);
            }
        }).catch(function(e) {
            ReactDOM.render(<PulldownTip msg="订单获取失败,请稍后再试！" />,dom);
            console.warn('错误', e);
        });
    },
    /**
     * 处理用户备注更改
     */
    handleRemarkChange(e){
        let remark=e.target.value.trim();
        let textLen=60;
        if(remark.length>=textLen){
            remark=remark.substr(0,textLen);
            e.target.value=remark;
        }
        this.setState({remark});
        sessionStorage.setItem("ChangedUserRemark",remark);
    },
    /**
     * 处理联系人更改
     */
    handleModifyContact(){
        let ccp=sessionStorage.getItem("ChangedContactPerson");
        ccp=ccp?JSON.parse(ccp):{};
        location.href="/mobile/jsj/modify_contact_person?name="+
            encodeURI(ccp.name)+"&phonenumber="+ccp.phonenumber;
    },
    /**
     * 处理下单请求
     */
    handlePay(){
        /**
         * 显示加载中
         */
        let dom=document.getElementById("dialog");
        ReactDOM.render(<Loading />,dom);
        let serialnumber=sessionStorage.getItem("OrderSerialNumber");
        let userremark=sessionStorage.getItem("ChangedUserRemark");
        let cp=this.state.ccp;
        let actualname=cp.name,actualphone=cp.phonenumber;
        /**
         * 从后台获取微信支付验证参数
         */
        let openid=sessionStorage.getItem("OpenId");
        let url=jsj_api_path+"/user/wechat/payconfig?serialnumber="+serialnumber+"&openid="+openid;
        //console.log(url);
        fetch(url,{credentials:'include'}).then((res)=>{
            console.log("请求微信支付参数响应状态：",res.status);
            dom.style.display="none";
            console.log(res);
            if(+res.status < 400){
                return res.text();
            }else {
                throw new Error("服务异常");
            }
        }).then((str)=>{
            let obj=JSON.parse(str);
            console.log("微信支付验证参数：",obj);
            if(obj.code == 0){
                wx.config({
                    debug: false, // 开启调试模式,仅在pc端时才会打印。
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
                            if(errMsg=="chooseWXPay:cancel" || errMsg=="chooseWXPay:fail" ){
                                ReactDOM.render(<PulldownTip msg="支付失败！" />,dom);
                                return 0;
                            }else if(errMsg=="chooseWXPay:ok"){
                                ReactDOM.render(<PulldownTip msg="支付成功！" />,dom);
                                setTimeout(()=>{
                                    location.href="#/travel_detail";
                                },1500);
                            }
                            /**
                             *支付成功后更新订单
                             */
                            url=jsj_api_path+"/user/wechatpaysuccess?"+
                                queryStr.stringify({serialnumber,actualname,actualphone,userremark});
                            fetch(url,{credentials:'include'}).then(function(res){
                                console.log("订单更新响应状态：",res.status);
                                dom.style.display="none";
                                if(+res.status < 400){
                                    return res.text();
                                }else {
                                    throw new Error("服务异常");
                                }
                            }).then((str)=>{
                                console.log(str);
                            }).catch(function(e){
                                console.warn('错误', e);
                            });
                        }
                    });
                });
                wx.error(function(res){
                    ReactDOM.render(<PulldownTip msg="微信验证失败！" />,dom);
                    console.log("微信验证错误：",res);
                });
            }else {
                ReactDOM.render(<PulldownTip msg={obj.message} />,dom);
            }
        }).catch(function(e){
            ReactDOM.render(<PulldownTip msg="获取微信支付参数失败！" />,dom);
            console.warn('错误', e);
        });
    },
    render(){
        let detail=this.state.detail||{};
        let orderType=detail.ordertype||1,list=[];
        /**
         * 车型数据
         */
        let c=detail.cartypeinfo||{};
        let f=detail.flightinfo||{};
        let {year,month,day,hour,minute} =decDatetime(detail.bookingtime);

        let number = f.flightnumber?f.flightnumber.toUpperCase():"";
        let useCarTime=year?year+"-"+month+"-"+day+" "+hour+":"+minute:"";
        let changedRemark=sessionStorage.getItem("ChangedUserRemark");
        let ccp=sessionStorage.getItem("ChangedContactPerson");
        ccp=ccp?JSON.parse(ccp):{};
        if(+orderType==1){
            list[0]=(<li key={0}>
                <p>出发机场</p><p>{detail.startaddress||''}</p>
            </li>);
            list[1]=(<li key={1}><p>送达地址</p><p>{detail.endaddress||""}</p></li>);
        }else {
            list[0]=(<li key={0}>
                <p>出发地址</p><p>{detail.startaddress||''}</p>
            </li>);
            list[1]=(<li key={1}><p>送达机场</p><p>{detail.endaddress||""}</p></li>);
        }

        return(
            <div className="order-detail">
                <ul className="order-car-info">
                    <li>
                        <img src={c.id?this.carImgList[+c.id-1]:""}/>
                    </li>
                    <li>
                        <p><em>{c.cartype||''}</em>
                            <img src={jsj_static_path+"/img/people.png"}/> &le;{c.passengernumber||0}人
                            <img src={jsj_static_path+"/img/trunk.png"}/> &le;{c.luggagenumber||0}件</p>
                        <p>{c.cardescription||''}</p>
                    </li>
                </ul>
                <ul className="order-flight-info">
                    <li>接机</li>
                    <li><p>航班号</p><p>{number}</p></li>
                    <li>
                        <p>用车时间</p><p>{useCarTime}</p>
                    </li>
                    {list}
                    <li>
                        <p>行程备注</p>
                        <p><textarea placeholder="提前告知司机途径地点，方便司机规划行程(选填),最多60个字符。"
                                     defaultValue={changedRemark||detail.userremark||""}
                                     onChange={this.handleRemarkChange} /></p>
                    </li>
                </ul>

                <ul className="order-contact" onClick={this.handleModifyContact}>
                    <li>联系人</li>
                    <li>{ccp.name||detail.actualname||""}&ensp;
                        {ccp.phonenumber||detail.actualphone||""}<i className="arrow" /></li>
                </ul>
                <p className="notice"><a href="/mobile/jsj/#/cancel_notice">《预定须知&退订须知》</a></p>
                <ul className="bottom-pay">
                    <li>需支付:<em>&yen;{parseFloat(detail.totalfee||0).toFixed(2)}</em></li>
                    <li onClick={this.handlePay}>进行支付</li>
                </ul>
            </div>
        );
    },
    componentWillUnmount(){
        let dom=document.getElementById("dialog");
        dom.style.display="none";
    }
});

ReactDOM.render(<OrderPay /> , document.getElementById("appContainer"));