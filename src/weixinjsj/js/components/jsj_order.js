import React from 'react';
import {decDatetime} from '../util';

export default React.createClass({
    getInitialState(){
        return{
            finished:false,
            orderList:[]
        };
    },
    componentWillMount(){
        document.title="接送机订单";
        let list = sessionStorage.getItem("GoonOrders");
        if(list){
            this.setState({orderList:JSON.parse(list)});
            return 0;
        }
        let url="/jsj/jsjorder/runninglist";
        fetch(url).then(function(res){
            console.log("获取进行中订单的响应状态：",res.status);
            if(+res.status < 400){
                return res.text();
            }else {
                throw new Error("服务异常");
            }
        }).then((str)=>{
            let obj=JSON.parse(str);
            console.log(obj);
            if(obj.code==0){
                this.setState({orderList:obj.records});
                sessionStorage.setItem("GoonOrders",JSON.stringify(obj.records));
            }
        }).catch(function(e) {
            console.warn('错误', e);
        });
    },
    handleShift(e){
        let id=e.target.id;
        if(id=='finished'){
            let list=sessionStorage.getItem("FinishedOrders");
            if(list){
                this.setState({orderList:JSON.parse(list)});
                this.setState({finished:true});
                return 0;
            }
            let url="/jsj/jsjorder/historylist";
            fetch(url).then(function(res){
                console.log("获取进行中订单的响应状态：",res.status);
                if(+res.status < 400){
                    return res.text();
                }else {
                    throw new Error("服务异常");
                }
            }).then((str)=>{
                let obj=JSON.parse(str);
                console.log(obj);
                if(obj.code==0){
                    this.setState({orderList:obj.records});
                    this.setState({finished:true});
                    sessionStorage.setItem("FinishedOrders",JSON.stringify(obj.records));
                }
            }).catch(function(e) {
                console.warn('错误', e);
            });
        }else {
            let list = sessionStorage.getItem("GoonOrders");
            this.setState({orderList:JSON.parse(list)});
            this.setState({finished:false});
        }
    },
    render(){
        let list=this.state.orderList.map((item,index)=>{
            let {year,month,day,hour,minute} =decDatetime(item.bookingtime);
            let statusMsg=(<span style={{color:"#E6C057"}}>进行中</span>);
            switch(item.status){
                case 0:
                    statusMsg=(<span style={{color:"#E6C057"}}>进行中</span>);break;
                case 1:
                    statusMsg=(<span style={{color:"#E6C057"}}>进行中</span>);break;
                case 2:
                    statusMsg=(<span style={{color:"#E6C057"}}>进行中</span>);break;
                default:break;
            }
            return(<ul key={index}>
                <li><p>{+item.ordertype==1?"接车":"送车"}</p><p>{statusMsg}<i className="arrow"/></p></li>
                <li><img src="/weixinjsj/img/clock.png"/><em>时间 :</em>{year}-{month}-{day}&ensp;{hour}:{minute}</li>
                <li><em>起点 :</em>{item.startaddress}</li>
                <li><em>终点 :</em>{item.endaddress}</li>
            </ul>);
        });

        return(
            <div className="jiesongji-order">
                <hgroup>
                    <h2 onClick={this.handleShift} className={this.state.finished?"":"current"}>进行中</h2>
                    <i/>
                    <h2 id="finished" onClick={this.handleShift} className={this.state.finished?"current":""} >已完成</h2>
                </hgroup>
                {list}

            </div>
        );
    }
});
