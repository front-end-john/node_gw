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
        let chserialnumber=this.props.number;
        let exceedmileage=parseFloat(this.miles||0);
        if(exceedmileage<=0){
            this.showWarnTip("里程数不能为空且不小于0！");return 0
        }
        let url=this.props.url+"?";
        url+=queryStr.stringify({chserialnumber,exceedmileage});
        console.log("编辑超出里程数接口",url);
        fetch(url,{credentials: 'include'}).then((res)=>{
            console.log("超出里程数接口响应："+res.status);
            if(+res.status < 400){
                return res.json();
            }else{
                throw new Error("服务异常");
            }
        }).then((obj)=>{
            if(obj.code===0){
                this.showWarnTip(obj.message);
                this.props.reload();
            }else {
                this.showWarnTip(obj.message,2);
            }
        }).catch((e)=>{
            this.showWarnTip("网络请求异常！",2);
            console.warn('异常接口：', url,"异常对象：",e);
        });
    },
    render(){
        return(
            <div className="dialog">
                <h2 className="title">编辑超出保养标准里程数<i onClick={this.cancel}/></h2>
                <div className="dialog-flight-info">
                    <p><em>超出保养标准里程数：</em>
                        <input type="number"  placeholder="输入公里数" onChange={e=>this.miles=e.target.value} /></p>
                </div>
                <section className="btn">
                    <button onClick={this.cancel}>取消</button>
                    <button onClick={this.ensure}>确认</button>
                </section>
            </div>
        );
    }
});
