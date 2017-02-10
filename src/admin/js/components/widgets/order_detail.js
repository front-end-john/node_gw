import React from 'react';
import ReactDOM from 'react-dom';
import TakeCar from '../order_process/take_car';
import MoveCar from '../order_process/move_car';
import InGarage from '../order_process/in_garage';
import SendCar from '../order_process/send_car';
import Evaluation from '../order_process/evaluation';
import WarnTip from '../dialog/warn_tip';
import Label from "../dialog/customer_label";
import EditUser from "../dialog/edit_user_info";
import AddRemark from '../dialog/add_remark';
import EditCar from "../dialog/modify_car_info";
import EditBook from "../dialog/modify_bookingtime";
import {getStateMsg,getFormatDate} from '../../util'

let OrderDetail=React.createClass({
    getInitialState(){
        return{p_item:'p1'};
    },
    showWarnTip(msg){
        let mask=document.getElementById("dialogContainer");
        ReactDOM.render(<WarnTip msg={msg}/>, mask);
    },
    loadOrderDetail(){
        let url="/admin/api/orders/orderdetails?serialnumber="+this.props.number;
        fetch(url).then(function(res){
            console.log("查询订单详情响应状态："+res.status);
            if(+res.status < 400){
                return res.text();
            }else {
                throw new Error("服务异常");
            }
        }).then((str)=>{
            try{
                let obj=JSON.parse(str);
                this.setState({orderDetail:obj.order});
            }catch(e){
                this.showWarnTip("数据格式异常！");
            }
        }).catch(function(e) {
            this.showWarnTip("网络请求异常！");
            console.trace('错误:', e);
        });
    },
    componentWillMount(){
        this.loadOrderDetail();
    },
    componentDidMount(){
        ReactDOM.render(<TakeCar /> , this.refs.processInfo);
    },
    addRemark(){
        let mask=document.getElementById("dialogContainer");
        ReactDOM.render(<AddRemark reload={this.loadOrderDetail}
                                   url="/jsj/system/addremark" number={this.props.number}/>, mask);
    },
    editUserInfo(){
        let o=this.state.orderDetail||{};
        let user=o.user||{};
        let mask=document.getElementById("dialogContainer");
        ReactDOM.render(<EditUser name={user.username} gender={user.sex} stars={user.stars}
                                  remark={user.remark} tel={user.phoneno}
                                  url="/admin/api/users/edit" reload={this.loadOrderDetail} />, mask);
    },
    editCarInfo(car){
        let mask=document.getElementById("dialogContainer");
        ReactDOM.render(<EditCar cid={car.carid} carno={car.carno} color={car.color} brand={car.brand}
                                  url="/admin/api/cars/edit_car_info" reload={this.loadOrderDetail} />, mask);
    },
    editBookingTime(id,time){
        let mask=document.getElementById("dialogContainer");
        ReactDOM.render(<EditBook oid={id} bookingtime={time}
                                  reload={this.loadOrderDetail} />, mask);
    },
    addLabel(id){
        let mask=document.getElementById("dialogContainer");
        ReactDOM.render(<Label tags={this.tags} url="/admin/api/users/marking"
                               reload={this.loadOrderDetail} uid={id}/>, mask);
    },
    handleSwitch(e){
        if(e.target.nodeName==="LI"){
            if (e.target.id == "pro_1") {
                this.setState({p_item:'p1'});
                ReactDOM.render(<TakeCar /> , this.refs.processInfo);
            } else if (e.target.id == "pro_2") {
                this.setState({p_item:'p2'});
                ReactDOM.render(<MoveCar /> , this.refs.processInfo);
            } else if (e.target.id == "pro_3") {
                this.setState({p_item:'p3'});
                ReactDOM.render(<InGarage /> , this.refs.processInfo);
            } else if (e.target.id == "pro_4") {
                this.setState({p_item:'p4'});
                ReactDOM.render(<SendCar /> , this.refs.processInfo);
            } else if (e.target.id == "pro_5") {
                this.setState({p_item:'p5'});
            } else if (e.target.id == "pro_6") {
                this.setState({p_item:'p6'});
                ReactDOM.render(<Evaluation /> , this.refs.processInfo);
            }
        }
    },
    render(){
        let o=this.state.orderDetail||{};
        let user=o.user||{};
        let car=o.car||{};
        let moreService=o.serviceorders||[];
        let driverNote=o.drivernote||[];
        let level=[],serviceRemark,driverRemark,washCar="";
        for(let i=0;i<user.stars;i++){
            level[i]=(<span key={i} style={{color:'red'}}>&#9733;</span>)
        }
        if(moreService.length==1){
            serviceRemark=moreService[0].serviceremark.map((item,index)=>{
                return (<p key={index}>{item}</p>);
            });
            washCar=moreService[0].config.rainwashing=="1"?"下雨也洗车":"";

        }
        driverRemark=driverNote.map((item,index)=>{
            return (<p key={index}>{item.time}&ensp;
                <span style={{color:'yellow'}}>{item.driver_name}:&ensp;</span>{item.remark}</p>);
        });
        this.tags=user.tags||[];
        let userTags=(user.tags||[]).map((item,index)=>{
            return(<span key={index}>{item}&ensp;</span>)
        });
        return(
            <section className="detail-section">
                <p className="order-brief">
                    <label style={{paddingLeft:'20px'}}>订单号: </label><span>{o.serialnumber||''}</span>
                    <label style={{paddingLeft:'20px'}}>下单时间: </label><span>{o.createtime||''}</span>
                    <label style={{paddingLeft:'20px'}}>来源: </label><span>{o.comefrom||''}</span>
                    <label style={{paddingLeft:'20px'}}>状态: </label>
                    <span style={{color:'red'}}>{getStateMsg(o.status)||""}</span>
                </p>
                <div className="order-main">
                    <div className="user-info">
                        <h2>用户信息</h2>
                        <figure className="user-basic">
                            <img src={user.avatar||"/admin/img/userheadimg.png"}/>
                            <figcaption>
                                <p>姓名: <span style={{color:"#1AA0E5",cursor:"pointer"}}
                                             onClick={()=>this.editUserInfo()}>{user.realname||''}</span></p>
                                <p>性别: <span>{user.sex==1?"男":"女"}</span></p>
                                <p>手机: <span>{user.phoneno||''}</span></p>
                            </figcaption>
                        </figure>
                        <div className="user-other">
                            <p><label>重要等级:</label>{level}</p>
                            <p><label>使用次数:</label><span>{user.bookcount||''}</span></p>
                            <p><label>用户来源:</label><span>{user.comefrom||''}</span></p>
                            <p><label>注册时间:</label>
                                <span>{getFormatDate("yyyy-mm-dd hh:ii",user.registertime)}</span></p>
                            <p><label>标&emsp;&emsp;签:</label><em style={{width:"230px"}}>{userTags}
                                <span style={{color:"#1AA0E5",cursor:"pointer"}}
                                      onClick={()=>this.addLabel(user.userid)}>添加</span></em></p>
                            <p className="note-field"><label>备&emsp;&emsp;注: </label>
                                <span>{user.remark||''}</span></p>
                        </div>
                    </div>
                    <div className="order-info">
                        <h2>预约信息</h2>
                        <div className="up-section">
                            <p><label>车辆信息:&ensp;</label>
                                <span style={{color:"#1AA0E5",cursor:"pointer"}}
                                      onClick={()=>this.editCarInfo(car)}>
                                    {(car.carno||"")+" "+(car.color||"")+" "+(car.brand||"")}</span></p>
                            <p><label>预约接车时间:&ensp;</label>
                                <span style={{color:"#1AA0E5",cursor:"pointer"}}
                                      onClick={()=>this.editBookingTime(o.serialnumber,o.bookingtime)}>
                                    {o.bookingtime||""}</span></p>
                            <p><label>去程航站楼:&ensp;</label>
                                <span>{o.parkingterminalname||""}</span></p>
                        </div>
                        <div className="down-section">
                            <p><label>用户更新时间:&ensp;</label>
                                <span>{getFormatDate("yyyy-mm-dd hh:ii",user.updatetime)}</span></p>
                            <p className="back-flight">
                                <label>返程航班:&ensp;</label>
                                <span style={{color:"#1AA0E5"}}>
                                    {(o.returningflight||"")+" "+(o.returningdate||"")}</span>
                                <img src="/admin/img/icon/10_1.png" />
                            </p>
                            <p><label>预计取车时间:&ensp;</label>
                                <span style={{color:"#1AA0E5"}}>{o.returningtime||""}</span></p>
                            <p><label>回程航站楼:&ensp;</label><span>{o.returningterminalname||""}</span></p>
                            <p className="note-field"><label>渠道备注:</label>
                                <span>{o.remark||""}</span></p>
                        </div>
                    </div>
                    <div className="service-info">
                        <h2>更多服务</h2>
                        <div className="extra-service">
                            <p><label>洗车:</label><span>{washCar}</span>
                                <em>取消</em><em>编辑</em>
                            </p>
                            <p style={{marginBottom:'62px'}}><label>加油:</label><span>无</span>
                                <em>添加</em>
                            </p>
                        </div>
                        <p className="note-field"><label>用户备注:</label><span>{o.userremark||""}</span></p>
                    </div>
                    <div className="process-info" >
                        <ul onClick={this.handleSwitch}>
                            <li className={this.state.p_item=='p1'?"show-item":''} id="pro_1" >接车</li>
                            <li id="pro_2" className={this.state.p_item=='p2'?"show-item":''} >挪车</li>
                            <li id="pro_3" className={this.state.p_item=='p3'?"show-item":''} >在库</li>
                            <li id="pro_4" className={this.state.p_item=='p4'?"show-item":''} >送车</li>
                            <li id="pro_5" className={this.state.p_item=='p5'?"show-item":''} >支付</li>
                            <li id="pro_6" className={this.state.p_item=='p6'?"show-item":''} >评价</li>
                        </ul>
                        <div ref="processInfo" />
                    </div>
                    <div className="service-note">
                        <p>客服备注:<img src="/admin/img/icon/13_1.png" onClick={this.addRemark}
                                     style={{color:"#1AA0E5",cursor:"pointer"}} /></p>
                        {serviceRemark}
                    </div>
                    <div className="driver-note">
                        <p>司机备注:</p>
                        {driverRemark}
                    </div>
                </div>
            </section>
        );
    }
});

export default OrderDetail;