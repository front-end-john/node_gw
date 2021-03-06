 import React from 'react';
 import ReactDOM from 'react-dom';
 import WarnTip from '../dialog/warn_tip';
 export default React.createClass({
    componentWillMount(){
        let mask=document.getElementById("dialogContainer");
        mask.style.display="block";
    },
    cancel(){
        let mask=document.getElementById("dialogContainer");
        ReactDOM.render(<i/>, mask);
        mask.style.display="none";
    },
    showWarnTip(msg,floor=1){
        let dialogContainer="dialogContainer";
        if(floor==2) dialogContainer="secDialogContainer";
        let mask=document.getElementById(dialogContainer);
        if(msg===null){
            ReactDOM.render(<i/>, mask);
            mask.style.display="none";
        }else {
            ReactDOM.render(<WarnTip dc={dialogContainer} msg={msg}/>, mask);
        }
    },
    validValue(val,reg,msg){
         if(val===0){
             return true;
         }else if(!val){
             this.showWarnTip(msg[0],2);
             return false;
         }else if(reg && !reg.test(val)){
             this.showWarnTip(msg[1],2);
             return false;
         }else {
             return true;
         }
    },
    ensure(){
        let reg=/^[\u4E00-\u9FA5][A-Z][\da-zA-Z]{5,6}$/;
        let carno=this.carno.value,color=this.color.value,brand=this.brand.value;
        if(!this.validValue(carno,reg,["车牌号不能为空！","车牌号不合法！"])) return 0;
        if(!this.validValue(color,null,["车辆颜色不能为空！"])) return 0;
        if(!this.validValue(brand,null,["车辆品牌不能为空！"])) return 0;
        let url=this.props.url+"?"+queryStr.stringify({carid:this.props.cid,carno,color,brand});
        console.log("修改车辆url",url);
        fetch(url,{credentials: 'include'}).then((res)=>{
            console.log("修改车辆响应：",res.status);
            if(+res.status < 400){
                return res.text();
            }else {
                throw new Error("服务异常");
            }
        }).then((str)=>{
            let obj=JSON.parse(str);
            if(obj.code==0){
                this.props.reload();
                this.cancel();
            }else {
                this.showWarnTip(obj.msg);
            }
        }).catch((e)=>{
            this.showWarnTip("网络请求异常！");
            console.trace('错误:', e);
        });
    },
    render(){
        return(
            <div className="dialog">
                <h2 className="title">修改车辆信息<i onClick={this.cancel}/></h2>
                <div className="dialog-modify-car">
                    <p><em>车牌号码：</em><input  defaultValue={this.props.carno} ref={(c)=>this.carno=c}/></p>
                    <p><em>车辆颜色：</em><input  defaultValue={this.props.color} ref={(c)=>this.color=c}/></p>
                    <p><em>车辆品牌：</em><input  defaultValue={this.props.brand} ref={(c)=>this.brand=c}/></p>
                </div>
                <section className="btn">
                    <button onClick={this.cancel}>取消</button>
                    <button onClick={this.ensure}>确认</button>
                </section>
            </div>
        );
    }
});
