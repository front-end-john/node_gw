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
    ensure(is){
        let serialnumber=this.props.number,sendmsg=is;
        let returningflight=this.fno||this.props.fno;
        let returningdate=this.fdate||this.props.fdate;
        let url=this.props.url+"?";
        url+=queryStr.stringify({serialnumber,returningflight,returningdate,sendmsg});
        console.log("修改返程航班url",url);
        fetch(url,{credentials: 'include'}).then((res)=>{
            console.log("修改返程航班响应："+res.status);
            if(+res.status < 400){
                return res.text();
            }else {
                throw new Error("服务异常");
            }
        }).then((str)=>{
            try{
                let obj=JSON.parse(str);
                if(obj.code===0){
                    let reload=this.props.reload;
                    reload && reload();
                    let update=this.props.updateFlight;
                    update && update(returningflight,returningdate);
                    this.cancel();
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
        let btns=[];
        if(this.props.type=="add"){
            btns[0]=(<button key={0} onClick={this.cancel}>取消</button>);
            btns[1]=(<button key={1} onClick={()=>this.ensure(false)}>确认</button>);
        }else {
            btns[0]=(<button key={0} onClick={()=>this.ensure(false)}>修改不发送短信</button>);
            btns[1]=(<button key={1} onClick={()=>this.ensure(true)}>修改并发送短信</button>);
        }
        return(
            <div className="dialog">
                <h2 className="title">{this.props.type=="add"?"添加":"修改"}返程航班<i onClick={this.cancel}/></h2>
                <div className="dialog-flight-info">
                    <p><em>返程航班：</em>
                        <input placeholder="请输入返程航班" onChange={(e)=>this.fno=e.target.value}
                               defaultValue={this.props.fno}/></p>
                    <div className="date-select"><em>返程时间：</em>
                        <DateField onChange={(date)=>this.fdate=date } dateFormat="YYYY-MM-DD"
                                   style={{borderColor:"#ddd",width:"220px",height:"36px"}}
                                   defaultValue={this.props.fdate} placeholder="请输入返程时间"
                        /></div>
                </div>
                <section className="btn">
                    {btns}
                </section>
            </div>
        );
    }
});
