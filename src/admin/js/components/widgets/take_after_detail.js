import React from 'react';
import ReactDOM from 'react-dom';
import AddRemark from '../dialog/add_remark';
import WarnTip from '../dialog/warn_tip';
import Label from "../dialog/customer_label";
import EditUser from "../dialog/edit_user_info";
import ImgScroll from '../widgets/img_scroll';
import {getFormatDate,optState} from '../../util';
export default React.createClass({
    getInitialState(){
        return{blocks:[],first:true};
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

    addRemark(){
        let mask=document.getElementById("dialogContainer");
        ReactDOM.render(<AddRemark reload={this.loadOrderDetail}
                                   url="/jsj/system/addremark" number={this.props.number}/>, mask);
    },

    render(){
        let o=this.state.orderDetail||{};
        let user=o.userinfo||{};
        let moreService=o.serviceorders||[];
        let driver=o.driverinfo||{};
        let cmt=o.commentinfo||{};

        let type1=(moreService[0]||{}).servicetype;
        let wash=moreService[0]||{},oil=moreService[1]||{};
        if(type1==10) {
            oil=moreService[0]||{};
            wash=moreService[1]||{};
        }
        let wColor=(wash.status || wash.status===0)?(wash.status===0?"#f00":"#0f0"):"#323232";
        let oColor=(oil.status || oil.status===0)?(oil.status===0?"#f00":"#0f0"):"#323232";
        let washConfig=wash.config,oilConfig=oil.config;
        let washIntro=washConfig?(washConfig.rainwashing==1?"下雨也洗车":"下雨不洗车"):"无";
        let oilIntro=oilConfig?(oilConfig.oiltype||"")+" "+(oilConfig.oillabel||"")+" "+(oilConfig.money||""):"无";
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
        let s=o.status;
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
                    <div className="user-info" ref={(c)=>this.state.blocks[0]=c}>
                        <h2>用户信息</h2>
                        <figure className="user-basic">
                            <img src={user.avater||"/duck/img/userheadimg.png"}/>
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
                    <div className="order-info" ref={(c)=>this.state.blocks[1]=c}>
                        <h2>保养信息</h2>
                        <div className="up-section">
                            <p><label>车辆里程数：</label>
                                <span style={{color:"#323232"}}>58623 km</span></p>
                            <p><label>司机已推荐，理由：</label>
                                <span style={{color:"#323232"}}>已到保养里程</span></p>
                            <p><label>上次保养时间：</label>
                                <span style={{color:"#323232"}}>2015-12-20</span>
                                <img src="/duck/img/icon/13_1.png"
                                     style={{color:"#1AA0E5",cursor:"pointer",verticalAlign:"middle",marginLeft:15}} /></p>
                        </div>
                        <div className="down-section">
                            <p>向客户推荐保养</p>
                            <p>客户确认需保养</p>
                            <p>无需保养</p>
                        </div>
                    </div>
                    <div className="service-info" ref={(c)=>this.state.blocks[2]=c}>
                        <h2>更多服务</h2>
                        <div className="extra-service">
                            <p><label>洗车：</label>
                                {washConfig?<span className={optState(7,s)?"enable":"disabled"} style={{color:wColor}}
                                                  onClick={()=>this.ensureExtraService("wash",user.realname,user.phoneno,wash.serviceorderid,washIntro)}>
                                        {washIntro}</span>:<span style={{color:wColor}}>{washIntro}</span>}
                                {washConfig?(<em className={optState(5,s)?"enable":"disabled"}><i onClick={
                                    ()=>this.editWashService("mod","/admin/api/serviceorder/edit_washing")}>编辑</i>&ensp;
                                    <i onClick={()=>this.cancelExtraService(wash.serviceorderid)}>取消</i></em>):
                                    (<em className={optState(5,s)?"enable":"disabled"}
                                         onClick={()=>this.editWashService("add","/admin/api/serviceorder/add_washing")}>添加</em>)}
                            </p>
                            <p><label>加油：</label>
                                {oilConfig?<span className={optState(7,s)?"enable":"disabled"} style={{color:oColor}}
                                                 onClick={()=>this.ensureExtraService("oil",user.realname,user.phoneno,oil.serviceorderid,oilIntro)}>
                                        {oilIntro}</span>:<span style={{color:oColor}}>{oilIntro}</span>}
                                {oilConfig?(<em className={optState(4,s)?"enable":"disabled"}>
                                    <i onClick={()=>this.editOilService("mod","/admin/api/serviceorder/edit_oil")}>编辑</i>&ensp;
                                    <i onClick={()=>this.cancelExtraService(oil.serviceorderid,"oil")}>取消</i></em>):
                                    (<em className={optState(4,s)?"enable":"disabled"}
                                         onClick={()=>this.editOilService("add","/admin/api/serviceorder/add_oil")}>添加</em>)}
                            </p>
                        </div>
                    </div>
                    <div className="car-retain-info" ref={(c)=>this.state.blocks[3]=c}>
                        <h2>车辆停放</h2>
                        <div className="move-car">
                            <ImgScroll imgs={[]} />
                            <section className="in-garage">
                                <p><label>车位：</label><span>P102</span></p>
                                <p><label>钥匙位：</label><span>302</span></p>
                                <p><label>入库时间：</label><br/><span>2017-04-07 18:30</span></p>
                            </section>
                        </div>
                    </div>
                </div>
                <div className="notes">
                    <div className="service-note" style={{width:"100%"}}>
                        <p>备注信息：<img src="/duck/img/icon/13_1.png" onClick={this.addRemark}
                                     style={{color:"#1AA0E5",cursor:"pointer"}} /></p>
                        {serviceRemark}
                    </div>
                </div>
            </section>
        );
    }
});
