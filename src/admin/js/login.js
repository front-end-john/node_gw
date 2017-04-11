import React from 'react';
import ReactDOM from 'react-dom';
import AppRoute from "./routes/app_route";

export default React.createClass({
    getInitialState(){
        return {code:null};
    },
    componentDidMount(){
        let expires=localStorage.getItem("AdminInfo_expires");
        if(expires && new Date().getTime()- parseInt(expires)>2*24*60*60000){
            localStorage.removeItem("AdminInfo");
        }else if(expires){
            if(localStorage.getItem("AdminInfo")){
                ReactDOM.render( AppRoute ,document.getElementById("appContainer"));
            }
        }
    },
    handleLogin(e){
        e.preventDefault();
        let host=location.hostname;
        if(host.includes("119.23.141.46") || host.includes("admin.feibotong.com")){
            host="admin.feibotong.com";
        }
        let username=this.acountIn.value,password=this.passwdIn.value;
        let url="http://"+host+"/admin/api/login.js?";
        url+=queryStr.stringify({username,password,callback:"login_success"});
        console.log("登陆url",url);
        fetchJsonp(url,{credentials:'include'}).then((res)=>{
            console.log("登陆响应状态",res.status);
            return res.json();
        }).then((json)=>{
            if(json.code===0){
                console.log('管理员信息', json);
                localStorage.setItem("AdminInfo",JSON.stringify(json.admin));
                localStorage.setItem("AdminInfo_expires",new Date().getTime());
                ReactDOM.render( AppRoute ,document.getElementById("appContainer"));
            }else {
                console.log('异常信息', json);
                this.loginTip.className="warning";
            }
        }).catch((e)=>{
            console.trace('网络请求异常', e);
        });
    },

    render(){
        return (
            <div className="login">
                <div className="login-bg">
                    <h2>飞泊通客服管理系统</h2>
                    <p>Fei Bo Tong Customer Service Management System</p>
                </div>
                <div className="login-block">
                    <p className="login-logo"><img src="/duck/img/Logo.png" /></p>
                    <form className="login-form">
                        <input ref={(c)=>this.acountIn=c } type="text" placeholder="请输入您的账号" />
                        <input ref={(c)=>this.passwdIn=c } type="password" placeholder="请输入密码" />
                        <p ref={(c)=>this.loginTip=c } className="warning hide-warning">账号或密码错误</p>
                        <button onClick={this.handleLogin}>登录</button>
                    </form>
                </div>
                <div className="copy-right">Copyright © 2016 深圳市天行家科技有限公司 粤ICP备15105149号</div>
            </div>
        );
    }
});

