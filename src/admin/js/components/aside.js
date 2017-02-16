import React from 'react';
import {maxNumber} from '../util';
let PrimaryItem = React.createClass({
    render(){
        let items=this.props.childItems,childLevel=null;
        if(items){
            let list = items.map((item, index) => {
                let id = this.props.prefix + (index + 1);
                return (
                    <li id={id} key={index} onClick={()=>this.props.secondClick(id)}
                        className={this.props.secondItem == id?"highlight" : ""}>
                        {item.name} <span>{item.newCount}</span></li>
                );
            });
            childLevel = (<ul className="primary-list">
                                {list}
                            </ul>);
        }
        return (
            <section className="primary-item">
                <h2  onClick={(e)=> this.props.click(this.props.id)}
                className={this.props.id==this.props.currItem?"selected":""}>
                    <em className="item-icon" />
                    {this.props.itemName}</h2>
                  {childLevel}
            </section>
        );
    }
});

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
            //console.log("jsj订单数量：",obj);
            this.setState({jsjCount:obj.record||{}});
        }).catch(function(e) {
            console.trace('错误:', e);
        });
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
            }
        }
        this.adaptHeight();
        window.addEventListener("resize",this.adaptHeight,false);
    },
    componentWillUnmount(){
        window.removeEventListener("resize",this.adaptHeight);
    },
    handClick(id){
        this.setState({currItem:id});
        if(id==="order_query"){
            location.href="#/order_query";
            this.setState({secondItem:""});
        }else if(id==="order_manager"){

        }else if(id==="jsj_order"){

        }else if(id==="user_manager"){
            location.href="#/user_manager";
            this.setState({secondItem:""});
        }else if(id==="comment_manager"){
            location.href="#/evaluation_manage";
            this.setState({secondItem:""});
        }else if(id==="coupon_manager"){
            location.href="#/coupon_manage";
            this.setState({secondItem:""});
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
                    <div><img src="/admin/img/managerimg.png" /></div>
                    <div>
                        <p>客服人员</p>
                        <section onClick={()=>{
                            let dom=this.refs.sysOpt,h=dom.style.height;
                            h=='80px'?dom.style.height=0:dom.style.height='80px';
                        }}>
                            系统管理员<img className="arrow" src="/admin/img/icon/07.png"/>
                            <ul ref='sysOpt'>
                                <li>修改密码</li>
                                <li>退出系统</li>
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