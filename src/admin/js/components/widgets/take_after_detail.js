import React from 'react';
import ReactDOM from 'react-dom';
import AddRemark from '../dialog/add_remark';
import WarnTip from '../dialog/warn_tip';
import Label from "../dialog/customer_label";
import EditUser from "../dialog/edit_user_info";
import MaintainContent from "../dialog/edit_maintain_bill";
import LastMaintainTime from "../dialog/edit_last_maintain_time";
import OverMaintainMile from "../dialog/edit_over_maintain_mileage";
import MaintainUnwanedReason from "../dialog/maintain_unwanted_reason";
import MaintainCancelReason from "../dialog/maintain_cancel_reason";
import RecommendMaintain from "../dialog/recommend_maintain";
import CarReturnGarage from "../dialog/car_return_garage";
import ImgScroll from '../widgets/img_scroll';

import {getFormatDate,maintainState} from '../../util';
export default React.createClass({
    getInitialState(){
        return{chOrderStatus:0};
    },
    showWarnTip(msg){
        let mask=document.getElementById("dialogContainer");
        ReactDOM.render(<WarnTip msg={msg}/>, mask);
    },
    addLabel(id){
        let mask=document.getElementById("dialogContainer");
        ReactDOM.render(<Label tags={this.tags} url="/admin/api/users/marking"
                               reload={this.loadOrderDetail} uid={id}/>, mask);
    },

    editUserInfo(){
        let o=this.state.orderDetail||{};
        let user=o.userinfo||{};
        let mask=document.getElementById("dialogContainer");
        ReactDOM.render(<EditUser name={user.username} gender={user.sex} stars={user.stars}
                                  remark={user.remark} tel={user.phoneno}
                                  url="/admin/api/users/edit" reload={this.loadOrderDetail} />, mask);
    },
    loadOrderDetail(){
        let url="/api5/chorders/queryDetails?chserialnumber="+this.props.number;
        console.log("车后订单详情接口",url);
        fetch(url,{credentials: 'include'}).then(function(res){
            console.log("车后订单详情响应："+res.status);
            if(res.status < 400){
                return res.json();
            }else {
                throw new Error("服务异常");
            }
        }).then((obj)=>{
           if(obj.code===0){
               this.setState({orderDetail:obj.record});
           }else {
               this.showWarnTip(obj.message);
           }
        }).catch((e)=>{
            this.showWarnTip("网络请求异常！");
            console.trace('错误:', e);
        });
    },
    componentWillMount(){
        this.loadOrderDetail();
    },
    componentDidMount(){
        window.addEventListener("resize",this.adjustWidth,false);
        this.adjustWidth();
    },
    componentWillReceiveProps(nextProps){
        /*if(this.props.status!==nextProps.status){
            console.log(nextProps.status);
            this.forceUpdate();
        }*/
    },
    addRemark(){
        let mask=document.getElementById("dialogContainer");
        ReactDOM.render(<AddRemark reload={this.loadOrderDetail} type="maintain"
                                   url="/api5/chorders/remark" number={this.props.number}/>, mask);
    },
    handleCustomerEnsureMaintain(){
        let chserialnumber=this.props.number;
        let url="/api5/chorders/confirm?chserialnumber="+chserialnumber;
        console.log("客户确认保养接口:",url);
        fetch(url,{credentials: 'include'}).then((res)=>{
            return res.json();
        }).then((obj)=>{
            this.showWarnTip(obj.message);
            this.props.shift("confirmed");
            this.loadOrderDetail();
        }).catch((e)=>{
            this.showWarnTip("网络请求异常！");
            console.warn('异常接口：', url,"异常对象：",e);
        });
    },
    handleMaintainRecommend(){
        let mask=document.getElementById("dialogContainer");
        ReactDOM.render(<RecommendMaintain reload={this.loadOrderDetail} shift={this.props.shift}
                                             url="/api5/chorders/recommendToCustomers" number={this.props.number}/>, mask);
    },
    editMaintainBill(type){
        let mask=document.getElementById("dialogContainer");
        let url="/api5/chorders/editMaintainDetails";
        if(type==="add"){
            url="/api5/chorders/uploadMaintainDetails";
        }
        ReactDOM.render(<MaintainContent reload={this.loadOrderDetail} info={this.maintainInfo}
                                         url={url} number={this.props.number}/>, mask);
    },
    editLastMaintainTime(){
        let mask=document.getElementById("dialogContainer");
        ReactDOM.render(<LastMaintainTime reload={this.loadOrderDetail}
                                          url="/api5/chorders/lastMaintainTime" number={this.props.number}/>, mask);
    },
    editOverMaintainMile(){
        let mask=document.getElementById("dialogContainer");
        ReactDOM.render(<OverMaintainMile reload={this.loadOrderDetail}
                                          url="/api5/chorders/exceedmileage" number={this.props.number}/>, mask);
    },
    handleMaintainUnwanedReason(){
        let mask=document.getElementById("dialogContainer");
        ReactDOM.render(<MaintainUnwanedReason reload={this.loadOrderDetail} shift={this.props.shift}
                                              url="/api5/chorders/notRecommend" number={this.props.number}/>, mask);
    },
    handleMaintainCancelReason(){
        let mask=document.getElementById("dialogContainer");
        ReactDOM.render(<MaintainCancelReason reload={this.loadOrderDetail} shift={this.props.shift}
                                              url="/api5/chorders/cancelMaintain" number={this.props.number}/>, mask);
    },
    handleCarReturnGarage(){
        let mask=document.getElementById("dialogContainer");
        ReactDOM.render(<CarReturnGarage reload={this.loadOrderDetail} shift={this.props.shift}
                                         url="/api5/chorders/parkingCar" number={this.props.number}/>, mask);
    },
    pushMaintainBill(){
        let chserialnumber=this.props.number;
        let url="/api5/chorders/push?chserialnumber="+chserialnumber;
        fetch(url,{credentials: 'include'}).then((res)=>{
            return res.json();
        }).then((obj)=>{
            console.log(obj);
            if(obj.code===0){
                this.props.shift("inmaintainace");
                this.loadOrderDetail();
            }
            this.showWarnTip(obj.message);
        }).catch((e)=>{
            this.showWarnTip("网络请求异常！");
            console.warn('异常接口：', url,"异常对象：",e);
        });
    },
    noticeMaintainFinish(){
        let chserialnumber=this.props.number;
        let url="/api5/chorders/pushfinish?chserialnumber="+chserialnumber;
        fetch(url,{credentials: 'include'}).then((res)=>{
            return res.json();
        }).then((obj)=>{
            this.showWarnTip(obj.message);
        }).catch((e)=>{
            this.showWarnTip("网络请求异常！");
            console.warn('异常接口：', url,"异常对象：",e);
        });
    },
    adjustWidth(){
        let sumWidth=document.body.clientWidth-220;
        let edgeValue=1240;
        let labelWidth=105;
        if(sumWidth>edgeValue){
            let currWidth=parseFloat(getComputedStyle(this.userBlock).width);
            this.userTag.style.width= currWidth-labelWidth+'px';
        }
    },
    render(){
        let o=this.state.orderDetail||{};
        let level=[];
        for(let i=0;i<o.stars;i++){
            level[i]=(<span key={i} style={{color:'red'}}>&#9733;&ensp;</span>)
        }
        let serviceRemark=(o.customerserviceRemarkInfo||[]).map((item,index)=>{
            return (<p key={index}><span>{item.createtime}</span>&emsp;<span>{item.adminname}</span>&emsp;{item.remark}</p>);
        });
        let maintainRemark=(o.maintainremarkinfo||[]).map((item,index)=>{
            return (<p key={index}><span>{item.createtime}</span>&emsp;<span>{item.adminname}</span>&emsp;{item.remark}</p>);
        });
        let driverRemark=(o.driverRemarkInfo||[]).map((item,index)=>{
            return (<p key={index}><span>{item.createtime}</span>&emsp;<span>{item.adminname}</span>&emsp;{item.remark}</p>);
        });

        this.tags=o.tagsinfo||[];
        let userTags=this.tags.map((item,index)=>{
            return(<span key={index} style={{color:"#323232"}}>{item}&ensp;</span>)
        });
        let serviceFee=o.servicefee,s4Fee=o.shop4sfee,totalFee=(serviceFee+s4Fee)||0;
        this.maintainInfo={shopFee:s4Fee,billPicture:o.maintainpicture};
        //保养状态
        let status=o.chorderstatus;
        let op_list=[];
        if(status===0){
            op_list.push(<p key={1} style={{marginTop:20}}>
                <button className="maintain-recommend-btn" onClick={this.handleMaintainRecommend}>向客户推荐保养</button>
                <button className="maintain-nothing-btn" onClick={this.handleMaintainUnwanedReason}>无需保养</button>
            </p>);
        }else if(status===10 || status===5){
            op_list.push(<p key={1} style={{marginTop:20}}>
                <button className="maintain-recommend-btn" onClick={this.handleMaintainRecommend}>向客户推荐保养</button>
                <button className="maintain-ensure-btn" onClick={this.handleCustomerEnsureMaintain}>客户已确认保养</button>
                <button className="maintain-nothing-btn" onClick={this.handleMaintainUnwanedReason}>无需保养</button>
            </p>);
        }else if(status===20){
            let picture=o.maintainpicture;
            if(picture){
                op_list.push(<p key={1} className="maintain-detail">
                    <label>保养明细：</label>
                    <ImgScroll imgs={[picture]} />
                    <span className="edit_maintain" onClick={()=>this.editMaintainBill("edit")}>编辑保养明细</span>
                </p>);
                op_list.push(<p key={2}>
                    <label>费用：</label><span>{totalFee}元（4S店{s4Fee}元+飞泊通服务费{serviceFee}元）</span>
                </p>);
                op_list.push(<p key={3} style={{marginTop:10}}>
                    <button className="maintain-recommend-btn" style={{width:150}}
                            onClick={this.pushMaintainBill}>推送保养明细给客户</button>
                    <button className="maintain-nothing-btn" onClick={this.handleMaintainCancelReason}>取消保养</button>
                </p>);
            }else {
                op_list.push(<p key={1} style={{marginTop:10}}>
                    <button className="maintain-recommend-btn" onClick={()=>this.editMaintainBill("add")}>上传保养明细</button>
                    <button className="maintain-nothing-btn" onClick={this.handleMaintainCancelReason}>取消保养</button>
                </p>);
            }
        }else if(status===30){
            op_list.push(<p key={1} className="maintain-detail">
                <label>保养明细：</label>
                <ImgScroll imgs={[o.maintainpicture]} />
            </p>);
            op_list.push(<p key={2}>
                <label>费用：</label><span>{totalFee}元（4S店{s4Fee}元+飞泊通服务费{serviceFee}元）</span>
            </p>);
            op_list.push(<p key={3}>
                <label style={{color:"#f00"}}>客户尚未付款</label>
            </p>);
            op_list.push(<p key={4} style={{marginTop:10}}>
                <button className="maintain-recommend-btn"
                        style={{width:90}} onClick={this.handleCarReturnGarage}>车辆回库</button>
                <button className="maintain-nothing-btn" onClick={this.handleMaintainCancelReason}>取消保养</button>
            </p>);
        }else if(status===50){
            op_list.push(<p key={1} className="maintain-detail">
                <label>保养明细：</label>
                <ImgScroll imgs={[o.maintainpicture]} />
            </p>);
            op_list.push(<p key={2}>
                <label>费用：</label><span>{totalFee}元（4S店{s4Fee}元+飞泊通服务费{serviceFee}元）</span>
            </p>);
            op_list.push(<p key={3}>
                <label style={{color:"#f00"}}>客户尚未付款</label>
            </p>);
            op_list.push(<p key={4} style={{marginTop:10}}>
                <button className="maintain-recommend-btn" style={{width:140}}
                 onClick={this.noticeMaintainFinish}>告知客户保养完成</button>
            </p>);
        }else if(status===-1){
            op_list.push(<p key={1} className="maintain-detail">
                <label>保养明细：</label>
                <ImgScroll imgs={[o.maintainpicture]} />
            </p>);
            op_list.push(<p key={2}>
                <label>费用：</label><span>{totalFee}元（4S店{s4Fee||0}元+飞泊通服务费{serviceFee||0}元）</span>
            </p>);
            op_list.push(<p key={3}>
                <label style={{color:"#f00"}}>取消原因：客户不想保养。</label>
            </p>);
        }else if(status===-10){
            op_list.push(<p key={1} className="maintain-detail">
                <label>保养明细：</label>
                <ImgScroll imgs={[o.maintainpicture]} />
            </p>);
            op_list.push(<p key={2}>
                <label>费用：</label><span>{totalFee}元（4S店{s4Fee}元+飞泊通服务费{serviceFee}元）</span>
            </p>);
            op_list.push(<p key={3}>
                <label style={{color:"#f00"}}>无需保养原因：客户一个月前已做保养。</label>
            </p>);
        }
        return(
            <section className="detail-section take-after-detail">
                <p className="order-brief">
                    <label style={{paddingLeft:'20px'}}>订单号：</label><span>{o.chserialnumber}</span>
                    <label style={{paddingLeft:'20px'}}>下单时间：</label>
                    <span>{getFormatDate("yyyy-mm-dd hh:ii",o.createtime)}</span>
                    <label style={{paddingLeft:'20px'}}>状态：</label>
                    <span style={{color:'red'}}>{maintainState(o.chorderstatus)}</span>
                    <label style={{paddingLeft:'20px'}}>取消人：</label><span>{o.cancelperson}</span>
                    <label style={{paddingLeft:'20px'}}>取消时间：</label>
                    <span>{getFormatDate("yyyy-mm-dd hh:ii",o.canceltime)}</span>
                </p>
                <div className="order-main">
                    <div className="user-info" ref={c=>this.userBlock=c} >
                        <h2>用户信息</h2>
                        <figure className="user-basic">
                            <img src={o.useravatar||"/duck/img/userheadimg.png"}/>
                            <figcaption>
                                <p>姓名：<span style={{color:"#1AA0E5",cursor:"pointer"}}
                                            onClick={()=>this.editUserInfo()}>{o.username}</span></p>
                                <p>性别：<span>{o.sex===1?"男":"女"}</span></p>
                                <p>手机：<span>{o.userphoneno}</span></p>
                            </figcaption>
                        </figure>
                        <div className="user-other">
                            <p><label>重要等级：</label>{level}</p>
                            <p><label>使用次数：</label><span>{o.orderfinishcount}</span></p>
                            <p><label>用户来源：</label><span>{o.comefrom}</span></p>
                            <p><label>注册时间：</label>
                                <span>{getFormatDate("yyyy-mm-dd hh:ii",o.createtime*1000)}</span></p>
                            <p><label>标&#8195;&#8195;签：</label><em ref={(c)=>this.userTag=c}>{userTags}
                                <span style={{color:"#1AA0E5",cursor:"pointer"}}
                                      onClick={()=>this.addLabel(o.userid)}>{userTags.length>0?"编辑":"添加"}</span></em></p>
                            <p className="note-field"><label>备&#8195;&#8195;注：</label>
                                <span ref={(c)=>this.uRemark=c}>{o.userremark}</span></p>
                        </div>
                    </div>
                    <div className="car-park-info">
                        <h2>泊车信息</h2>
                        <div>
                            <p><label>入库时间：</label><span>{o.parkingfinishtime}</span></p>
                            <p><label>返程信息：</label>
                                <span>{o.returningflight}&emsp;{o.flightlandingtime}</span></p>
                        </div>
                        <div className="move-car">
                            <ImgScroll imgs={[o.parkingpictures]} />
                            <section className="in-garage">
                                <p><label>停车位：</label><span>{o.parkingspot}</span></p>
                                <p><label>钥匙位：</label><span>{o.keyspot}</span></p>
                                <p><label>里程数：</label><span>{o.mileage||0}km</span></p>
                            </section>
                        </div>
                    </div>
                    <div className="order-info">
                        <h2>保养信息</h2>
                        <div className="up-section" style={{marginBottom:20}}>
                            <p><label>当前里程数：</label>
                                <span style={{color:"#323232"}}>{o.currentmileage||0}km</span>
                                &emsp;<label>超出保养里程数：</label>
                                <span style={{color:"#323232"}}>{o.exceedmileage||0}km</span>
                                <span style={{color:"#1AA0E5",cursor:"pointer",marginLeft:15}}
                                      onClick={this.editOverMaintainMile}>编辑</span>
                            </p>
                            <p><label>司机推荐理由：</label>
                                <span style={{color:"#323232"}}>{o.driverrecommended}</span></p>
                            <p><label>上次保养时间：</label>
                                <span style={{color:"#323232"}}>{o.lastmaintenancetime}</span>
                                <span style={{color:"#1AA0E5",cursor:"pointer",marginLeft:15}}
                                onClick={this.editLastMaintainTime}>编辑</span></p>
                        </div>
                        <div className="down-section">
                            {op_list}
                        </div>
                    </div>
                </div>
                <div className="notes">
                    <div className="service-note">
                        <p>客服备注：</p>
                        {serviceRemark}
                    </div>
                    <div className="service-note">
                        <p>保养备注：<img src="/duck/img/icon/13_1.png" onClick={this.addRemark}
                                     style={{color:"#1AA0E5",cursor:"pointer"}} /></p>
                        {maintainRemark}
                    </div>
                    <div className="service-note">
                        <p>司机备注：</p>
                        {driverRemark}
                    </div>
                </div>
            </section>
        );
    }
});
