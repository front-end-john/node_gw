import React from 'react';
import ReactDOM from 'react-dom';
import AddRemark from '../dialog/add_remark';
import WarnTip from '../dialog/warn_tip';
import Label from "../dialog/customer_label";
import EditUser from "../dialog/edit_user_info";
import EditMaintainContent from "../dialog/edit_maintain_bill";
import EditLastMaintainTime from "../dialog/edit_last_maintain_time";
import MaintainUnwanedReason from "../dialog/maintain_unwanted_reason";
import MaintainCancelReason from "../dialog/maintain_cancel_reason";
import CarReturnDarage from "../dialog/car_return_garage";
import ImgScroll from '../widgets/img_scroll';
import DateSelect from '../widgets/date_select';

import {getFormatDate,optState} from '../../util';
export default React.createClass({
    getInitialState(){
        return{blocks:[],first:true,chOrderStatus:0};
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
        /*let url="/jsj/system/orderdetail?serialnumber="+this.props.number;
        fetch(url,{credentials: 'include'}).then(function(res){
            console.log("查询订单详情响应状态："+res.status);
            if(+res.status < 400){
                return res.text();
            }else {
                throw new Error("服务异常");
            }
        }).then((str)=>{
            try{
                let obj=JSON.parse(str);
                this.setState({orderDetail:obj.record});
            }catch(e){
                this.showWarnTip("数据格式异常！");
            }
        }).catch(function(e) {
            this.showWarnTip("网络请求异常！");
            console.trace('错误:', e);
        });*/
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
        ReactDOM.render(<AddRemark reload={this.loadOrderDetail}
                                   url="/jsj/system/addremark" number={this.props.number}/>, mask);
    },
    editMaintainBill(){
        let mask=document.getElementById("dialogContainer");
        ReactDOM.render(<EditMaintainContent reload={this.loadOrderDetail}
                                             url="/jsj/system/addremark" number={this.props.number}/>, mask);
    },
    editLastMaintainTime(){
        let mask=document.getElementById("dialogContainer");
        ReactDOM.render(<EditLastMaintainTime reload={this.loadOrderDetail}
                                             url="/jsj/system/addremark" number={this.props.number}/>, mask);
    },
    handleMaintainUnwanedReason(){
        let mask=document.getElementById("dialogContainer");
        ReactDOM.render(<MaintainUnwanedReason reload={this.loadOrderDetail}
                                              url="/jsj/system/addremark" number={this.props.number}/>, mask);
    },
    handleMaintainCancelReason(){
        let mask=document.getElementById("dialogContainer");
        ReactDOM.render(<MaintainCancelReason reload={this.loadOrderDetail}
                                              url="/jsj/system/addremark" number={this.props.number}/>, mask);
    },
    handleCarReturnDarage(){
        let mask=document.getElementById("dialogContainer");
        ReactDOM.render(<CarReturnDarage reload={this.loadOrderDetail}
                                              url="/jsj/system/addremark" number={this.props.number}/>, mask);
    },

    adjustWidth(){
        let sumWidth=document.body.clientWidth-220;
        let bs=this.state.blocks;
        if(this.state.first){
            sumWidth=this.props.width;
            this.setState({first:false});
        }
        let edgeValue=1240;
        let labelWidth=105;
        if(sumWidth>edgeValue){
            for(let i=0;i<3;i++) {
                let currWidth=parseFloat(getComputedStyle(bs[i]).width);
                if (i ===0){
                    this.userTag.style.width= currWidth-labelWidth+'px';
                }
            }
        }
    },
    render(){
        let o=this.state.orderDetail||{};
        let user=o.userinfo||{};
        let level=[];
        for(let i=0;i<user.stars;i++){
            level[i]=(<span key={i} style={{color:'red'}}>&#9733;&ensp;</span>)
        }

        let serviceRemark=(o.adminremark||[]).map((item,index)=>{
            return (<p key={index}><span>{item.time}&emsp;</span>{item.remark}</p>);
        });

        this.tags=user.tags||[];
        let userTags=(user.tags||[]).map((item,index)=>{
            return(<span key={index} style={{color:"#323232"}}>{item}&ensp;</span>)
        });

        //保养状态
        let status=this.state.chOrderStatus;
        let op_list=[];
        if(status===0){
            op_list.push(<p key={1} style={{marginTop:30}}>
                <button className="maintain-recommend-btn" onClick={this.addRemark}>向客户推荐保养</button>
                <button className="maintain-nothing-btn" onClick={this.handleMaintainUnwanedReason}>无需保养</button>
            </p>);
        }else if(status===10){
            op_list.push(<p key={1} style={{marginTop:30}}>
                <button className="maintain-recommend-btn" >向客户推荐保养</button>
                <button className="maintain-ensure-btn">客户已确认保养</button>
                <button className="maintain-nothing-btn" onClick={this.handleMaintainUnwanedReason}>无需保养</button>
            </p>);
        }else if(status===20){
            op_list.push(<p key={1} className="maintain-detail">
                <label>保养明细：</label>
                <ImgScroll imgs={["https://dummyimage.com/100x100","https://dummyimage.com/100x100"]} />
                <span className="edit_maintain">编辑保养明细</span>
            </p>);
            op_list.push(<p key={2}>
                <label>费用：</label><span>2300元（4S店2100元+飞泊通服务费200元）</span>
            </p>);
            op_list.push(<p key={3} style={{marginTop:20}}>
                <button className="maintain-recommend-btn" onClick={this.editMaintainBill}>上传保养明细</button>
                <button className="maintain-nothing-btn" onClick={this.handleMaintainCancelReason}>取消保养</button>
            </p>);
        }else if(status===30){
            op_list.push(<p key={1} className="maintain-detail">
                <label>保养明细：</label>
                <ImgScroll imgs={["https://dummyimage.com/100x100","https://dummyimage.com/100x100"]} />
            </p>);
            op_list.push(<p key={2}>
                <label>费用：</label><span>2300元（4S店2100元+飞泊通服务费200元）</span>
            </p>);
            op_list.push(<p key={3}>
                <label style={{color:"#f00"}}>客户尚未付款</label>
            </p>);
            op_list.push(<p key={4} style={{marginTop:20}}>
                <button className="maintain-recommend-btn"
                        style={{width:90}} onClick={this.handleCarReturnDarage}>车辆回库</button>
                <button className="maintain-nothing-btn" onClick={this.handleMaintainCancelReason}>取消保养</button>
            </p>);
        }else if(status===50){
            op_list.push(<p key={1} className="maintain-detail">
                <label>保养明细：</label>
                <ImgScroll imgs={["https://dummyimage.com/100x100","https://dummyimage.com/100x100"]} />
            </p>);
            op_list.push(<p key={2}>
                <label>费用：</label><span>2300元（4S店2100元+飞泊通服务费200元）</span>
            </p>);
            op_list.push(<p key={3}>
                <label style={{color:"#f00"}}>客户尚未付款</label>
            </p>);
            op_list.push(<p key={4} style={{marginTop:20}}>
                <button className="maintain-recommend-btn" style={{width:140}}>告知客户保养完成</button>
            </p>);
        }else if(status===-1){
            op_list.push(<p key={1} className="maintain-detail">
                <label>保养明细：</label>
                <ImgScroll imgs={["https://dummyimage.com/100x100","https://dummyimage.com/100x100"]} />
            </p>);
            op_list.push(<p key={2}>
                <label>费用：</label><span>2300元（4S店2100元+飞泊通服务费200元）</span>
            </p>);
            op_list.push(<p key={3}>
                <label style={{color:"#f00"}}>取消原因：客户不想保养。</label>
            </p>);
        }else if(status===-10){
            op_list.push(<p key={1} className="maintain-detail">
                <label>保养明细：</label>
                <ImgScroll imgs={["https://dummyimage.com/100x100","https://dummyimage.com/100x100"]} />
            </p>);
            op_list.push(<p key={2}>
                <label>费用：</label><span>2300元（4S店2100元+飞泊通服务费200元）</span>
            </p>);
            op_list.push(<p key={3}>
                <label style={{color:"#f00"}}>无需保养原因：客户一个月前已做保养。</label>
            </p>);
        }
        return(
            <section className="detail-section take-after-detail">
                <p className="order-brief">
                    <label style={{paddingLeft:'20px'}}>订单号：</label><span>{o.serialnumber||'124545454'}</span>
                    <label style={{paddingLeft:'20px'}}>下单时间：</label>
                    <span>{getFormatDate("yyyy-mm-dd hh:ii",o.createtime)}</span>
                    <label style={{paddingLeft:'20px'}}>状态：</label>
                    <span style={{color:'red'}}>{o.statusdescription}</span>
                    <label style={{paddingLeft:'20px'}}>取消人：</label><span>{o.cancelperson}</span>
                    <label style={{paddingLeft:'20px'}}>取消时间：</label>
                    <span>{getFormatDate("yyyy-mm-dd hh:ii",o.canceltime)}</span>
                </p>
                <div className="order-main">
                    <div className="user-info" ref={(c)=>this.state.blocks[0]=c} >
                        <h2>用户信息</h2>
                        <figure className="user-basic">
                            <img src={user.avatar||"/duck/img/userheadimg.png"}/>
                            <figcaption>
                                <p>姓名：<span style={{color:"#1AA0E5",cursor:"pointer"}}
                                            onClick={()=>this.editUserInfo()}>{user.realname}</span></p>
                                <p>性别：<span>{+user.sex===1?"男":"女"}</span></p>
                                <p>手机：<span>{user.phoneno}</span></p>
                            </figcaption>
                        </figure>
                        <div className="user-other">
                            <p><label>重要等级：</label>{level}</p>
                            <p><label>使用次数：</label><span>{user.bookcount}</span>&emsp;
                               <label>停车券数：</label><span onClick={this.handleShowCoupon}
                                                          className={user.couponcount?"enable":"disabled"}>{user.couponcount}</span></p>
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
                    <div className="car-park-info" ref={(c)=>this.state.blocks[1]=c}>
                        <h2>泊车信息</h2>
                        <div>
                            <p><label>入库时间：</label><span>2017-03-01 17:12</span></p>
                            <p><label>返程信息：</label><span>HU9588_2017-03-03 11:12</span></p>
                        </div>
                        <div className="move-car">
                            <ImgScroll imgs={["https://dummyimage.com/140x140","https://dummyimage.com/140x140"]} />
                            <section className="in-garage">
                                <p><label>停车位：</label><span>P102</span></p>
                                <p><label>钥匙位：</label><span>302</span></p>
                                <p><label>里程数：</label><span>2454km</span></p>
                            </section>
                        </div>
                    </div>
                    <div className="order-info" ref={(c)=>this.state.blocks[2]=c}>
                        <h2>保养信息</h2>
                        <div className="up-section">
                            <p><label>当前里程数：</label>
                                <span style={{color:"#323232"}}>58623 km</span></p>
                            <p><label>司机推荐理由：</label>
                                <span style={{color:"#323232"}}>已到保养里程</span></p>
                            {status==="remain_recommend"?<p>
                                <DateSelect title={<span>上次保养时间：</span>}
                                            change={(date)=>this.state.last_maintain_time=date}/>
                                <button className="maintain-time-ensure">确定</button>
                            </p>:<p><label>上次保养时间：</label>
                                <span style={{color:"#323232"}}>2015-12-20</span>
                                <span style={{color:"#1AA0E5",cursor:"pointer",marginLeft:15}}
                                onClick={this.editLastMaintainTime}>编辑</span></p>}
                        </div>
                        <div className="down-section">
                            {op_list}
                        </div>
                    </div>
                </div>
                <div className="notes" ref={c=>this.note=c}>
                    <div className="service-note">
                        <p>客服备注：<img src="/duck/img/icon/13_1.png" onClick={this.addRemark}
                                     style={{color:"#1AA0E5",cursor:"pointer"}} /></p>

                    </div>
                    <div className="service-note">
                        <p>保养备注：<img src="/duck/img/icon/13_1.png" onClick={this.addRemark}
                                     style={{color:"#1AA0E5",cursor:"pointer"}} /></p>

                    </div>
                    <div className="service-note">
                        <p>司机备注：</p>
                        {serviceRemark}
                    </div>
                </div>
            </section>
        );
    }
});
