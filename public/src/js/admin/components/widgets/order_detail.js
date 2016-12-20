import React from 'react';
import ReactDOM from 'react-dom';
import TakeCar from '../order_process/take_car';
import MoveCar from '../order_process/move_car';
import InGarage from '../order_process/in_garage';
import SendCar from '../order_process/send_car';
import Evaluation from '../order_process/evaluation';

let OrderDetail=React.createClass({
    getInitialState(){
        "use strict";
        return{
            p_item:'p1'
        };
    },
    componentDidMount(){
        ReactDOM.render(<TakeCar /> , this.refs.processInfo);
    },
    handleSwitch(e){
        "use strict";
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
        "use strict";
        return(
            <section className="detail-section">
                <p className="order-brief">
                    <label style={{paddingLeft:'20px'}}>订单号: </label><span>8745456765454</span>
                    <label style={{paddingLeft:'20px'}}>下车时间: </label><span>2016-12-12 14:12</span>
                    <label style={{paddingLeft:'20px'}}>来源: </label><span>携程</span>
                    <label style={{paddingLeft:'20px'}}>状态: </label><span style={{color:'red'}}>未支付</span>
                </p>
                <div className="order-main">
                    <div className="user-info">
                        <h2>用户信息</h2>
                        <figure className="user-basic">
                            <img src="/img/admin/userheadimg.png"/>
                            <figcaption>
                                <p>姓名: <span style={{color:"#1AA0E5"}}>种小麦</span></p>
                                <p>性别: <span>男</span></p>
                                <p>手机: <span>145785245</span></p>
                            </figcaption>
                        </figure>
                        <div className="user-other">
                            <p><label>重要等级:</label><span style={{color:'red'}}>&#9733;</span></p>
                            <p><label>使用次数:</label><span>5</span></p>
                            <p><label>用户来源:</label><span>百度</span></p>
                            <p><label>注册时间:</label><span>2016-11-18 18:45</span></p>
                            <p><label>标&emsp;&emsp;签:</label><span style={{color:"#1AA0E5"}}>添加</span></p>
                            <p className="note-field"><label>备&emsp;&emsp;注: </label>
                                <span>阿斯顿啊说不定阿什顿阿斯顿啊啥的吧啊监控设备的</span></p>
                        </div>
                    </div>
                    <div className="order-info">
                        <h2>预约信息</h2>
                        <div className="up-section">
                            <p><label>车辆信息:&ensp;</label>
                                <span style={{color:"#1AA0E5"}}>奥457887 白色宝马</span></p>
                            <p><label>预约接车时间:&ensp;</label>
                                <span style={{color:"#1AA0E5"}}>2016-12-12 18:45</span></p>
                            <p><label>去程航站楼:&ensp;</label>
                                <span>广州白云国际机场T2</span></p>
                        </div>
                        <div className="down-section">
                            <p><label>用户更新时间:&ensp;</label><span>2016-12-12 18:45</span></p>
                            <p className="back-flight">
                                <label>返程航班:&ensp;</label>
                                <span style={{color:"#1AA0E5"}}>hu98547_2016-11-12</span>
                                <img src="/img/admin/icon/10_1.png" />
                            </p>
                            <p><label>预计取车时间:&ensp;</label>
                                <span style={{color:"#1AA0E5"}}>2016-12-14 17:25</span></p>
                            <p><label>回程航站楼:&ensp;</label><span>广州白云国际机场T1</span></p>
                            <p className="note-field"><label>渠道备注:</label>
                                <span>机场重要客户，无需电话联系ask电话啊开始觉得还ask大家ask觉得喀什觉得还</span></p>
                        </div>
                    </div>
                    <div className="service-info">
                        <h2>更多服务</h2>
                        <div className="extra-service">
                            <p><label>洗车:</label><span>下雨天也洗车</span>
                                <em>取消</em><em>编辑</em>
                            </p>
                            <p style={{marginBottom:'62px'}}><label>加油:</label><span>无</span>
                                <em>添加</em>
                            </p>
                        </div>
                        <p className="note-field"><label>用户备注:</label><span>无需</span></p>
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
                        <div ref="processInfo">

                        </div>
                    </div>
                    <div className="service-note">
                        <p>客服备注:<img src="/img/admin/icon/13_1.png"/></p>
                        <p>2016-11-18 18:34&ensp;阿贾克斯的:&ensp;啊开始就</p>
                        <p>2016-11-18 18:34&ensp;阿贾克斯的:&ensp;啊手机导航阿什顿啊啥的杀卡森家的</p>
                    </div>
                    <div className="driver-note">
                        <p>司机备注:</p>
                        <p>2016-11-18 18:34&ensp;<span style={{color:'yellow'}}>接车吴晓华:&ensp;</span>啊开始就</p>
                        <p>2016-11-18 18:34&ensp;<span style={{color:'#1AA0E5'}}>送车吴晓华:&ensp;</span>啊手机导航阿什顿啊啥的杀卡森家的</p>
                    </div>
                </div>
            </section>
        );
    }
});

export default OrderDetail;