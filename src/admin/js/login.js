
import React from 'react';
import ReactDOM from 'react-dom';
import AppRoute from "./routes/app_route";

let Login=React.createClass({
    getInitialState(){
        return {code:null};
    },
    componentWillMount(){

    },
    componentDidMount(){
        ReactDOM.render(AppRoute , document.getElementById("appContainer"));
    },
    handleLogin(e){
        e.preventDefault();
        let accountInput=this.refs.account,passInput=this.refs.password;
        let loginName=accountInput.value,pass=passInput.value;
        let url="/admin/login";
        fetch(url,{
            method: "POST",
            body:JSON.stringify({account:loginName,password:pass}),
            headers: {"Content-Type": "application/json"}
        }).then(res=>{
            console.log(res);
            res.text().then(text=>{
                console.log(text);
                if(text==='reject'){
                    this.refs.loginTip.className="warning";
                }else if(text==='ok'){
                    console.log("login success");
                    ReactDOM.render( AppRoute ,document.getElementById("appContainer"));
                }
            });
        },err=>{
            console.log(err);
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
                    <p className="login-logo"><img src="/admin/img/Logo.png" /></p>
                    <form className="login-form">
                        <input ref="account" type="text" placeholder="请输入您的账号" />
                        <input ref="password" type="password" placeholder="请输入密码" />
                        <p ref="loginTip" className="warning hide-warning">账号或密码错误</p>
                        <button onClick={this.handleLogin}>登陆</button>
                    </form>
                </div>
                <div className="copy-right">Copyright © 2016 深圳市天行家科技有限公司 粤ICP备15105149号</div>
            </div>
        );
    }
});

export default Login;
