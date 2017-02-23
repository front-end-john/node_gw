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
         //let type=this.props.type;
         let stars=this.star.value;
         let phoneno=this.phone.value.trim();
         let remark=this.remark.value.trim();

         let url=this.props.url+"?";
         url+=queryStr.stringify({stars,phoneno,remark});
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
             this.showWarnTip("请求异常");
             console.trace('请求错误:', e);
         });
     },

     render(){
        let type=this.props.type;
        return(
            <div className="dialog">
                <h2 className="title">{type=="add"?"新增重要用户":"编辑重要用户"}<i onClick={this.cancel}/></h2>
                <div className="dialog-important-user">
                    <p><em>用户手机：</em><input placeholder="请输入手机号"
                                            defaultValue={this.props.phone} ref={(c)=>this.phone=c}/></p>
                    <p><em>用户星级：</em>
                        <select defaultValue={this.props.stars} ref={(c)=>this.star=c}>
                            <option value="">请选择</option>
                            <option value="1" >&#9733;</option>
                            <option value="2" >&#9733;&#9733;</option>
                        </select><i className="select-arrow"/>
                    </p>
                    <p><em>备&emsp;&emsp;注：</em><textarea placeholder="填写备注"
                                                     ref={(c)=>this.remark=c} defaultValue={this.props.remark} /></p>
                </div>
                <section className="btn">
                    <button onClick={this.cancel}>取消</button>
                    <button onClick={this.ensure}>确认</button>
                </section>
            </div>
        );
     }
 });
