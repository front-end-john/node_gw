import React from 'react';
import ReactDOM from 'react-dom';
import Loading from '../widgets/loading';
import PulldownTip from '../widgets/pulldown_tip';
import {decDatetime} from '../util';
global.jsj_static_path="/mobile/jsj";
global.jsj_api_path="/jsj";
let OrderList= React.createClass({
    getInitialState(){
        return{
            finished:false,
            orderList:[]
        };
    },
    componentWillMount(){
        document.title="接送机订单";
    },
    componentDidMount(){
        let list = sessionStorage.getItem("GoonOrders");
        if(list){
            this.setState({orderList:JSON.parse(list)});
            return 0;
        }
        /**
         * 显示加载中
         */
        let dom=document.getElementById("dialog");
        ReactDOM.render(<Loading />,dom);
        dom.style.display="block";

        let url=jsj_api_path+"/user/runninglist";
        fetch(url,{credentials:'include'}).then(function(res){
            console.log("获取进行中订单的响应状态：",res.status);
            dom.style.display="none";
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
            }else {
                ReactDOM.render(<PulldownTip msg={obj.message} />,dom);
            }
        }).catch(function(e){
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
            /**
             * 显示加载中
             */
            let dom=document.getElementById("dialog");
            ReactDOM.render(<Loading />,dom);
            dom.style.display="block";
            let url=jsj_api_path+"/user/historylist";
            fetch(url,{credentials:'include'}).then(function(res){
                console.log("获取进行中订单的响应状态：",res.status);
                dom.style.display="none";
                if(+res.status < 400){
                    return res.text();
                }else {
                    throw new Error("服务异常");
                }
            }).then((str)=>{
                let obj=JSON.parse(str);
                console.log(obj);
                if(obj.code==0){
                    this.setState({orderList:obj.records||[]});
                    this.setState({finished:true});
                    sessionStorage.setItem("FinishedOrders",JSON.stringify(obj.records));
                }else {
                    ReactDOM.render(<PulldownTip msg={obj.message} />,dom);
                }
            }).catch(function(e) {
                console.warn('错误', e);
            });
        }else {
            let list = sessionStorage.getItem("GoonOrders");
            this.setState({orderList:JSON.parse(list)||[]});
            this.setState({finished:false});
        }
    },
    render(){
        let list=this.state.orderList.map((item,index)=>{
            let {year,month,day,hour,minute} =decDatetime(item.bookingtime);
            return(<ul key={index}>
                <li><p>{+item.ordertype==1?"接车":"送车"}</p>
                    <p><span style={{color:"#E6C057"}}>{item.statusdescription}</span><i className="arrow"/></p></li>
                <li><img src={jsj_static_path+"/img/clock.png"}/><em>时间 :</em>
                    {year}-{month}-{day}&ensp;{hour}:{minute}</li>
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
                {list.length>0?list:
                    (<p style={{textAlign:"center",fontSize:"32px",fontColor:"#969696",lineHeight:"100px"}}>您当前没有订单！</p>)}
            </div>
        );
    },
    componentWillUnmount(){
        let dom=document.getElementById("dialog");
        dom.style.display="none";
    }
});
ReactDOM.render(<OrderList /> , document.getElementById("appContainer"));