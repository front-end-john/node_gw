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
        let url=this.props.url+"?";
        let chserialnumber=this.props.number;
        let reason=this.reason;
        if(!reason){
            this.showWarnTip("原因不可以为空！",2);return 0;
        }
        url+=queryStr.stringify({chserialnumber,reason});
        console.log("无需保养接口",url);
        fetch(url,{credentials:'include'}).then((res)=>{
            console.log("无需保养接口响应：",res.status);
            if(+res.status < 400){
                return res.json();
            }else {
                throw new Error("服务异常");
            }
        }).then((obj)=>{
            if(obj.code === 0){
                this.showWarnTip(obj.message);
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
                <h2 className="title">无需保养<i onClick={this.cancel}/></h2>
                <div className="dialog-flight-info">
                    <p><em>无需保养原因：</em>
                        <textarea style={textareaStyle} placeholder="请输入原因"
                                  onChange={(e)=>this.reason=e.target.value}/></p>
                </div>
                <section className="btn">
                    <button onClick={this.cancel}>取消</button>
                    <button onClick={()=>this.ensure()}>确认</button>
                </section>
            </div>
        );
    }
});
