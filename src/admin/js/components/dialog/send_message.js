 import React from 'react';
 import ReactDOM from 'react-dom';
 import WarnTip from '../dialog/warn_tip';
 export default React.createClass({
     getInitialState(){return {};},
     componentWillMount(){
         let mask=document.getElementById("dialogContainer");
         mask.style.display="block";
     },
     showWarnTip(msg){
         let mask=document.getElementById("dialogContainer");
         ReactDOM.render(<WarnTip msg={msg}/>, mask);
     },
     cancel(){
         let mask=document.getElementById("dialogContainer");
         ReactDOM.render(<i/>, mask);
         mask.style.display="none";
     },
     ensure(){
        let serialnumber=this.props.number;
        let url="/admin/api/orders/send_sms?serialnumber="+serialnumber+"&messagetype="+this.state.type;
        console.log("发送短信url",url);
        fetch(url,{credentials: 'include'}).then(function(res){
            console.log("发送短信响应："+res.status);
            if(+res.status < 400){
                return res.text();
            }else {
                throw new Error("服务异常");
            }
        }).then((str)=>{
            console.log(str);
            try {
                let obj=JSON.parse(str);
                if(obj.code==0){
                    this.showWarnTip(obj.msg);
                }else {
                    this.showWarnTip(obj.msg);
                }
            }catch(e){
                this.showWarnTip("数据异常");
            }
        }).catch(function(e) {
            this.showWarnTip("请求异常");
            console.trace('错误:', e);
        });
    },
    handleRadio(e){
        this.setState({type:e.target.value});
    },
    render(){
        return(
            <div className="dialog">
                <h2 className="title">发送短信<i onClick={this.cancel}/></h2>
                <div className="dialog-service-reply">
                    <textarea placeholder="请输入短信内容" ref={(c)=>this.reply=c}/>
                    <p className="msg-type">
                        <span><input onClick={this.handleRadio} type="radio" value="confirm"
                                     name="visibility" />订单确认短信</span>
                        <span><input onClick={this.handleRadio} type="radio" value="longteng_hongqiao"
                                     name="visibility" />虹桥车辆报备</span>
                        <span><input onClick={this.handleRadio} type="radio" value="flight_correction"
                                     name="visibility" />航班有误提醒</span>
                    </p>
                    <p className="msg-type">
                        <span><input onClick={this.handleRadio} type="radio" value="flight_update"
                                     name="visibility" />航班填写提醒</span>
                        <span><input onClick={this.handleRadio} type="radio" value="order_payment"
                                     name="visibility" />支付提醒</span>
                    </p>
                </div>
                <section className="btn">
                    <button onClick={this.cancel}>取消</button>
                    <button onClick={this.ensure}>发送</button>
                </section>
            </div>
        );
    }
});
