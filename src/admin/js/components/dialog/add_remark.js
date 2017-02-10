 import React from 'react';
 import ReactDOM from 'react-dom';
 import WarnTip from '../dialog/warn_tip';
 export default React.createClass({
     getInitialState(){
         return{ warn:''};
     },
    componentWillMount(){
        let mask=document.getElementById("dialogContainer");
        mask.style.display="block";
    },
    cancel(){
        let mask=document.getElementById("dialogContainer");
        ReactDOM.render(<i/>, mask);
        mask.style.display="none";
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
    ensure(){
        let text=this.text.value.trim();
        if(!text){
            this.showWarnTip("备注不能为空！");
            return 0;
        }
        let url=this.props.url+"?"+queryStr.stringify({serialnumber:this.props.number,remark:text});
        fetch(url).then(function(res){
            console.log("添加备注的响应状态：",res.status);
            if(+res.status < 400){
                return res.text();
            }else {
                throw new Error("服务异常");
            }
        }).then((str)=>{
            let obj=JSON.parse(str);
            if(obj.code==0){
                this.props.reload();
                this.showWarnTip(null);
            }else {
                this.showWarnTip("备注添加失败！");
            }
        }).catch(function(e) {
            this.showWarnTip("网络请求异常！");
            console.trace('错误:', e);
        });
    },
    render(){
        return(
            <div className="dialog">
                <h2 className="title">添加备注<i onClick={this.cancel}/></h2>
                <div className="dialog-important-user">
                    <p><em>备&emsp;&emsp;注：</em>
                        <textarea placeholder="填写备注" ref={(c)=>this.text=c} /></p>
                </div>
                <section className="btn">
                    <button onClick={this.cancel}>取消</button>
                    <button onClick={this.ensure}>确认</button>
                </section>
                {/*<p className="mistake-warn" ref={(c)=>this.warning=c}>
                    <span>{this.state.warn}</span>
                    <i onClick={()=>{this.warning.style.display="none"}}/>
                </p>*/}
            </div>
        );
    }
});
