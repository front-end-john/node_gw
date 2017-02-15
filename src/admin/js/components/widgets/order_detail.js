import React from 'react';
import ReactDOM from 'react-dom';
import TakeCar from '../order_process/take_car';
import MoveCar from '../order_process/move_car';
import InGarage from '../order_process/in_garage';
import SendCar from '../order_process/send_car';
import Evaluation from '../order_process/evaluation';
import Pay from '../order_process/pay';
import WarnTip from '../dialog/warn_tip';
import Label from "../dialog/customer_label";
import EditUser from "../dialog/edit_user_info";
import AddRemark from '../dialog/add_remark';
import EditCar from "../dialog/modify_car_info";
import EditBook from "../dialog/modify_bookingtime";
import EditFlightInfo from "../dialog/operate_flight_info";
import PredictTime from "../dialog/predict_getcar_time";
import {getStateInfo,getFormatDate} from '../../util'

let OrderDetail=React.createClass({
    getInitialState(){
        return{
            p_item:'p1',first:true,
            blocks:[]
        };
    },
    showWarnTip(msg){
        let mask=document.getElementById("dialogContainer");
        ReactDOM.render(<WarnTip msg={msg}/>, mask);
    },
    loadOrderDetail(){
        let url="/admin/api/orders/orderdetails?serialnumber="+this.props.number;
        fetch(url).then((res)=>{
            console.log("查询订单详情响应状态："+res.status);
            if(+res.status < 400){
                return res.text();
            }else {
                throw new Error("服务异常");
            }
        }).then((str)=>{
            let obj=JSON.parse(str);
            if(obj.code==0){
                this.setState({orderDetail:obj.order});
            }else {
                this.showWarnTip(obj.msg);
            }
        }).catch((e)=>{
            this.showWarnTip("网络请求异常！");
            console.trace('错误:', e);
        });
    },
    componentWillMount(){
        this.loadOrderDetail();
    },

    addRemark(){
        let mask=document.getElementById("dialogContainer");
        ReactDOM.render(<AddRemark reload={this.loadOrderDetail} type="jsonp"
                                   url="/admin/api/orders/remark.js" number={this.props.number}/>, mask);
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
    editFlightInfo(type,fno,fdate){
        let mask=document.getElementById("dialogContainer");
        ReactDOM.render(< EditFlightInfo  type={type} url="/admin/api/orders/edit_returning_info"
                                          number={this.props.number} fno={fno} fdate={fdate}
                                          reload={this.loadOrderDetail}  />, mask);
    },
    editPredictGetCarTime(type,time){
        let mask=document.getElementById("dialogContainer");
        ReactDOM.render(< PredictTime  type={type} url="/admin/api/orders/edit_returning_info"
                                          number={this.props.number} time={time}
                                          reload={this.loadOrderDetail}  />, mask);
    },
    handleSwitch(e){
        if(e.target.nodeName==="LI"){
            if (e.target.id == "pro_1") {
                this.setState({p_item:'p1'});
                ReactDOM.render(<TakeCar /> , this.process);
            } else if (e.target.id == "pro_2") {
                this.setState({p_item:'p2'});
                ReactDOM.render(<MoveCar /> , this.process);
            } else if (e.target.id == "pro_3") {
                this.setState({p_item:'p3'});
                ReactDOM.render(<InGarage /> , this.process);
            } else if (e.target.id == "pro_4") {
                this.setState({p_item:'p4'});
                ReactDOM.render(<SendCar /> , this.process);
            } else if (e.target.id == "pro_5") {
                this.setState({p_item:'p5'});
                ReactDOM.render(<Pay /> , this.process);
            } else if (e.target.id == "pro_6") {
                this.setState({p_item:'p6'});
                ReactDOM.render(<Evaluation /> , this.process);
            }
        }
    },
    componentDidMount(){
        ReactDOM.render(<TakeCar /> , this.process);
        this.adjustWidth();
        window.addEventListener("resize",this.adjustWidth,false);
    },
    componentWillUnmount(){
        window.removeEventListener("resize",this.adjustWidth);
    },
    adjustWidth(){
        let sumWidth=document.body.clientWidth-260;
        //console.log("sumWidth",sumWidth);
        let bs=this.state.blocks;

        if(this.state.first){
            sumWidth=this.props.width;
            this.setState({first:false});
        }
        let helArr=[],ws=[300,300,300,494];
        let edgeValue=1400;
        if(sumWidth>edgeValue){
            let incre=(sumWidth-edgeValue)/4;
            for(let i=0;i<4;i++) {
                ws[i]+=incre;
                let block=bs[i];
                block.style.width=ws[i]+'px';
                if (i == 0) this.userTag.style.width= ws[i]-101+'px';
                helArr[i] = parseFloat(getComputedStyle(block).height);
            }
        }
        let maxHel=helArr.sort()[3];
        for(let i=0;i<4;i++) {
            bs[i].style.height = maxHel + "px";
        }
    },
    render(){
        let o=this.state.orderDetail||{};
        let user=o.user||{};
        let car=o.car||{};
        let moreService=o.serviceorders||[];
        let driverNote=o.drivernote||[];

        let level=[],driverRemark,washCar="";
        for(let i=0;i<user.stars;i++){
            level[i]=(<span key={i} style={{color:'red'}}>&#9733;</span>)
        }
        if(moreService.length==1){
            washCar=moreService[0].config.rainwashing=="1"?"下雨也洗车":"";
        }
        let serviceRemark=(o.remark||[]).map((item,index)=>{
            return (<p key={index}>{item.time}&emsp;{item.admin_name}&emsp;{item.remark}</p>);
        });
        driverRemark=driverNote.map((item,index)=>{
            return (<p key={index}>{item.time}&ensp;
                <span style={{color:'yellow'}}>{item.driver_name}:&ensp;</span>{item.remark}</p>);
        });
        this.tags=user.tags||[];
        this.serialnumber=o.serialnumber;
        let userTags=(user.tags||[]).map((item,index)=>{
            return(<span key={index} style={{color:"#323232"}}>{item}&ensp;</span>)
        });
        let states=getStateInfo(o.status);
        return(
            <section className="detail-section">
                <p className="order-brief">
                    <label style={{paddingLeft:'20px'}}>订单号：</label><span>{o.serialnumber||''}</span>
                    <label style={{paddingLeft:'20px'}}>下单时间：</label><span>{o.createtime||''}</span>
                    <label style={{paddingLeft:'20px'}}>来源：</label><span>{o.comefrom||''}</span>
                    <label style={{paddingLeft:'20px'}}>状态：</label>
                    <span style={{color:states[1]}}>{states[0]}</span>
                </p>
                <div className="order-main">
                    <div className="user-info" ref={(c)=>this.state.blocks[0]=c} >
                        <h2>用户信息</h2>
                        <figure className="user-basic">
                            <img src={user.avatar||"/admin/img/userheadimg.png"}/>
                            <figcaption>
                                <p>姓名：<span style={{color:"#1AA0E5",cursor:"pointer"}}
                                             onClick={()=>this.editUserInfo()}>{user.realname||''}</span></p>
                                <p>性别：<span>{user.sex==1?"男":"女"}</span></p>
                                <p>手机：<span>{user.phoneno||''}</span></p>
                            </figcaption>
                        </figure>
                        <div className="user-other">
                            <p><label>重要等级：</label>{level}</p>
                            <p><label>使用次数：</label><span>{user.bookcount||''}</span></p>
                            <p><label>用户来源：</label><span>{user.comefrom||''}</span></p>
                            <p><label>注册时间：</label>
                                <span>{getFormatDate("yyyy-mm-dd hh:ii",user.registertime)}</span></p>
                            <p><label>标&emsp;&emsp;签：</label><em ref={(c)=>this.userTag=c}>{userTags}
                                <span style={{color:"#1AA0E5",cursor:"pointer"}}
                                      onClick={()=>this.addLabel(user.userid)}>{userTags.length>0?"编辑":"添加"}</span></em></p>
                            <p className="note-field"><label>备&emsp;&emsp;注：</label>
                                <span>{user.remark||''}</span></p>
                        </div>
                    </div>
                    <div className="order-info" ref={(c)=>this.state.blocks[1]=c}>
                        <h2>预约信息</h2>
                        <div className="up-section">
                            <p><label>车辆信息：</label>
                                <span style={{color:"#1AA0E5",cursor:"pointer"}}
                                      onClick={()=>this.editCarInfo(car)}>
                                    {(car.carno||"")+" "+(car.color||"")+" "+(car.brand||"")}</span></p>
                            <p><label>预约接车时间：</label>
                                <span style={{color:"#1AA0E5",cursor:"pointer"}}
                                      onClick={()=>this.editBookingTime(o.serialnumber,o.bookingtime)}>
                                    {o.bookingtime||""}</span></p>
                            <p><label>去程航站楼：</label>
                                <span>{o.parkingterminalname||""}</span></p>
                        </div>
                        <div className="down-section">
                            <p><label>用户更新时间：</label>
                                <span>{getFormatDate("yyyy-mm-dd hh:ii",user.updatetime)}</span></p>
                            <p className="back-flight">
                                <label>返程航班：</label>
                                {o.returningflight?(<span style={{color:"#1AA0E5",cursor:"pointer"}}
                                    onClick={()=>this.editFlightInfo("mod",o.returningflight,o.returningdate)}>
                                    {(o.returningflight||"")+" "+(o.returningdate||"")}</span>):
                                    (<span style={{color:"#1AA0E5",cursor:"pointer"}}
                                           onClick={()=>this.editFlightInfo("add",o.returningflight,o.returningdate)}>添加</span>)}

                               {/* <img src="/admin/img/icon/10_1.png" />*/}
                            </p>
                            <p><label>预计取车时间：</label>
                                {o.returningtime?(<span style={{color:"#1AA0E5",cursor:"pointer"}}
                                                          onClick={()=>this.editPredictGetCarTime("mod",o.returningtime)}>
                                        {o.returningtime||""}</span>):
                                    (<span style={{color:"#1AA0E5",cursor:"pointer"}}
                                           onClick={()=>this.editPredictGetCarTime("add",o.returningtime)}>添加</span>)}</p>
                            <p><label>回程航站楼：</label><span>{o.returningterminalname||""}</span></p>
                            <p className="note-field"><label>渠道备注：</label>
                                <span>{""}</span></p>
                        </div>
                    </div>
                    <div className="service-info" ref={(c)=>this.state.blocks[2]=c}>
                        <h2>更多服务</h2>
                        <div className="extra-service">
                            <p><label>洗车：</label><span>{washCar}</span>
                                <em>取消</em><em>编辑</em>
                            </p>

                            <p style={{marginBottom:'62px'}}><label>加油：</label><span>无</span>
                                <em>添加</em>
                            </p>
                        </div>
                        <p className="note-field"><label>用户备注：</label><span>{o.userremark||""}</span></p>
                    </div>
                    <div className="process-info" ref={(c)=>this.state.blocks[3]=c} >
                        <ul onClick={this.handleSwitch}>
                            <li className={this.state.p_item=='p1'?"show-item":''} id="pro_1" >接车</li>
                            <li id="pro_2" className={this.state.p_item=='p2'?"show-item":''} >挪车</li>
                            <li id="pro_3" className={this.state.p_item=='p3'?"show-item":''} >在库</li>
                            <li id="pro_4" className={this.state.p_item=='p4'?"show-item":''} >送车</li>
                            <li id="pro_5" className={this.state.p_item=='p5'?"show-item":''} >支付</li>
                            <li id="pro_6" className={this.state.p_item=='p6'?"show-item":''} >评价</li>
                        </ul>
                        <div ref={(c)=>this.process=c} className="process-area" />
                    </div>
                    <div className="service-note">
                        <p>客服备注：<img src="/admin/img/icon/13_1.png" onClick={this.addRemark}
                                     style={{color:"#1AA0E5",cursor:"pointer"}} /></p>
                        {serviceRemark}
                    </div>
                    <div className="driver-note">
                        <p>司机备注：</p>
                        {driverRemark}
                    </div>
                </div>
            </section>
        );
    }
});

export default OrderDetail;