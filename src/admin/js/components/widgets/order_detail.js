import React from 'react';
import ReactDOM from 'react-dom';
import TakeCar from '../order_process/take_car';
import MoveCar from '../order_process/move_car';
import InGarage from '../order_process/in_garage';
import SendCar from '../order_process/send_car';
import Evaluation from '../order_process/evaluation';

import {decDatetime,getStateMsg} from '../../util'

let OrderDetail=React.createClass({
    getInitialState(){
        return{
            p_item:'p1'
        };
    },
    componentDidMount(){
        ReactDOM.render(<TakeCar /> , this.refs.processInfo);
        let url="/admin/api/orders/orderdetails?serialnumber="+this.props.number;
        fetch(url).then(function(res){
            console.log("查询订单详情响应状态："+res.status);
            if(+res.status < 400){
                return res.text();
            }else {
                throw new Error("服务异常");
            }
        }).then((str)=>{
            console.log(str);
            let obj=JSON.parse(str);
            console.log(obj);
            this.setState({orderDetail:obj.order});
        }).catch(function(e) {
            console.trace('错误:', e);
        });
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
        let o=this.state.orderDetail;
        let level=[],registertime,serviceRemark,driverRemark;
        if(o){
           let {year,month,day,hour,minute} = decDatetime(o.user.registertime);
            registertime=year+'-'+month+'-'+day+' '+hour+':'+minute;
            for(let i=0;i<o.user.stars;i++){
                level[i]=(<span key={i} style={{color:'red'}}>&#9733;</span>)
            }
            serviceRemark=o.serviceorders[0].serviceremark.map((item,index)=>{
                return (<p key={index}>{item}</p>);
            });
            driverRemark=o.drivernote.map((item,index)=>{
                return (<p key={index}>{item.time}&ensp;
                    <span style={{color:'yellow'}}>{item.driver_name}:&ensp;</span>{item.remark}</p>);
            });
        }

        return(
            <section className="detail-section">
                <p className="order-brief">
                    <label style={{paddingLeft:'20px'}}>订单号: </label><span>{o?o.serialnumber:''}</span>
                    <label style={{paddingLeft:'20px'}}>下单时间: </label><span>{o?o.createtime:''}</span>
                    <label style={{paddingLeft:'20px'}}>来源: </label><span>{o?o.comefrom:''}</span>
                    <label style={{paddingLeft:'20px'}}>状态: </label><span style={{color:'red'}}>{o?getStateMsg(o.status):""}</span>
                </p>
                <div className="order-main">
                    <div className="user-info">
                        <h2>用户信息</h2>
                        <figure className="user-basic">
                            <img src={o&&o.user.avater?o.user.avater:"/admin/img/userheadimg.png"}/>
                            <figcaption>
                                <p>姓名: <span style={{color:"#1AA0E5"}}>{o?o.user.realname:''}</span></p>
                                <p>性别: <span>{o?(o.user.sex==1?"男":"女"):''}</span></p>
                                <p>手机: <span>{o?o.user.phoneno:''}</span></p>
                            </figcaption>
                        </figure>
                        <div className="user-other">
                            <p><label>重要等级:</label>{level}</p>
                            <p><label>使用次数:</label><span>{o?o.user.bookcount:''}</span></p>
                            <p><label>用户来源:</label><span>{o?o.user.comefrom:''}</span></p>
                            <p><label>注册时间:</label><span>{registertime}</span></p>
                            <p><label>标&emsp;&emsp;签:</label><span style={{color:"#1AA0E5"}}>添加</span></p>
                            <p className="note-field"><label>备&emsp;&emsp;注: </label>
                                <span>{o?o.user.remark:''}</span></p>
                        </div>
                    </div>
                    <div className="order-info">
                        <h2>预约信息</h2>
                        <div className="up-section">
                            <p><label>车辆信息:&ensp;</label>
                                <span style={{color:"#1AA0E5"}}>
                                    {o?o.car.carno+" "+o.car.color+o.car.brand:""}</span></p>
                            <p><label>预约接车时间:&ensp;</label>
                                <span style={{color:"#1AA0E5"}}>{o?o.bookingtime:""}</span></p>
                            <p><label>去程航站楼:&ensp;</label>
                                <span>{o?o.parkingterminalname:""}</span></p>
                        </div>
                        <div className="down-section">
                            <p><label>用户更新时间:&ensp;</label><span>2016-12-12 18:45</span></p>
                            <p className="back-flight">
                                <label>返程航班:&ensp;</label>
                                <span style={{color:"#1AA0E5"}}>
                                    {o?o.returningflight+" "+o.returningdate:""}</span>
                                <img src="/admin/img/icon/10_1.png" />
                            </p>
                            <p><label>预计取车时间:&ensp;</label>
                                <span style={{color:"#1AA0E5"}}>{o?o.returningtime:""}</span></p>
                            <p><label>回程航站楼:&ensp;</label><span>{o?o.returningterminalname:""}</span></p>
                            <p className="note-field"><label>渠道备注:</label>
                                <span>{o?o.remark:""}</span></p>
                        </div>
                    </div>
                    <div className="service-info">
                        <h2>更多服务</h2>
                        <div className="extra-service">
                            <p><label>洗车:</label><span>
                                {o&&o.serviceorders[0].config.rainwashing=="1"?"下雨也洗车":""}</span>
                                <em>取消</em><em>编辑</em>
                            </p>
                            <p style={{marginBottom:'62px'}}><label>加油:</label><span>无</span>
                                <em>添加</em>
                            </p>
                        </div>
                        <p className="note-field"><label>用户备注:</label><span>{o?o.userremark:""}</span></p>
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
                        <p>客服备注:<img src="/admin/img/icon/13_1.png"/></p>
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