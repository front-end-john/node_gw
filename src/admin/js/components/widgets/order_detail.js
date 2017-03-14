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
import WashService from "../dialog/wash_service";
import OilService from "../dialog/oil_service";
import SendMsg from "../dialog/send_message";
import ServiceEnsure from "../dialog/more_service_ensure";
import Ensure from "../dialog/ensure";
import {getStateInfo,getFormatDate,optState} from '../../util'

export default React.createClass({
    getInitialState(){
        return{first:true, blocks:[],orderDetail:{}};
    },
    showWarnTip(msg){
        let mask=document.getElementById("dialogContainer");
        if(msg===null){
            ReactDOM.render(<i/>, mask);
            mask.style.display="none";
        }else {
            ReactDOM.render(<WarnTip msg={msg}/>, mask);
        }
    },
    loadOrderDetail(){
        let url="/admin/api/orders/orderdetails?serialnumber="+this.props.number;
        console.log("订单详情url",url);
        fetch(url,{credentials: 'include'}).then((res)=>{
            console.log("订单详情响应："+res.status);
            if(+res.status < 400){
                return res.text();
            }else {
                throw new Error("服务异常");
            }
        }).then((str)=>{
            let obj=JSON.parse(str);
            //console.dir(obj.order);
            if(obj.code==0){
                this.setState({orderDetail:obj.order});
            }else {
                this.showWarnTip(obj.msg);
            }
        }).catch((e)=>{
            this.showWarnTip("请求异常！");
            console.trace('错误:', e);
        });
    },
    componentWillMount(){
        this.loadOrderDetail();
    },

    addRemark(){
        let mask=document.getElementById("dialogContainer");
        ReactDOM.render(<AddRemark reload={this.loadOrderDetail} type="admin"
                                   url="/admin/api/orders/remark" number={this.props.number}/>, mask);
    },
    editUserInfo(){
        let o=this.state.orderDetail||{};
        let user=o.user||{};
        let mask=document.getElementById("dialogContainer");
        ReactDOM.render(<EditUser name={user.realname} gender={user.sex} stars={user.stars}
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
        ReactDOM.render(<EditFlightInfo  type={type} url="/admin/api/orders/edit_returning_info"
                                          number={this.props.number} fno={fno} fdate={fdate}
                                          reload={this.loadOrderDetail}  />, mask);
    },
    editPredictGetCarTime(type,time){
        let mask=document.getElementById("dialogContainer");
        ReactDOM.render(<PredictTime  type={type} url="/admin/api/orders/set_flight_landing_time"
                                          number={this.props.number} time={time}
                                          reload={this.loadOrderDetail}  />, mask);
    },
    editWashService(type,url){
        let mask=document.getElementById("dialogContainer");
        let rainwashing="",remark="",serviceorderid="";
        if(type=="mod"){
            let moreService= this.state.orderDetail.serviceorders;
            let type1=(moreService[0]||{}).servicetype;
            let wash=moreService[0]||{};
            if(type1==10) wash=moreService[1]||{};

            rainwashing=wash.config.rainwashing;
            remark=wash.serviceremark[0].remark;
            serviceorderid=wash.serviceorderid;
        }
        ReactDOM.render(<WashService   url={url} type={type} remark={remark}
                                       rainwashing={rainwashing}
                                       number={this.props.number}
                                       soid={serviceorderid}
                                       reload={this.loadOrderDetail}  />, mask);
    },
    editOilService(type,url){
        let mask=document.getElementById("dialogContainer");
        let oillabel="",money="",serviceorderid="",oiltype="",remark="";
        if(type=="mod"){
            let moreService= this.state.orderDetail.serviceorders;
            let type1=(moreService[0]||{}).servicetype;
            let oil=moreService[0]||{};
            if(type1==1) oil=moreService[1]||{};
            oillabel=oil.config.oillabel;
            money=oil.config.money;
            oiltype=oil.config.oiltype;
            remark=oil.serviceremark[0].remark;
            serviceorderid=oil.serviceorderid;
        }
        ReactDOM.render(<OilService   url={url} type={type} label={oillabel} oiltype={oiltype}
                                      money={money} soid={serviceorderid} remark={remark}
                                      number={this.props.number}
                                      reload={this.loadOrderDetail}  />, mask);
    },
    cancelExtraService(id,type="wash"){
        let title="取消洗车/加油服务",content="确认取消洗车服务吗？";
        if(type=="oil") content="确认取消加油服务吗？";
        let mask=document.getElementById("dialogContainer");
        ReactDOM.render(<Ensure title={title} content={content}
                                serviceorderid={id} reload={this.loadOrderDetail}
                                url="/admin/api/serviceorder/cancel" />,mask);
    },
    handleSendMsg(){
        let mask=document.getElementById("dialogContainer");
        ReactDOM.render(<SendMsg number={this.props.number}/>, mask);
    },
    handleCancelOrder(){
        let mask=document.getElementById("dialogContainer");
        let id=this.props.number;
        let title="取消订单";
        let content="确认取消订单（"+id+"）吗？";
        ReactDOM.render(<Ensure title={title} content={content} url="/admin/api/orders/cancel"
                                number={id}/>, mask);
    },
    componentDidUpdate(prevProps, prevState){
        let order=this.state.orderDetail;
        let parkDriverName=order.parkingdrivername;
        let returnDriverName=order.returningdrivername;
        if(parkDriverName!=prevState.orderDetail.parkingdrivername){
            this.handleSwitch("pro_1");
        }else if(returnDriverName!=prevState.orderDetail.returningdrivername){
            this.handleSwitch("pro_4");
        }
    },
    ensureWash(type,name,tel,sid,intro){
        let mask=document.getElementById("dialogContainer");
        ReactDOM.render(<ServiceEnsure  type={type} data={{name,tel,sid,intro}}/>, mask);
    },
    handleTelEnsure(oid){
        let mask=document.getElementById("dialogContainer");
        mask.style.display="block";
        ReactDOM.render(<Ensure title="电话确认" serialnumber={oid}
                                url="/admin/api/orders/confirmed"
                                reload={this.props.updateList}
                                content="亲！是否已电话和客户确认过订单信息？"/>, mask);
    },
    handleSwitch(item){
        let order=this.state.orderDetail||{},s=order.status;
        let take=order.parkingdrivername?{driverName:order.parkingdrivername,
                assignTime:order.parkingassignedtime, startTime:order.parkingstartedtime,
            finishTime:order.parkingfinishedtime}:null;

        let move=order.movingdrivername?{driverName:order.movingdrivername,
                 bufferTime:order.bufferparkedtime,moveTime:order.movingstartedtime,
            moveRemark:order.movingremark,pictures:order.bufferpictures}:null;

        let garage=order.parkingspot?{parkingspot:order.parkingspot,
                keyspot:order.keyspot,mileage:order.mileage,
                inTime:order.parkingfinishedtime,pictures:order.parkingpictures}:null;

        let pay=order.payment||{};

        let send=order.returningdrivername?{driverName:order.returningdrivername,
                assignTime:order.returningassignedtime, startTime:order.returningstartedtime,
                finishTime:order.returningfinishedtime,
                totalfee:pay.totalfee,description:pay.description,money:pay.paymentmoney}:null;
        let payment=pay.totalfee?{
            takeTime:order.parkingstartedtime,sendTime:order.returningfinishedtime,
                parkLong:order.parkingtime,totalfee:pay.totalfee,type:pay.paymenttype,
                money:pay.paymentmoney,status:pay.paymentstatus,description:pay.description,
                payTime:pay.paymenttime
            }:null;
        let comm=order.comment;
        let comment=comm?{
                serviceSatr:comm.servicescore,parkingStar:comm.parkingscore,retruningStar:comm.returningscore,
                commTime:comm.commenttime,commContent:comm.commentcontent,showPublic:comm.showpublic,
                response:comm.response
            }:null;

        if (item == "pro_1") {
            this.setState({p_item:'p1'});
            ReactDOM.render(<TakeCar  data={take} order_id={order.serialnumber} airport_id={order.airportid}
                                      order_status={s} reload={this.loadOrderDetail}/> , this.process);
        } else if (item == "pro_2") {
            this.setState({p_item:'p2'});
            ReactDOM.render(<MoveCar data={move}  /> , this.process);
        } else if (item == "pro_3") {
            this.setState({p_item:'p3'});
            ReactDOM.render(<InGarage data={garage} /> , this.process);
        } else if (item == "pro_4") {
            this.setState({p_item:'p4'});
            ReactDOM.render(<SendCar data={send} order_id={order.serialnumber} airport_id={order.airportid}
                                     order_status={s} reload={this.loadOrderDetail} /> , this.process);
        } else if (item == "pro_5") {
            this.setState({p_item:'p5'});
            ReactDOM.render(<Pay data={payment}  /> , this.process);
        } else if (item == "pro_6") {
            this.setState({p_item:'p6'});
            ReactDOM.render(<Evaluation data={comment} order_id={order.serialnumber} /> , this.process);
        }
    },
    componentDidMount(){
        setTimeout(()=>{
            let order=this.state.orderDetail||{},s=order.status;
            if(s<=10){
                this.handleSwitch("pro_1");
            }else if(s>10 && s<15){
                this.handleSwitch("pro_2");
            }else if(s>=15 && s<=16){
                this.handleSwitch("pro_3");
            }else if(s>16 && s<35){
                this.handleSwitch("pro_4");
            }else if(s>=35){
                this.handleSwitch("pro_5");
            }
        },500);
        this.adjustWidth();
        window.addEventListener("resize",this.adjustWidth,false);
    },
    componentWillUnmount(){
        window.removeEventListener("resize",this.adjustWidth);
    },
    adjustWidth(){
        let sumWidth=document.body.clientWidth-210;
        let bs=this.state.blocks;
        if(this.state.first){
            sumWidth=this.props.width;
            this.setState({first:false});
        }
        let helArr=[],ws=[280,280,280,490];
        let edgeValue=1340;
        if(sumWidth>edgeValue){
            let incre=(sumWidth-edgeValue)/4;
            for(let i=0;i<4;i++) {
                ws[i]+=incre;
                let block=bs[i];
                block.style.width=ws[i]+'px';
                if (i == 0){
                    this.userTag.style.width= ws[i]-101+'px';
                    this.uRemark.style.width= ws[i]-101+'px';
                }else if(i==1){
                    this.comeRemark.style.width= ws[i]-101+'px';
                }else if(i==2){
                    this.suRemark.style.width= ws[i]-101+'px';
                    this.swRemark.style.width= ws[i]-101+'px';
                    this.soRemark.style.width= ws[i]-101+'px';
                }
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

        let level=[];
        for(let i=0;i<user.stars;i++){
            level[i]=(<span key={i} style={{color:'red'}}>&#9733;&ensp;</span>)
        }
        let type1=(moreService[0]||{}).servicetype,type2=(moreService[1]||{}).servicetype;
        let wash=moreService[0]||{},oil=moreService[1]||{};
        if(type1==10) oil=moreService[0];
        if(type2==1) wash=moreService[1];

        let washConfig=wash.config,oilConfig=oil.config;
        let washIntro=washConfig?(washConfig.rainwashing=="1"?"下雨也洗车":"下雨不洗车"):"无";
        let oilIntro=oilConfig?(oilConfig.oiltype||"")+" "+(oilConfig.oillabel||"")+" "+(oilConfig.money||""):"无";
        /**
         * 客服 洗车备注
         */
        let washRemark=(wash.serviceremark||[]).map((item,index)=>{
            return (<i key={index}>{item.time}&ensp;{item.admin_name}&ensp;{item.remark}<br/></i>)
        });
        /**
         * 客服 加油备注
         */
        let oilRemark=(oil.serviceremark||[]).map((item,index)=>{
            return (<i key={index}>{item.time}&ensp;{item.admin_name}&ensp;{item.remark}<br/></i>)
        });
        /**
         * 客服 订单备注
         */
        let serviceRemark=(o.remark||[]).map((item,index)=>{
            return (<p key={index}>{item.time}&emsp;{item.admin_name}&emsp;{item.remark}</p>);
        });
        /**
         *司机备注
         */
        let driverRemark=driverNote.map((item,index)=>{
            return (<p key={index}>{item.time}&ensp;
                <span style={{color:'#DB8800'}}>{item.driver_name}:&ensp;</span>{item.remark}</p>);
        });
        /**
         *渠道备注
         */
        let comeRemark=(o.distributornote||[]).map((item,index)=>{
            return (<i key={index}>{item.time}&ensp;{item.name}&ensp;{item.remark}<br/></i>);
        });
        this.tags=user.tags||[];
        this.serialnumber=o.serialnumber;
        let userTags=(user.tags||[]).map((item,index)=>{
            return(<span key={index} style={{color:"#323232"}}>{item}&ensp;</span>)
        });
        let s=o.status;
        let states=getStateInfo(s);
        let flightState=o.flightstatus,status_img="";
        if(flightState=="计划"){
            status_img="order_flight_plan.png";
        }else if(flightState=="起飞"){
            status_img="order_flight_takeoff.png";
        }else if(flightState=="到达"){
            status_img="order_flight_arrived.png";
        }else if(flightState=="延误"){
            status_img="order_flight_delay.png"
        }else if(flightState=="取消"){
            status_img="order_flight_canceled.png";
        }else if(flightState=="备降"){
            status_img="order_flight_alternate.png";
        }
        let pItem=this.state.p_item;
        return(
            <section className="detail-section">
                <p className="order-brief">
                    <label style={{paddingLeft:'20px'}}>订单号：</label><span>{o.serialnumber}</span>
                    <label style={{paddingLeft:'20px'}}>下单时间：</label><span>{o.createtime}</span>
                    <label style={{paddingLeft:'20px'}}>来源：</label><span>{o.comefrom}</span>
                    <label style={{paddingLeft:'20px'}}>状态：</label>
                    <span style={{color:"#f00"}}>{states[0]}</span>
                    {s==-1?<label style={{paddingLeft:'20px'}}>取消者：<span>{o.canceler}</span></label>:""}
                    {s==-1?<label style={{paddingLeft:'20px'}}>取消时间：<span>{o.cancelingtime}</span></label>:""}

                    <label style={{paddingLeft:'80px',color:"#1AA0E5",cursor:"pointer"}}
                       onClick={this.handleSendMsg}>发送短信</label>
                    {optState(1,s)?<label style={{paddingLeft:'20px',color:"#1AA0E5",cursor:"pointer"}}
                       onClick={this.handleCancelOrder}>取消订单</label>:""}
                    {s==0?<label style={{paddingLeft:'20px',color:"#DB8800",cursor:"pointer"}}
                       onClick={()=>this.handleTelEnsure(o.serialnumber)}>电话确认</label>:""}
                </p>
                <div className="order-main">
                    <div className="user-info" ref={(c)=>this.state.blocks[0]=c} >
                        <h2>用户信息</h2>
                        <figure className="user-basic">
                            <img src={user.avatar||"/duck/img/userheadimg.png"}/>
                            <figcaption>
                                <p>姓名：<span style={{color:"#1AA0E5",cursor:"pointer"}}
                                             onClick={()=>this.editUserInfo()}>{user.realname}</span></p>
                                <p>性别：<span>{user.sex==1?"男":"女"}</span></p>
                                <p>手机：<span>{user.phoneno}</span></p>
                            </figcaption>
                        </figure>
                        <div className="user-other">
                            <p><label>重要等级：</label>{level}</p>
                            <p><label>使用次数：</label><span>{user.bookcount}</span></p>
                            <p><label>用户来源：</label><span>{user.comefrom}</span></p>
                            <p><label>注册时间：</label>
                                <span>{getFormatDate("yyyy-mm-dd hh:ii",user.registertime*1000)}</span></p>
                            <p><label>标&#8195;&#8195;签：</label><em ref={(c)=>this.userTag=c}>{userTags}
                                <span style={{color:"#1AA0E5",cursor:"pointer"}}
                                      onClick={()=>this.addLabel(user.userid)}>{userTags.length>0?"编辑":"添加"}</span></em></p>
                            <p className="note-field"><label>备&#8195;&#8195;注：</label>
                                <span ref={(c)=>this.uRemark=c}>{user.remark}</span></p>
                        </div>
                    </div>
                    <div className="order-info" ref={(c)=>this.state.blocks[1]=c}>
                        <h2>预约信息</h2>
                        <div className="up-section">
                            <p><label>车辆信息：</label>
                                <span className="enable" onClick={()=>this.editCarInfo(car)}>
                                    {car.carno}&emsp;{car.color}{car.brand}</span></p>
                            <p><label>预约接车时间：</label>
                                <span className={optState(1,s)?"enable":"disabled"}
                                      onClick={()=>this.editBookingTime(o.serialnumber,o.bookingtime)}>
                                    {o.bookingtime}</span></p>
                            <p><label>去程航站楼：</label>
                                <span>{o.parkingterminalname}</span></p>
                        </div>
                        <div className="down-section">
                            <p><label>航班更新时间：</label>
                                <span>{getFormatDate("yyyy-mm-dd hh:ii",o.updatereturningtime)}</span></p>
                            <p className="back-flight">
                                <label>返程航班：</label>
                                {o.returningflight?(<span className={optState(2,s)?"enable":"disabled"}
                                    onClick={()=>this.editFlightInfo("mod",o.returningflight,o.returningdate)}>
                                    {(o.returningflight||"")+" "+(o.returningdate||"")}</span>):
                                    (<span className={optState(2,s)?"enable":"disabled"}
                                           onClick={()=>this.editFlightInfo("add",o.returningflight,o.returningdate)}>添加</span>)}
                               {flightState?<img src={"/duck/img/flight_status/"+status_img} />:""}
                            </p>
                            <p><label>预约取车时间：</label>
                                {o.returningtime?(<span className={optState(3,s)?"enable":"disabled"}
                                                          onClick={()=>this.editPredictGetCarTime("mod",o.returningtime)}>
                                        {o.returningtime||""}</span>):
                                    (<span className={optState(3,s)?"enable":"disabled"}
                                           onClick={()=>this.editPredictGetCarTime("add",'')}>添加</span>)}</p>
                            <p><label>回程航站楼：</label><span>{o.returningterminalname}</span></p>
                            <p className="note-field"><label>渠道备注：</label>
                                <span ref={(c)=>this.comeRemark=c}>{comeRemark}</span></p>
                        </div>
                    </div>
                    <div className="service-info" ref={(c)=>this.state.blocks[2]=c}>
                        <h2>更多服务</h2>
                        <div className="extra-service">
                            <p><label>洗车：</label>
                                {washConfig?<span className={optState(7,s)?"enable":"disabled"}
                                        onClick={()=>this.ensureWash("wash",user.realname,user.phoneno,wash.serviceorderid,washIntro)}>
                                        {washIntro}</span>:<span>{washIntro}</span>}
                                {washConfig?(<em className={optState(5,s)?"enable":"disabled"}><i onClick={
                                    ()=>this.editWashService("mod","/admin/api/serviceorder/edit_washing")}>编辑</i>&ensp;
                                        <i onClick={()=>this.cancelExtraService(wash.serviceorderid)}>取消</i></em>):
                                    (<em className={optState(5,s)?"enable":"disabled"}
                                         onClick={()=>this.editWashService("add","/admin/api/serviceorder/add_washing")}>添加</em>)}
                            </p>
                            <p><label>加油：</label>
                                {oilConfig?<span className={optState(7,s)?"enable":"disabled"}
                                                  onClick={()=>this.ensureWash("oil",user.realname,user.phoneno,oil.serviceorderid,oilIntro)}>
                                        {oilIntro}</span>:<span>{oilIntro}</span>}
                                {oilConfig?(<em className={optState(4,s)?"enable":"disabled"}>
                                        <i onClick={()=>this.editOilService("mod","/admin/api/serviceorder/edit_oil")}>编辑</i>&ensp;
                                        <i onClick={()=>this.cancelExtraService(oil.serviceorderid,"oil")}>取消</i></em>):
                                    (<em className={optState(4,s)?"enable":"disabled"}
                                         onClick={()=>this.editOilService("add","/admin/api/serviceorder/add_oil")}>添加</em>)}
                            </p>
                        </div>
                        <p className="note-field"><label>用户备注：</label>
                            <span ref={(c)=>this.suRemark=c}>{o.userremark}</span></p>
                        <p className="note-field"><label>洗车备注：</label>
                            <span ref={(c)=>this.swRemark=c}>{washRemark}</span></p>
                        <p className="note-field"><label>加油备注：</label>
                            <span ref={(c)=>this.soRemark=c}>{oilRemark}</span></p>
                    </div>
                    <div className="process-info" ref={(c)=>this.state.blocks[3]=c} >
                        <ul>
                            <li className={pItem=='p1'?"show-item":''}
                                onClick={()=>this.handleSwitch("pro_1")}>接车</li>
                            <li className={pItem=='p2'?"show-item":''}
                                onClick={()=>this.handleSwitch("pro_2")}>挪车</li>
                            <li className={pItem=='p3'?"show-item":''}
                                onClick={()=>this.handleSwitch("pro_3")}>在库</li>
                            <li className={pItem=='p4'?"show-item":''}
                                onClick={()=>this.handleSwitch("pro_4")}>送车</li>
                            <li className={pItem=='p5'?"show-item":''}
                                onClick={()=>this.handleSwitch("pro_5")}>支付</li>
                            <li className={pItem=='p6'?"show-item":''}
                                onClick={()=>this.handleSwitch("pro_6")}>评价</li>
                        </ul>
                        <div ref={(c)=>this.process=c} className="process-area" />
                    </div>
                </div>
                <div className="notes">
                    <div className="service-note">
                        <p><label>客服备注：</label><img src="/duck/img/icon/13_1.png" onClick={this.addRemark}
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