import React from 'react';
import ReactDOM from 'react-dom';
import ModPasswd from './dialog/modify_password';
import Ensure from './dialog/ensure';
import {maxNumber} from '../util';
import PrimaryItem from './widgets/nav_item';

let Aside = React.createClass({
    getInitialState(){
        return {
            currItem:"order_query",
            secondItem:"",
            jsjCount:{}
        };
    },
    componentWillMount(){
        let url="/jsj/system/runningordernumber";
        fetch(url).then(function(res){
            console.log("查询订单列表响应状态："+res.status);
            if(+res.status < 400){
                return res.text();
            }else{
                throw new Error("服务异常");
            }
        }).then((str)=>{
            let obj=JSON.parse(str);
            this.setState({jsjCount:obj.record||{}});
        }).catch(function(e){
            console.trace('错误:', e);
        });
    },
    handlePasswordModify(){
        let mask=document.getElementById("dialogContainer");
        ReactDOM.render(<ModPasswd />, mask);
    },
    handleLogout(){
        let mask=document.getElementById("dialogContainer");
        ReactDOM.render(<Ensure title="退出系统" content="确认退出系统吗？" option="logout" />, mask);
    },
    adaptHeight(){
        let appHel=getComputedStyle(document.getElementsByClassName("app")[0]).height;
        appHel=parseFloat(appHel)+20;
        let sHel=document.body.clientHeight;
        this.nav.style.height=maxNumber(appHel,sHel,860)+"px";
    },
    componentDidMount(){
        let hash=location.hash;
        hash=hash.substr(2).split("?");
        this.setState({currItem:hash[0]});
        if(hash[1]){
            this.setState({secondItem:hash[1].replace("flag=","jsj_order_")});
        }else {
            if(hash[0]=="remain_contact_order"){
                this.setState({currItem:"order_manager",secondItem:"order_manager_1"});
            }else if(hash[0]=="remain_assign_take_order"){
                this.setState({currItem:"order_manager",secondItem:"order_manager_2"});
            }else if(hash[0]=="ongoing_take_order"){
                this.setState({currItem:"order_manager",secondItem:"order_manager_3"});
            }else if(hash[0]=="airport_temp_park"){
                this.setState({currItem:"order_manager",secondItem:"order_manager_4"});
            }else if(hash[0]=="in_garage_car"){
                this.setState({currItem:"order_manager",secondItem:"order_manager_5"});
            }else if(hash[0]=="remain_assign_send_order"){
                this.setState({currItem:"order_manager",secondItem:"order_manager_6"});
            }else if(hash[0]=="ongoing_send_order"){
                this.setState({currItem:"order_manager",secondItem:"order_manager_7"});
            }else if(hash[0]=="user_manager"){
                this.setState({currItem:"user_manager",secondItem:""});
            }else if(hash[0]=="evaluation_manage"){
                this.setState({currItem:"comment_manager",secondItem:""});
            }else if(hash[0]=="coupon_manage"){
                this.setState({currItem:"coupon_manager",secondItem:""});
            }else if(hash[0]=="order_query"){
                this.setState({currItem:"order_query",secondItem:""});
            }
        }
        this.adaptHeight();
        window.addEventListener("resize",this.adaptHeight,false);
    },
    componentWillUnmount(){
        window.removeEventListener("resize",this.adaptHeight);
    },
    handClick(id){
        if(id==="order_query"){
            location.href="#/order_query";
            this.setState({secondItem:"",currItem:id});
        }else if(id==="order_manager"){

        }else if(id==="jsj_order"){

        }else if(id==="user_manager"){
            location.href="#/user_manager";
            this.setState({secondItem:"",currItem:id});
        }else if(id==="comment_manager"){
            location.href="#/evaluation_manage";
            this.setState({secondItem:"",currItem:id});
        }else if(id==="coupon_manager"){
            location.href="#/coupon_manage";
            this.setState({secondItem:"",currItem:id});
        }
    },
    handleSecondClick(id){
        this.setState({secondItem:id});
        if(/order_manager/.test(id)){
            this.setState({currItem:"order_manager"});
            if(id=="order_manager_1"){
                location.href="#/remain_contact_order";
            }else if(id=="order_manager_2"){
                location.href="#/remain_assign_take_order";
            }else if(id=="order_manager_3"){
                location.href="#/ongoing_take_order";
            }else if(id=="order_manager_4"){
                location.href="#/airport_temp_park";
            }else if(id=="order_manager_5"){
                location.href="#/in_garage_car";
            }else if(id=="order_manager_6"){
                location.href="#/remain_assign_send_order";
            }else if(id=="order_manager_7"){
                location.href="#/ongoing_send_order";
            }
        }else if(/jsj_order/.test(id)){
            this.setState({currItem:"jsj_order"});
            if(id=="jsj_order_1"){
                location.href="#/jsj_order?flag=1";
            }else if(id=="jsj_order_2"){
                location.href="#/jsj_order?flag=2";
            }
        }
    },
    render(){
        let jsjCount=this.state.jsjCount;
        let orderManager=[{name:'待联系订单',newCount:15}, {name:'待分配接车单',newCount:15},
            {name:'进行中的接车订单',newCount:115},{name:'机场临时停放',newCount:15},
            {name:'在库车辆',newCount:15},{name:'待分配送车单',newCount:15},
            {name:'进行中的送车单',newCount:115}];
        let jsjOrder=[{name:'接机订单',newCount:jsjCount.pickupnumber||0},
            {name:'送机订单',newCount:jsjCount.pickoffnumber||0}];
        return(
            <aside ref={(c)=>this.nav=c}>
                <div id="manager">
                    <div><img src="/duck/img/managerimg.png" /></div>
                    <div>
                        <p>客服人员</p>
                        <section onClick={()=>{
                            let dom=this.refs.sysOpt,h=dom.style.height;
                            h=='80px'?dom.style.height=0:dom.style.height='80px';
                        }}>
                            系统管理员<img className="arrow" src="/duck/img/icon/07.png"/>
                            <ul ref='sysOpt'>
                                <li onClick={this.handlePasswordModify}>修改密码</li>
                                <li onClick={this.handleLogout}>退出系统</li>
                            </ul>
                        </section>
                    </div>
                </div>
                <PrimaryItem  id='order_query' itemName="订单查询" currItem={this.state.currItem}
                              click={this.handClick}/>

                <PrimaryItem id='order_manager' childItems={orderManager} itemName="订单管理"
                             secondItem={this.state.secondItem} currItem={this.state.currItem}
                             click={this.handClick}
                             secondClick={this.handleSecondClick}
                             prefix="order_manager_"/>
                <PrimaryItem id='jsj_order' itemName="接送机订单"
                             childItems={jsjOrder}
                             currItem={this.state.currItem}
                             secondItem={this.state.secondItem}
                             click={this.handClick}
                             secondClick={this.handleSecondClick} prefix="jsj_order_" />
                <PrimaryItem id='user_manager' itemName="用户管理" currItem={this.state.currItem}
                             click={this.handClick} />
                <PrimaryItem id='comment_manager' itemName="评价管理" currItem={this.state.currItem}
                             click={this.handClick} />
                <PrimaryItem id='coupon_manager' itemName="优惠券管理" currItem={this.state.currItem}
                             click={this.handClick} />
            </aside>
        );
    }
});

export default Aside;