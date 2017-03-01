 import React from 'react';
 import ReactDOM from 'react-dom';
 import { DateField } from 'react-date-picker';
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
        let order_id=this.props.number;
        let flightlandingtime=this.fdate||this.props.time;
        let url=this.props.url+"?";
        url+=queryStr.stringify({order_id,flightlandingtime});
        console.log("修改取车时间url",url);
        fetch(url,{credentials: 'include'}).then((res)=>{
            console.log("修改取车时间响应："+res.status);
            if(+res.status < 400){
                return res.text();
            }else {
                throw new Error("服务异常");
            }
        }).then((str)=>{
            try{
                let obj=JSON.parse(str);
                if(obj.code==0){
                    this.showWarnTip(null);
                    this.props.reload();
                }else {
                    this.showWarnTip(obj.msg);
                }
            }catch(e){
                this.showWarnTip("数据异常！");
                console.error("数据异常：",e);
                console.log("异常数据：",str);
            }
        }).catch((e)=>{
            this.showWarnTip("网络请求异常！");
            console.trace('错误:', e);
        });
    },

    render(){
        return(
            <div className="dialog">
                <h2 className="title">{this.props.type=="add"?"添加":"修改"}预计取车时间<i onClick={this.cancel}/></h2>
                <div className="dialog-flight-info">
                    <div className="date-select"><em>预计取车时间：</em>
                        <DateField onChange={(date)=>this.fdate=date } dateFormat="YYYY-MM-DD HH:mm"
                                   style={{borderColor:"#ddd",width:"220px",height:"36px"}}
                                   defaultValue={this.props.time} placeholder="请输入返程时间"
                        /></div>
                </div>
                <section className="btn">
                    <button onClick={this.cancel}>取消</button>
                    <button onClick={()=>this.ensure()}>确认</button>
                </section>
            </div>
        );
    }
});
