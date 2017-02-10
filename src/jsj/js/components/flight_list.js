import React from 'react';
import ReactDOM from 'react-dom';
import PulldownTip from '../widgets/pulldown_tip';
import {decDatetime} from '../util';
export default React.createClass({
    componentWillMount(){
        let num=sessionStorage.getItem("FlightNumber");
        document.title=num?num.toUpperCase():"航班号";
    },
    handleClick(e){
        let dom=document.getElementById("dialog");
        let orderType=sessionStorage.getItem("OrderType");
        let id=e.target.id;
        this["standout"+id].style.backgroundColor="#F9BE00";
        let flight=this.flightList[id];
        let timestamp=new Date().getTime();
        if(+orderType==1){
            if(flight <= timestamp){
                ReactDOM.render(<PulldownTip msg="该航班已降落，无法预约！" />,dom);
                return 0;
            }else if(flight - 1800*1000 <= timestamp){
                ReactDOM.render(<PulldownTip msg="该航班即将降落，航班降落前30分钟内无法预约！" />,dom);
                return 0;
            }
        }else {
            //todo 送机航班限制
        }
        sessionStorage.setItem('FlightInfo',JSON.stringify(flight));
        setTimeout(()=>{
            location.href="#/jsj_query?type="+orderType;
        },500);
    },
    render(){
        let flightData=sessionStorage.getItem("FlightData");
        let obj=JSON.parse(flightData);
        this.flightList=obj.records||[];
        let list=this.flightList.map((item,index)=> {
            let {month,day,week,hour,minute}=decDatetime(item.takingofftime);
            let{hour:hour1,minute:minute1}=decDatetime(item.landingtime);

            return(<section className="flight-item" key={index} onClick={this.handleClick} id={index} >
                <h3>{item.flightnumber.toUpperCase()}<em>{month}月{day}日 {weekday[week]}</em></h3>
                <ul>
                    <li>
                        <h2>{hour+":"+minute}</h2>
                        <p>{item.fromcity}{item.fromairport}机场{item.fromterminal}</p>
                    </li>
                    <li>
                        <img src={jsj_static_path+"/img/06.png"} />
                    </li>
                    <li>
                        <h2>{hour1+":"+minute1}<em ref={(c)=>this["standout"+index]=c}/></h2>
                        <p>{item.tocity}{item.toairport}机场{item.toterminal}</p>
                    </li>
                </ul>
            </section>);
        });
        let len=list.length;
        return(
            <div className="flight-list">
                {len>0?(<p>以下时间均为当地时间</p>):''}
                {len>0?list:(<h4>未查询到航班信息</h4>)}
            </div>
        );
    }
});
