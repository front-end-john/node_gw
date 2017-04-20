 import React from 'react';
 import ReactDOM from 'react-dom';
 import WarnTip from '../dialog/warn_tip';
 export default React.createClass({
    getInitialState(){return {}},
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
    handleIsChecked(e){
        let node=e.target;
        this.state.isCharge=node.checked;
    },
    ensure(){
        let url=this.props.url+"?";
        let chserialnumber=this.props.number;
        let cancelreason=this.cancelReason,chargemoney="",chargereason="";
        if(!cancelreason){
            this.showWarnTip("取消原因不能为空！",2);return 0;
        }
        if(this.state.isCharge){
            chargemoney=this.cash.value;
            chargereason=this.chargeReason.value
        }
        url+=queryStr.stringify({chserialnumber,cancelreason,chargemoney,chargereason});
        console.log("取消保养接口",url);
        fetch(url,{credentials:'include'}).then((res)=>{
            console.log("取消保养响应：",res.status);
            if(+res.status < 400){
                return res.json();
            }else {
                throw new Error("服务异常");
            }
        }).then((obj)=>{
            if(obj.code === 0){
                this.showWarnTip(obj.message);
                this.props.shift("canceled");
                this.props.reload();
            }else {
                this.showWarnTip(obj.message,2);
            }
        }).catch((e)=>{
            this.showWarnTip("网络请求异常",2);
            console.warn('异常接口：', url,"异常对象：",e);
        });
    },
    render(){
        let textareaStyle={width:200,height:60,padding:10,verticalAlign:"middle"};
        return(
            <div className="dialog">
                <h2 className="title">取消保养<i onClick={this.cancel}/></h2>
                <div className="dialog-flight-info">
                    <p><em>取消保养原因：</em>
                        <textarea style={textareaStyle} placeholder="请输入原因"
                                  onChange={(e)=>this.cancelReason=e.target.value}/></p>
                    <p className="maintain-cancel">
                        <input type="checkbox" onChange={this.handleIsChecked}/>
                        <em>需要向客户收费</em></p>
                    <p className="maintain-cancel"><em>&emsp;&ensp;收费金额：</em>
                        <select defaultValue={50} ref={(c)=>this.cash=c}>
                        <option value="50">¥50.00</option>
                        <option value="100">¥100.00</option>
                        <option value="150">¥150.00</option>
                        <option value="200">¥200.00</option>
                    </select></p>
                    <p className="maintain-cancel"><em>&emsp;&ensp;收费理由：</em>
                        <select defaultValue="飞泊通服务费" ref={(c)=>this.chargeReason=c}>
                        <option value="飞泊通服务费">飞泊通服务费</option>
                        <option value="其它">其它</option>
                    </select></p>
                </div>
                <section className="btn">
                    <button onClick={this.cancel}>取消</button>
                    <button onClick={()=>this.ensure()}>确认</button>
                </section>
            </div>
        );
    }
});
