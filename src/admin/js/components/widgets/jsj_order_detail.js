import React from 'react';
import ReactDOM from 'react-dom';
import AddRemark from '../dialog/add_remark';
import WarnTip from '../dialog/warn_tip';
import Label from "../dialog/customer_label";
import EditUser from "../dialog/edit_user_info";
import {getFormatDate} from '../../util';

export default React.createClass({
    getInitialState(){
        return{p_item:'p1',first:true};
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
        let url="/jsj/system/orderdetail?serialnumber="+this.props.number;
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
                this.setState({orderDetail:obj.record});
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
        this.adjustWidth();
        window.addEventListener("resize",this.adjustWidth,false);
    },
    componentWillUnmount(){
        window.removeEventListener("resize",this.adjustWidth);
    },
    addRemark(){
        let mask=document.getElementById("dialogContainer");
        ReactDOM.render(<AddRemark reload={this.loadOrderDetail}
                                   url="/jsj/system/addremark" number={this.props.number}/>, mask);
    },
    adjustWidth(){
        let sumWidth=document.body.clientWidth-260;
        //console.log("sumWidth",sumWidth);
        if(this.state.first){
            sumWidth=this.props.width;
            this.setState({first:false});
        }
        let helArr=[];
        let edgeValue=1400;
        if(sumWidth>edgeValue){
            let incre=(sumWidth-edgeValue)/4;
            for(let i=1;i<5;i++){
                let dom=this["block"+i];
                let width=300+incre;
                if (i == 1) this.userTag.style.width=width-101+'px';
                if(i==4) width=494+incre;
                dom.style.width=width+"px";
                helArr[i-1] = parseFloat(getComputedStyle(dom).height);
            }
        }
        let maxHel=helArr.sort()[3];
        for(let i=1;i<5;i++) {
            let dom = this["block" + i];
            dom.style.height = maxHel + "px";
        }
    },
    render(){
        let o=this.state.orderDetail||{};
        let user=o.userinfo||{};
        let driver=o.driverinfo||{};
        let cmt=o.commentinfo||{};
        let rece=o.receiptinfo||{};
        let userLevel=[],cmtStars=[];
        let serviceRemark=(o.adminremark||[]).map((item,index)=>{
            return (<p key={index}><span>{item.time}&emsp;</span>{item.remark}</p>);
        });
        for(let i=0;i<user.stars||0;i++){
            userLevel[i]=(<span key={i} style={{color:'red'}}>&#9733;</span>)
        }
        for(let i=0;i<cmt.score||0;i++){
            cmtStars[i]=(<span key={i} style={{color:'red'}}>&#9733;</span>)
        }
        this.tags=user.tags||[];
        let userTags=(user.tags||[]).map((item,index)=>{
            return(<span key={index} style={{color:"#323232"}}>{item}&ensp;</span>)
        });
        return(
            <section className="detail-section">
                <p className="order-brief">
                    <label style={{paddingLeft:'20px'}}>订单号：</label><span>{o.serialnumber||''}</span>
                    <label style={{paddingLeft:'20px'}}>下单时间：</label>
                    <span>{getFormatDate("yyyy-mm-dd hh:ii",o.createtime)}</span>
                    <label style={{paddingLeft:'20px'}}>状态：</label>
                    <span style={{color:'red'}}>{o.statusdescription}</span>
                    <label style={{paddingLeft:'20px'}}>取消人：</label><span>{o.cancelperson}</span>
                    <label style={{paddingLeft:'20px'}}>取消时间：</label>
                    <span>{getFormatDate("yyyy-mm-dd hh:ii",o.canceltime)}</span>
                </p>
                <div className="order-main">
                    <div className="user-info" ref={(c)=>this.block1=c}>
                        <h2>用户信息</h2>
                        <figure className="user-basic">
                            <img src={user.avater||"/admin/img/userheadimg.png"}/>
                            <figcaption>
                                <p>姓名：<span style={{color:"#1AA0E5",cursor:"pointer"}}
                                             onClick={()=>this.editUserInfo()}>
                                    {user.username||''}</span></p>
                                <p>性别：<span>{ user.sex||""}</span></p>
                                <p>手机：<span>{ user.phoneno||''}</span></p>
                            </figcaption>
                        </figure>
                        <div className="user-other">
                            <p><label>重要等级：</label>{userLevel}</p>
                            <p><label>用户来源：</label><span>{user.comefrom||""}</span></p>
                            <p><label>注册时间：</label>
                                <span>{getFormatDate("yyyy-mm-dd hh:ii",user.regtime)}</span></p>
                            <p><label>标&emsp;&emsp;签：</label><em ref={(c)=>this.userTag=c}>{userTags}
                                <span style={{color:"#1AA0E5",cursor:"pointer"}}
                                      onClick={()=>this.addLabel(user.userid)}>添加</span></em></p>
                            <p className="note-field"><label>备&emsp;&emsp;注： </label>
                                <span>{user.remark||""}</span></p>
                        </div>
                    </div>
                    <div className="order-info" ref={(c)=>this.block2=c}>
                        <h2>{this.props.type=="1"?"接机信息":"送机信息"}</h2>
                        <div className="up-section">
                            <p><label>{this.props.type=="1"?"接机司机":"送机司机"}：</label>
                                <span style={{color:"#323232"}}>{driver.realname}</span></p>
                            <p><label>司机手机：</label>
                                <span style={{color:"#323232"}}>{driver.phoneno}</span></p>
                            <p><label>车辆信息：</label>
                                <span style={{color:"#323232"}}>{driver.carbrand} {driver.carno}
                                {driver.grade}</span></p>
                        </div>
                        <div className="down-section">
                            <p><label>预约服务时间：</label><span>{getFormatDate("yyyy-mm-dd hh:ii",o.bookingtime)}</span></p>
                            <p><label>分配司机时间：</label><span>{getFormatDate("yyyy-mm-dd hh:ii",o.dispatchtime)}</span></p>
                            <p><label>开始服务时间：</label><span>{getFormatDate("yyyy-mm-dd hh:ii",o.starttime)}</span></p>
                            <p><label>服务完成时间：</label><span>{getFormatDate("yyyy-mm-dd hh:ii",o.finishtime)}</span></p>
                        </div>
                    </div>
                    <div className="order-info" ref={(c)=>this.block3=c}>
                        <h2>支付&评价</h2>
                        <div className="up-section">
                            <p><label>支付金额：</label>
                                <span style={{color:"#323232"}}>{o.realfee||""}</span></p>
                            <p><label>支付时间：</label>
                                <span style={{color:"#323232"}}>{getFormatDate("yyyy-mm-dd hh:ii",o.paytime)}</span></p>
                            <p><label>支付方式：</label>
                                <span style={{color:"#323232"}}>{o.paytype||""}</span></p>
                        </div>
                        <div className="down-section">
                            <p><label>评价时间：</label>
                                <span>{getFormatDate("yyyy-mm-dd hh:ii",cmt.createtime)}</span></p>
                            <p><label>评价星级：</label><span>{cmtStars}</span></p>
                            <p><label>评价内容：</label><span>{cmt.content||""}</span></p>
                        </div>
                    </div>
                    <div className="order-info" style={{width:494}} ref={(c)=>this.block4=c}>
                        <h2>发票信息</h2>
                        <div className="up-section">
                            <p><label>开票金额：</label>
                                <span style={{color:"#323232"}}>{rece.money||""}</span></p>
                            <p><label>开票抬头：</label>
                                <span style={{color:"#323232"}}>{rece.receipthead||""}</span></p>
                            <p><label>开票内容：</label>
                                <span style={{color:"#323232"}}>{rece.receiptcontent||""}</span></p>
                        </div>
                        <div className="down-section">
                            <p><label>收&ensp;件&ensp;人：</label>
                                <span>{rece.receivepersopn||""}</span></p>
                            <p><label>收件电话：</label><span>{rece.receiptphoneno||""}</span></p>
                            <p><label>收件地址：</label><span>{rece.address||""}</span></p>
                        </div>
                    </div>
                    <div className="service-note" style={{width:"100%",borderRightWidth:0}}>
                        <p>客服备注：<img src="/admin/img/icon/13_1.png" onClick={this.addRemark}
                                     style={{color:"#1AA0E5",cursor:"pointer"}} /></p>
                        {serviceRemark}
                    </div>
                </div>
            </section>
        );
    }
});
