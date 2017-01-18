import React from 'react';
import ReactDOM from 'react-dom';
import PulldownTip from '../widgets/pulldown_tip';
import Loading from '../widgets/loading';
import {decDatetime,decLocSearch} from '../util';

import es6 from "es6-promise";
es6.polyfill();
import 'whatwg-fetch';
global.jsj_static_path="/mobile/jsj";
global.jsj_api_path="/jsj";
let Detail=React.createClass({
    getInitialState(){
        return {detail:null};
    },
    componentWillMount(){
        document.title="行程详情";
        document.getElementById("appContainer").style.backgroundColor="#fff";
        let detail = sessionStorage.getItem("TravelDetailInfo");
        detail=JSON.parse(detail)||{};
        this.setState({detail});
    },

    componentWillMount(){
        let {serialnumber}=decLocSearch(location.search);
        sessionStorage.setItem("OrderSerialNumber",serialnumber);
        let detail = sessionStorage.getItem("TravelDetailInfo");
        if(!this.state.detail) return 0;
        /**
         * 显示加载中
         */
        let dom=document.getElementById("dialog");
        ReactDOM.render(<Loading />,dom);
        dom.style.display="block";

        let url=jsj_api_path+"/user/detail";
        url+="?serialnumber="+serialnumber;
        console.log("获取订单详情url",url);
        fetch(url).then(function(res){
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
    render(){
        let d = this.state.detail||{};
        let flag=d.ordertype;
        let {year,month,day,hour,minute}=decDatetime(d.bookingtime);
        let {year:y1,month:mon1,day:d1,hour:h1,minute:min1}=decDatetime(d.createtime);
        let f=d.flightinfo||{};
        return(
            <div className="travel-detail">
                <ul className="travel-order-detail">
                    <li>成功支付</li>
                    <li>&yen;{parseFloat(d.totalfee||0).toFixed(2)}</li>
                    <li>
                        <p>费用总计</p>
                        <p>&yen;{parseFloat(d.totalfee||0).toFixed(2)}</p>
                    </li>
                    <li>订单信息</li>
                    <li>{+flag==1?'接机':'送机'}</li>
                    <li>
                        <p>航班号</p>
                        <p>{(f.flightnumber||'').toUpperCase()}</p>
                    </li>
                    <li>
                        <p>用车时间</p>
                        <p>{year}-{month}-{day} {hour}:{minute}</p>
                    </li>
                    <li>
                        {+flag==1?(<p>出发机场</p>):(<p>出发地址</p>)}
                        <p>{d.startaddress||''}</p>
                    </li>
                    <li>
                        {+flag==1?(<p>送达地址</p>):(<p>送达机场</p>)}
                        <p>{d.endaddress||''}</p>
                    </li>
                    <li>
                        <p>行程备注</p>
                        <p>{d.userremark||''}</p>
                    </li>
                    <li>
                        <p>联系人</p>
                        <p>{d.actualname||''} {d.actualphone||''}</p>
                    </li>
                    <li>
                        <p>下单时间</p>
                        <p>{y1}-{mon1}-{d1} {h1}:{min1}</p>
                    </li>
                </ul>
            </div>
        );
    }
});

ReactDOM.render(<Detail /> , document.getElementById("appContainer"));