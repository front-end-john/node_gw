 import React from 'react';

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
        mask.style.display="none";
    },
    ensure(){
        let textarea=this.refs.text,text=textarea.value.trim();
        let warn=this.refs.warn;
        if(!text){
            warn.style.display="block";
            this.setState({warn:"备注不能为空！"});
            return 0;
        }

        let url="/jsj/system/addremark?"+queryStr.stringify({serialnumber:this.props.number,remark:text});
        fetch(url).then(function(res){
            if(+res.status < 400){
                return res.text();
            }else {
                throw new Error("服务异常");
            }
        }).then((str)=>{
            let obj=JSON.parse(str);
            console.log("添加备注的响应：",obj);
            if(obj.code==0){
                warn.style.display="block";
                this.setState({warn:"备注添加成功！"});
                textarea.value="";
            }else {
                warn.style.display="block";
                this.setState({warn:"备注添加失败！"});
            }
        }).catch(function(e) {
            warn.style.display="block";
            this.setState({warn:"添加备注请求失败！"});
            console.trace('添加备注失败:', e);
        });
    },

    render(){
        return(
            <div className="dialog">
                <h2 className="title">添加备注<i onClick={this.cancel}/></h2>
                <div className="dialog-important-user">
                    <p><em>备&emsp;&emsp;注：</em><textarea placeholder="填写备注" ref="text" /></p>
                </div>
                <section className="btn">
                    <button onClick={this.cancel}>取消</button>
                    <button onClick={this.ensure}>确认</button>
                </section>
                <p className="mistake-warn" ref="warn">
                    <span>{this.state.warn}</span>
                    <i onClick={()=>{this.refs.warn.style.display="none"}}/>
                </p>
            </div>
        );
    }
});
