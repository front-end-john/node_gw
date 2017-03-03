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
    handleSelectSmsType(val){
       this.setState({type:val});
       let template="";
       if(val=="confirm"){
           template="【飞泊通】您好，已经收到您的订单。{1}。我们会在您{2}为您分配泊车司机，" +
               "如有疑问请拨打24小时服务热线：{3}。祝您旅途愉快，一切顺利！";
       }else if(val=="longteng_hongqiao"){
           template="【龙腾出行】你已获取 虹桥机场66号通道／NO.66 Tunnel 的通行权限，请向机场安保人员出示此确认短信，" +
               "并通过车牌识别道闸即可。请于2017/2/10 13:20:00 -> 2017/2/11 13:20:00期内进入使用，可使用次数不足" +
               "或不在使用期效内，车牌识别失败将不予放行。";
       }else if(val=="flight_correction"){
           template="亲爱的旅客~您好，感谢您使用飞泊通的服务，我们留意到您的返程航班信息有误，请通过飞泊通公众号或者APP更新返程信息，" +
               "如有疑问请拨打24小时服务热线：400-807-9936。祝您旅途愉快，一切顺利！请勿回复此短信";
       }else if(val=="flight_update"){
           template="亲爱的旅客~您好，感谢您使用飞泊通的服务，如果您的返程航班已确定，请您在“飞泊通”的微信或APP上填写返程航班信息，" +
               "我们将在您航班落地前为您安排送车司机，如有疑问请拨打24小时服务热线：400-807-9936。祝您旅途愉快，一切顺利！" +
               "请勿回复此短信";
       }else if(val=="order_payment"){
           template="亲爱的旅客~您好，感谢您使用飞泊通的服务，您直接搜索关注“飞泊通”微信，在个人中心-我的订单中查询您的订单支付即可，" +
               "如有疑问请拨打24小时服务热线：400-807-9936。祝您生活愉快，一切顺利！请勿回复此短信";
       }
       this.setState({template});
    },
    render(){
        let type=this.state.type;
        let smsArr=[{text:'订单确认短信',value:"confirm"},{text:'虹桥车辆报备',value:"longteng_hongqiao"},
            {text:'航班有误提醒',value:"flight_correction"},{text:'航班填写提醒',value:"flight_update"},
            {text:'支付提醒',value:"order_payment"},];
        let list=smsArr.map((item,index)=>{
            return( <li key={index} onClick={()=>this.handleSelectSmsType(item.value)}
                        className={type==item.value?"selected":""}>{item.text}</li>);
        });
        return(
            <div className="dialog">
                <h2 className="title">发送短信<i onClick={this.cancel}/></h2>
                <ul className="customer-label" >
                    {list}<li className="empty-label"/>
                </ul>
                <p className="msg-template" >
                    {this.state.template}
                </p>
                <section className="btn">
                    <button onClick={this.cancel}>取消</button>
                    <button onClick={this.ensure}>发送</button>
                </section>
            </div>
        );
    }
});
