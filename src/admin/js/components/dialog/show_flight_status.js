import React from 'react';
import ReactDOM from 'react-dom';
import WarnTip from '../dialog/warn_tip';
export default React.createClass({
    getInitialState(){return {};},
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
    componentWillMount(){
        let mask=document.getElementById("dialogContainer");
        mask.style.display="block";
        let flightdate=this.props.date||"2017-01-10";
        let flightnumber=this.props.number||"CA1612";
        let url="/admin/api/flight/get?"+queryStr.stringify({flightnumber,flightdate});
        console.log("航班状态详情url",url);
        fetch(url,{credentials:'include'}).then((res)=>{
            console.log("航班状态详情响应："+res.status);
            if(+res.status < 400){
                return res.json();
            }else {
                throw new Error("服务异常");
            }
        }).then((json)=>{
            console.log(json);
            if(json.code==0){
                this.setState({fligtInfo:json.flights});
            }else{
                this.showWarnTip(json.msg);
            }
        }).catch((e)=>{
            this.showWarnTip("请求异常！",2);
            console.trace('错误:', e);
        });
    },
    cancel(){
        let mask=document.getElementById("dialogContainer");
        ReactDOM.render(<i/>, mask);
        mask.style.display="none";
    },
    render(){
        let infos=this.state.fligtInfo||[];
        let items=infos.map((item,index)=>{
            return (<div className="flight-status-info" key={index}>
                <p style={{fontWeight:600}}><label>航班号：</label>{item.flightnumber}</p>
                <p style={{fontWeight:600}}><label>航班日期：</label>{item.flightdate}</p>
                <p><label>状态：</label><span style={{color:"red"}}>{item.statusdescription}</span>
                    （{item.comefromshow}）</p>
                <p><label>更新时间：</label>{item.updatingtime}</p>
                <p><label>起飞地：</label>{item.fromcity}</p><p><label>目的地：</label>{item.tocity}</p>
                <p><label>计划起飞时间：</label>{item.takingofftime}</p>
                <p><label>计划落地时间：</label>{item.landingtime}</p>
                <p><label>预计起飞时间：</label>{item.expecttakingofftime}</p>
                <p><label>预计落地时间：</label>{item.expectlandingtime}</p>
                <p><label>实际起飞时间：</label>{item.realtakingofftime}</p>
                <p><label>实际落地时间：</label>{item.reallandingtime}</p>
            </div>)
        });
        return(
            <div className="dialog">
                <h2 className="title">航班动态信息<i onClick={this.cancel}/></h2>
                {items}
            </div>
        );
    }
});
