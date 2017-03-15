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
         if(floor==2) dialogContainer="secDialogContainer";
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
         let old=this.old.value;
         let fresh=this.fresh.value;
         let repeat=this.repeat.value;
         if(!old){
             this.showWarnTip("旧密码不能为空！",2);
             return 0;
         }
         if(!fresh){
             this.showWarnTip("新密码不能为空！",2);
             return 0;
         }
         if(fresh!=repeat){
             this.showWarnTip("两次输入的密码不匹配！",2);
             return 0;
         }
         let url="/admin/api/modifypassword?oldpassword="+old+"&newpassword="+fresh;
         console.log("修改密码url",url);
         fetch(url,{credentials: 'include'}).then((res)=>{
            console.log("修改密码响应："+res.status);
            if(+res.status < 400){
                return res.text();
            }else {
                throw new Error("服务异常");
            }
         }).then((str)=>{
            try {
                let obj=JSON.parse(str);
                //console.log(obj);
                if(obj.code==0){
                    this.showWarnTip("修改成功,请重新登陆！");
                }else {
                    this.showWarnTip(obj.message);
                }
            }catch(e){
                this.showWarnTip("数据异常");
            }
        }).catch((e)=>{
            this.showWarnTip("请求异常");
            console.trace('错误:', e);
        });
    },
    render(){
        return(
            <div className="dialog">
                <h2 className="title">修改密码<i onClick={this.cancel}/></h2>
                <div className="dialog-modify-password">
                    <p><em>旧密码：</em><input type="password" placeholder="请输入旧密码" ref={(c)=>this.old=c}/></p>
                    <p><em>新密码：</em><input type="password" placeholder="请输入新密码" ref={(c)=>this.fresh=c}/></p>
                    <p><em>重复密码：</em><input type="password" placeholder="请重复新密码" ref={(c)=>this.repeat=c}/></p>
                </div>
                <section className="btn">
                    <button onClick={this.cancel}>取消</button>
                    <button onClick={this.ensure}>确认</button>
                </section>
            </div>
        );
    }
});
