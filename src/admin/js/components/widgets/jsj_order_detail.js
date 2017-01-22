import React from 'react';
import ReactDOM from 'react-dom';
/*
import ReactDOM from 'react-dom';
import TakeCar from '../order_process/take_car';
import MoveCar from '../order_process/move_car';
import InGarage from '../order_process/in_garage';
import SendCar from '../order_process/send_car';
*/
import AddRemark from '../dialog/add_remark';
import {decDatetime} from '../../util'

export default React.createClass({
    getInitialState(){
        return{
            p_item:'p1'
        };
    },
    componentDidMount(){
        let url="/jsj/system/orderdetail?serialnumber="+this.props.number;
        fetch(url).then(function(res){
            console.log("查询订单详情响应状态："+res.status);
            if(+res.status < 400){
                return res.text();
            }else {
                throw new Error("服务异常");
            }
        }).then((str)=>{
            let obj=JSON.parse(str);
            //console.log(obj);
            this.setState({orderDetail:obj.record});
        }).catch(function(e) {
            console.trace('错误:', e);
        });
    },
    handleAddRemark(){
        let mask=document.getElementById("dialogContainer");
        ReactDOM.render(<AddRemark msg="请求接送机列表异常！"/>, mask);
    },
    render(){
        let o=this.state.orderDetail||{};
        let user=o.userinfo||{};
        let car=o.cartypeinfo||{};
        let flight=o.flightinfo||{};
        let level=[];

        let {year,month,day,hour,minute} = decDatetime(o.createtime||0);
        let {year:year2,month:mon2,day:day2,hour:hour2,minute:min2} = decDatetime(user.regtime||0);
        let time1=year+'-'+month+"-"+day+" "+hour+":"+minute;
        let time2=year2+'-'+mon2+"-"+day2+" "+hour2+":"+min2;
        for(let i=0;i<user.level||0;i++){
            level[i]=(<span key={i} style={{color:'red'}}>&#9733;</span>)
        }
        return(
            <section className="detail-section">
                <p className="order-brief">
                    <label style={{paddingLeft:'20px'}}>订单号: </label><span>{o.serialnumber||''}</span>
                    <label style={{paddingLeft:'20px'}}>下单时间: </label><span>{time1}</span>
                    <label style={{paddingLeft:'20px'}}>状态: </label><span style={{color:'red'}}>{}</span>
                    <label style={{paddingLeft:'20px'}}>取消人: </label><span>{}</span>
                    <label style={{paddingLeft:'20px'}}>取消时间: </label><span>{}</span>
                </p>
                <div className="order-main">
                    <div className="user-info" style={{width:340}}>
                        <h2>用户信息</h2>
                        <figure className="user-basic">
                            <img src={user.avater||"/admin/img/userheadimg.png"}/>
                            <figcaption>
                                <p>姓名: <span style={{color:"#1AA0E5"}}>{user.username||''}</span></p>
                                <p>性别: <span>{ user.sex||""}</span></p>
                                <p>手机: <span>{ user.phoneno||''}</span></p>
                            </figcaption>
                        </figure>
                        <div className="user-other" style={{width:340}}>
                            <p><label>重要等级:</label>{level}</p>
                            <p><label>用户来源:</label><span>{}</span></p>
                            <p><label>注册时间:</label><span>{time2}</span></p>
                            <p><label>标&emsp;&emsp;签:</label>
                                <span style={{color:"#1AA0E5"}} onClick={this.handleAddRemark}>添加</span></p>
                            <p className="note-field"><label>备&emsp;&emsp;注: </label>
                                <span>{}</span></p>
                        </div>
                    </div>
                    <div className="order-info" style={{width:340}}>
                        <h2>{this.props.type=="1"?"接机信息":"送机信息"}</h2>
                        <div className="up-section">
                            <p><label>接机司机:&ensp;</label>
                                <span style={{color:"#323232"}}>{}</span></p>
                            <p><label>司机手机:&ensp;</label>
                                <span style={{color:"#323232"}}>{}</span></p>
                            <p><label>车辆信息:&ensp;</label>
                                <span style={{color:"#323232"}}>{}</span></p>
                        </div>
                        <div className="down-section">
                            <p><label>预约服务时间:&ensp;</label><span>2016-12-12 18:45</span></p>
                            <p><label>分配司机时间:&ensp;</label><span>2016-12-12 18:45</span></p>
                            <p><label>开始服务时间:&ensp;</label><span>2016-12-12 18:45</span></p>
                            <p><label>服务完成时间:&ensp;</label><span>2016-12-12 18:45</span></p>
                        </div>
                    </div>
                    <div className="order-info" style={{width:360}}>
                        <h2>支付&评价</h2>
                        <div className="up-section">
                            <p><label>支付金额:&ensp;</label>
                                <span style={{color:"#323232"}}>{}</span></p>
                            <p><label>支付时间:&ensp;</label>
                                <span style={{color:"#323232"}}>{}</span></p>
                            <p><label>支付方式:&ensp;</label>
                                <span style={{color:"#323232"}}>{}</span></p>
                        </div>
                        <div className="down-section">
                            <p><label>评价时间:&ensp;</label><span>2016-12-12 18:45</span></p>
                            <p><label>评价星级:&ensp;</label><span>2016-12-12 18:45</span></p>
                            <p><label>评价内容:&ensp;</label><span>2016-12-12 18:45</span></p>
                        </div>
                    </div>
                    <div className="order-info" style={{width:630}}>
                        <h2>发票信息</h2>
                        <div className="up-section">
                            <p><label>开票金额:&ensp;</label>
                                <span style={{color:"#323232"}}>{}</span></p>
                            <p><label>开票抬头:&ensp;</label>
                                <span style={{color:"#323232"}}>{}</span></p>
                            <p><label>开票内容:&ensp;</label>
                                <span style={{color:"#323232"}}>{}</span></p>
                        </div>
                        <div className="down-section">
                            <p><label>收&ensp;件&ensp;人:&ensp;</label><span>2016-12-12 18:45</span></p>
                            <p><label>收件电话:&ensp;</label><span>2016-12-12 18:45</span></p>
                            <p><label>收件地址:&ensp;</label><span>2016-12-12 18:45</span></p>
                        </div>
                    </div>
                    <div className="service-note" style={{width:"100%",borderRightWidth:0}}>
                        <p>客服备注:<img src="/admin/img/icon/13_1.png"/></p>
                        {}
                    </div>
                </div>
            </section>
        );
    }
});
