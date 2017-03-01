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
        }else{
            ReactDOM.render(<WarnTip msg={msg}/>, mask);
        }
    },
    cancel(){
        let mask=document.getElementById("dialogContainer");
        ReactDOM.render(<i/>, mask);
        mask.style.display="none";
    },
    ensure(){
        let gender=this.genderSel.value,stars=this.starSel.value,remark=this.remarkArea.value;
        let url=this.props.url+"?"+queryStr.stringify({remark,phoneno:this.props.tel,stars,gender});
        console.log("修改用户url",url);
        fetch(url,{credentials: 'include'}).then((res)=>{
            console.log("修改用户响应：",res.status);
            if(+res.status < 400){
                return res.text();
            }else {
                throw new Error("服务异常");
            }
        }).then((str)=>{
            let obj=JSON.parse(str);
            if(obj.code==0){
                this.props.reload();
                this.cancel();
            }else {
                this.showWarnTip(obj.msg);
            }
        }).catch((e)=>{
            this.showWarnTip("网络请求异常！");
            console.trace('错误:', e);
        });
    },

    render(){
        return(
            <div className="dialog">
                <h2 className="title">用户信息编辑<i onClick={this.cancel}/></h2>
                <div className="dialog-important-user">
                    <p><em>用户姓名：</em>
                        <input  defaultValue={this.props.name} className="username" readOnly
                        style={{border:"none",backgroundColor:"#f5f5f5",color:"#646464"}}/>
                        <select className="user-gender" ref={(c)=>this.genderSel=c}
                                defaultValue={this.props.gender=="男"?1:0}>
                            <option value="1" >男</option>
                            <option value="0" >女</option>
                        </select><i className="select-arrow"/>
                    </p>
                    <p><em>用户星级：</em>
                        <select defaultValue={this.props.stars} ref={(c)=>this.starSel=c}>
                            <option value="0">无</option>
                            <option value="1" >&#9733;</option>
                            <option value="2" >&#9733;&#9733;</option>
                        </select><i className="select-arrow"/>
                    </p>
                    <p><em>备&emsp;&emsp;注：</em>
                        <textarea placeholder="填写备注" ref={(c)=>this.remarkArea=c} defaultValue={this.props.remark} /></p>
                </div>
                <section className="btn">
                    <button onClick={this.cancel}>取消</button>
                    <button onClick={this.ensure}>确认</button>
                </section>
            </div>
        );
    }
});
