import React from 'react';
import ReactDOM from 'react-dom';
import PulldownTip from '../widgets/pulldown_tip';
import Loading from '../widgets/loading';
import Star from '../widgets/star'
import {decLocSearch} from '../util';

import queryStr from 'querystring';
import es6 from "es6-promise";
es6.polyfill();
import 'whatwg-fetch';
global.jsj_static_path="/mobile/jsj";
global.jsj_api_path="/jsj";

let Comment=React.createClass({

    getInitialState(){
        return{starCount:5};
    },
    componentWillMount(){
        document.getElementById("appContainer").style.backgroundColor="#fff";
        let td=sessionStorage.getItem("TravelDetailInfo");
        td=JSON.parse(td);
        this.setState({detail:td});

    },
    componentWillMount(){
        let {serialnumber}=decLocSearch(location.search);
        sessionStorage.setItem("OrderSerialNumber",serialnumber);
        let dom=document.getElementById("dialog");
        if(!this.state.detail){
            /**
             * 显示加载中
             */
            ReactDOM.render(<Loading />,dom);
            dom.style.display="block";
        }
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
    handleClickStar(e){
        let grade=e.target.id;
        this.refs.starTip.style.marginRight=(5-grade)*50+'px';
        this.setState({starCount:grade});
        if(grade==1){
            this.refs.starTip.innerHTML="糟糕";
        }else if(grade==2){
            this.refs.starTip.innerHTML="差";
            this.refs.starTip.style.marginRight=((5-grade)*50+12)+'px';
        }else if(grade==3){
            this.refs.starTip.innerHTML="一般";
        }else if(grade==4){
            this.refs.starTip.innerHTML="还行";
        }else if(grade==5){
            this.refs.starTip.innerHTML="满意";
        }
    },
    handleCommentCommit(){
        let dom=document.getElementById("dialog");
        let content=this.refs.comment.value;
        let score=this.state.starCount;
        let serialnumber = sessionStorage.getItem("OrderSerialNumber");
        let url=jsj_api_path+"/user/comment";
        url+="?"+queryStr.stringify({serialnumber,score,content});
        fetch(url,{credentials:'include'}).then(function(res){
            console.log("订单评价响应状态：",res.status);
            if(+res.status < 400){
                return res.text();
            }else {
                throw new Error("服务异常");
            }
        }).then((str)=>{
            let obj=JSON.parse(str);
            console.log(obj);
            if(obj.code==0){
                location.href="/mobile/jsj/order_status?flag=5&score="+score;
            }else {
                ReactDOM.render(<PulldownTip msg={obj.message} />,dom);
            }
        }).catch(function(e) {
            console.warn('错误', e);
        });
    },
    render(){
        let dt=this.state.detail||{};
        let driver=dt.driverinfo||{};
        return(
            <div className="comments-us">
                <p>您的评价对我们改进服务至关重要</p>
                <ul className="driver-info">
                    <li><img src={driver.avatar||jsj_static_path+"/img/11.png"}/></li>
                    <li>
                        <h2>{driver.realname}&ensp;{driver.carno}</h2>
                        <p>{driver.carbrand}</p>
                    </li>
                    <li><Star starCount={this.state.starCount}
                              starOnUrl={jsj_static_path+"/img/bigStar-on.png"}
                              starOffUrl={jsj_static_path+"/img/bigStar-off.png"}
                              commentStar={this.handleClickStar} /><p ref="starTip"/>
                    </li>
                </ul>
                <textarea placeholder="把您的体验或建议告诉我们吧!(匿名内容，可放心填写)" ref="comment"/>
                <button className="query-btn" onClick={this.handleCommentCommit}>提价评价</button>
            </div>
        );
    },
    componentWillUnmount(){
        let dom=document.getElementById("dialog");
        dom.style.display="none";
    }
});

ReactDOM.render(<Comment /> , document.getElementById("appContainer"));