import React from 'react';
import ReactDOM from 'react-dom';
import WarnTip from '../dialog/warn_tip';
export default React.createClass({
    getInitialState(){return {};},
    componentWillMount(){
        let mask=document.getElementById("dialogContainer");
        mask.style.display="block";
    },
    showWarnTip(msg){
        let mask=document.getElementById("dialogContainer");
        ReactDOM.render(<WarnTip msg={msg}/>, mask);
    },
    cancel(){
        let mask=document.getElementById("dialogContainer");
        ReactDOM.render(<i/>, mask);
        mask.style.display="none";
    },
    ensure(id,status){
        let url="/admin/api/serviceorder/set_status";
        url+="?serviceorderid="+id+"&status="+status;
        console.log("洗车或加油服务确认url",url);
        fetch(url,{credentials: 'include'}).then((res)=>{
            console.log("洗车或加油服务确认响应："+res.status);
            if(+res.status < 400){
                return res.text();
            }else {
                throw new Error("服务异常");
            }
        }).then((str)=>{
            console.log(str);
            try {
                let obj=JSON.parse(str);
                if(obj.code==0){
                    this.cancel();
                }else {
                    this.showWarnTip(obj.msg);
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
        let type=this.props.type;
        let {name,tel,sid,intro}=this.props.data;
        let serviceIntro=type=="wash"?"洗车服务":"加油服务";
        return(
            <div className="dialog">
                <h2 className="title">{serviceIntro}<i onClick={this.cancel}/></h2>
                <p className="dialog-ensure">
                    "{name}（{tel}）"<span style={{color:"red"}}>&ensp;{intro}&ensp;</span>是否已完成？
                </p>
                <section className="btn">
                    <button onClick={()=>this.ensure(sid,0)}>否</button>
                    <button onClick={()=>this.ensure(sid,50)}>是</button>
                </section>
            </div>
        );
    }
});

