 import React from 'react';
 import ReactDOM from 'react-dom';
 import WarnTip from '../dialog/warn_tip';
 export default React.createClass({
     componentWillMount(){
         let mask=document.getElementById("dialogContainer");
         mask.style.display="block";
     },
     showWarnTip(msg){
         let mask=document.getElementById("dialogContainer");
         if(msg===null){
             ReactDOM.render(<i/>, mask);
             mask.style.display="none";
         }else {
             ReactDOM.render(<WarnTip msg={msg}/>, mask);
         }
     },
     cancel(){
         let mask=document.getElementById("dialogContainer");
         ReactDOM.render(<i/>, mask);
         mask.style.display="none";
     },
     ensure(){
         let serialnumber=this.props.number;
         let rainwashing=this.washType.value,remark=this.remark.value;
         let url=this.props.url+"?";
         if(this.props.type=="add"){
             url+=queryStr.stringify({serialnumber,rainwashing,remark});
         }else {
             let serviceorderid=this.props.soid;
             url+=queryStr.stringify({serviceorderid,rainwashing,remark});
         }
         console.log("增改洗车服务url",url);
         fetch(url,{credentials: 'include'}).then((res)=>{
             if(+res.status < 400){
                 return res.text();
             }else {
                 throw new Error("服务端异常");
             }
         }).then((str)=>{
             try{
                 let obj=JSON.parse(str);
                 if(obj.code==0){
                     this.cancel();
                     this.props.reload();
                 }else {
                     this.showWarnTip(obj.msg);
                 }
             }catch(e){
                 this.showWarnTip("数据异常");
                 console.error("json数据异常：",e);
                 console.log("异常数据为：",str);
             }
         }).catch((e)=>{
             this.showWarnTip("请求错误");
             console.trace('请求错误:', e);
         });
     },
     render(){
        let type=this.props.type;
        let eidtType=type=="add"?"添加":"修改";
        return(
            <div className="dialog">
                <h2 className="title">{eidtType}洗车服务<i onClick={this.cancel}/></h2>
                <div className="dialog-important-user">
                    <p><em>洗车服务：</em>
                        <select ref={(c)=>this.washType=c} defaultValue={this.props.rainwashing}>
                            <option value="">请选择服务类型</option>
                            <option value="0" >返程若下雨不洗车</option>
                            <option value="1" >返程下雨也需洗车</option>
                        </select><i className="select-arrow"/>
                    </p>
                    <p><em>备&emsp;&emsp;注：</em>
                        <textarea placeholder="填写备注" ref={(c)=>this.remark=c}
                                  defaultValue={this.props.remark}/></p>
                </div>
                <section className="btn">
                    <button onClick={this.cancel}>取消</button>
                    <button onClick={this.ensure}>确认</button>
                </section>
            </div>
        );
     }
 });
