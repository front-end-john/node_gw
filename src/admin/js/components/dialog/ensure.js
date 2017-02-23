import React from 'react';
import ReactDOM from 'react-dom';
import WarnTip from '../dialog/warn_tip';
let Ensure=React.createClass({
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
    ensure(){
        let order_id=this.props.order_id;
        let showpublic=this.props.public_show;
        if(order_id){
            let url=this.props.url+"?order_id="+order_id+"&showpublic="+showpublic;
            fetch(url,{credentials: 'include'}).then(function(res){
                console.log("关闭或展现评论响应状态："+res.status);
                if(+res.status < 400){
                    return res.text();
                }else {
                    throw new Error("服务异常");
                }
            }).then((str)=>{
                //console.log(str);
                try {
                    let obj=JSON.parse(str);
                    if(obj.code==0){
                        this.props.change();
                        this.cancel();
                    }else {
                        this.showWarnTip(obj.msg);
                    }
                }catch(e){
                    this.showWarnTip("数据异常");
                }
            }).catch(function(e) {
                this.showWarnTip("请求异常");
                console.trace('错误:', e);
            });
        }
        /*let change=this.props.change;
        change && change();*/

    },
    render(){
        return(
            <div className="dialog">
                <h2 className="title">{this.props.title}<i onClick={this.cancel}/></h2>
                <p className="dialog-ensure">{this.props.content}</p>
                <section className="btn">
                    <button onClick={this.cancel}>取消</button>
                    <button onClick={this.ensure}>确认</button>
                </section>
            </div>
        );
    }
});

export default Ensure;
