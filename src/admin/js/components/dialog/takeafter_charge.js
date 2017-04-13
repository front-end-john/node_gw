 import React from 'react';
 import ReactDOM from 'react-dom';
 import WarnTip from '../dialog/warn_tip';
 export default React.createClass({
    componentWillMount(){
        let mask=document.getElementById("dialogContainer");
        mask.style.display="block";
    },
     showWarnTip(msg,floor=1){
         let dialogContainer="dialogContainer";
         if(floor===2) dialogContainer="secDialogContainer";
         let mask=document.getElementById(dialogContainer);
         if(msg===null){
             ReactDOM.render(<i/>, mask);
             mask.style.display="none";
         }else {
             ReactDOM.render(<WarnTip dc={dialogContainer} msg={msg}/>, mask);
         }
     },
    cancel(){
        let mask=document.getElementById("dialogContainer");
        ReactDOM.render(<i/>, mask);
        mask.style.display="none";
    },
    ensure(){
        let serialnumber=this.props.number;
        let money=parseFloat(this.money);
        let description=this.description;
        if(money>10000){
            showWarnTip("金额不能大于10000元",2);
            return 0;
        }else if(money < 0){
            showWarnTip("金额不能小于0元",2);
            return 0;
        }
        if(!description){
            showWarnTip("费用描述不能为空！",2);
            return 0;
        }
        let url="/admin/api/orders/set_charge_online?";
        url+=queryStr.stringify({serialnumber,money,description});
        console.log("设置保养费用url",url);
        fetch(url,{credentials: 'include'}).then((res)=>{
            console.log("设置保养费用响应："+res.status);
            if(+res.status < 400){
                return res.json();
            }else {
                throw new Error("服务异常");
            }
        }).then((obj)=>{
            this.showWarnTip(obj.msg);
        }).catch((e)=>{
            this.showWarnTip("网络请求异常！");
            console.trace('错误:', e);
        });
    },
    render(){
        let textareaStyle={width:200,height:60,padding:10,verticalAlign:"middle"};
        return(
            <div className="dialog">
                <h2 className="title">设置车后保养费用<i onClick={this.cancel}/></h2>
                <div className="dialog-flight-info">
                    <p><em>收费金额：</em>
                        <input type="number" placeholder="请输入金额" onChange={(e)=>this.money=e.target.value}/></p>
                    <p><em>费用描述：</em>
                        <textarea style={textareaStyle} placeholder="请输入描述" onChange={(e)=>this.description=e.target.value}/></p>
                </div>
                <section className="btn">
                    <button onClick={this.cancel}>取消</button>
                    <button onClick={()=>this.ensure()}>确认</button>
                </section>
            </div>
        );
    }
});
