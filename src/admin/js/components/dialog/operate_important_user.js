 import React from 'react';
 import ReactDOM from 'react-dom';
 import WarnTip from '../dialog/warn_tip';
 export default React.createClass({
     getInitialState(){ return {};},
     componentWillMount(){
         let mask=document.getElementById("dialogContainer");
         mask.style.display="block";
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
     handlePhoneChange(e){
         let val=e.target.value;
         if(val.length>11){
             this.phone.value=val.trim().substr(0,11);
         }
         if(/^1[0-9]{10}$/.test(val)){
             this.setState({exists:false});
             let url="/admin/api/users/userinfo?phoneno="+val;
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
                         this.setState({exists:true,user:obj.user});
                         this.star.value=obj.user.stars||"";
                         this.remark.value=obj.user.remark;
                         console.dir(obj);
                     }else {
                         console.dir(obj);
                     }
                 }catch(e){
                     console.error("json数据异常：",e);
                     console.log("异常数据为：",str);
                 }
             }).catch((e)=>{
                 console.trace('请求错误:', e);
             });
         }
     },
     cancel(){
         let mask=document.getElementById("dialogContainer");
         ReactDOM.render(<i/>, mask);
         mask.style.display="none";
     },
     ensure(){
         if(this.state.exists){
             this.showWarnTip("该用户已存在，请换个手机号！",2);
             return 0;
         }
         let stars=this.star.value;
         let phoneno=this.phone.value.trim();
         if(!this.validValue(phoneno,/^1[0-9]{10}$/,["手机号不能为空！","手机号不合法！"])) return 0;
         if(!this.validValue(stars,null,["重要等级不能为空！"])) return 0;
         let remark=this.remark.value.trim();
         let url=this.props.url+"?";
         url+=queryStr.stringify({stars,phoneno,remark});
         console.log("增改重要用户url",url);
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
                     this.props.reload();
                     this.cancel();
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
        let user=this.state.user||{};
        let gender=user.sex===0?"女":"男";
        return(
            <div className="dialog">
                <h2 className="title">{type=="add"?"新增重要用户":"编辑重要用户"}<i onClick={this.cancel}/></h2>
                <div className="dialog-important-user">
                    <p><em>用户手机：</em><input placeholder="请输入手机号" onChange={this.handlePhoneChange}
                                            defaultValue={this.props.phone} ref={(c)=>this.phone=c}/></p>
                    {this.state.exists?<p><em>用户信息：</em>
                        <input className="username" readOnly value={user.realname}
                               style={{border:"none",backgroundColor:"#f5f5f5",color:"#646464"}}/>
                        <input className="username" readOnly value={gender}
                               style={{border:"none",backgroundColor:"#f5f5f5",color:"#646464"}}/>
                    </p>:""}
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
