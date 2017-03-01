import React from 'react';
import ReactDOM from 'react-dom';
import WarnTip from '../dialog/warn_tip';
let Ensure=React.createClass({
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
        let url=this.props.url;
        let order_id=this.props.order_id;
        if(order_id){
            /**
             *关闭或展现评论
             */
            let showpublic=this.props.public_show;
            url+="?order_id="+order_id+"&showpublic="+showpublic;
            console.log("关闭或展现评论url",url);
            fetch(url,{credentials: 'include'}).then((res)=>{
                console.log("关闭或展现评论响应状态："+res.status);
                if(+res.status < 400){
                    return res.text();
                }else {
                    throw new Error("服务异常");
                }
            }).then((str)=>{
                //console.log(str);
                try {
                    let obj=JSON.parse(str);
                    if(obj.code==0){
                        this.props.change();
                        this.cancel();
                    }else {
                        this.showWarnTip(obj.msg);
                    }
                }catch(e){
                    this.showWarnTip("数据异常");
                }
            }).catch((e)=>{
                this.showWarnTip("请求异常");
                console.trace('错误:', e);
            });
        }
        let coupon_id=this.props.coupon_id;
        if(coupon_id){
            /**
             *删除优惠券
             */
            url+="?couponid="+coupon_id;
            console.log("删除优惠券url",url);
            fetch(url,{credentials: 'include'}).then((res)=>{
                console.log("删除优惠券响应："+res.status);
                if(+res.status < 400){
                    return res.text();
                }else {
                    throw new Error("服务异常");
                }
            }).then((str)=>{
                //console.log(str);
                try {
                    let obj=JSON.parse(str);
                    if(obj.code==0){
                        this.props.reload();
                        this.cancel();
                    }else {
                        this.showWarnTip(obj.msg);
                    }
                }catch(e){
                    this.showWarnTip("数据异常");
                }
            }).catch((e)=>{
                this.showWarnTip("请求异常");
                console.trace('错误:', e);
            });
        }
        let user_id=this.props.user_id;
        if(user_id){
            /**
             *取消用户星级
             */
            url+="?userid="+user_id;
            console.log("取消星级url",url);
            fetch(url,{credentials: 'include'}).then((res)=>{
                console.log("取消用户星级响应："+res.status);
                if(+res.status < 400){
                    return res.text();
                }else {
                    throw new Error("服务异常");
                }
            }).then((str)=>{
                //console.log(str);
                try {
                    let obj=JSON.parse(str);
                    if(obj.code==0){
                        this.props.reload();
                        this.cancel();
                    }else {
                        this.showWarnTip(obj.msg);
                    }
                }catch(e){
                    this.showWarnTip("数据异常");
                }
            }).catch((e)=>{
                this.showWarnTip("请求异常");
                console.trace('错误:', e);
            });
        }
        let number=this.props.serialnumber;
        if(number){
            url+="?serialnumber="+number;
            console.log("电话确认url",url);
            fetch(url,{credentials: 'include'}).then((res)=>{
                console.log("电话确认响应："+res.status);
                if(+res.status < 400){
                    return res.text();
                }else {
                    throw new Error("服务异常");
                }
            }).then((str)=>{
                //console.log(str);
                try {
                    let obj=JSON.parse(str);
                    if(obj.code==0){
                        this.props.reload();
                        this.showWarnTip(obj.msg);
                    }else {
                        this.showWarnTip(obj.msg);
                    }
                }catch(e){
                    this.showWarnTip("数据异常");
                }
            }).catch((e)=>{
                this.showWarnTip("请求异常");
                console.trace('错误:', e);
            });
        }
        let option=this.props.option;
        if(option=="logout"){
            localStorage.removeItem("AdminInfo");
            location.reload();
        }
    },
    render(){
        return(
            <div className="dialog">
                <h2 className="title">{this.props.title}<i onClick={this.cancel}/></h2>
                <p className="dialog-ensure">{this.props.content}</p>
                <section className="btn">
                    <button onClick={this.cancel}>取消</button>
                    <button onClick={this.ensure}>确认</button>
                </section>
            </div>
        );
    }
});

export default Ensure;
