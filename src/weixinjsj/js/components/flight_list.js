import React from 'react';
import {decDatetime} from '../util';
export default React.createClass({
    componentWillMount(){
        document.title="航班列表";
    },
    handleClick(e){
        let orderType=sessionStorage.getItem("OrderType");
        let id=e.target.id;
        e.target.style.backgroundColor="#F9BE00";
        let flight=this.flightList[id];
        console.log(flight);
        sessionStorage.setItem('FlightInfo',JSON.stringify(flight));
        setTimeout(()=>{
            if(+orderType==1){
                location.href="#/jieji_query";
            }else if(+orderType==2){
                location.href="#/songji_query";
            }
        },500);
    },
    render(){
        let flightData=sessionStorage.getItem("flightData");
        let obj=JSON.parse(flightData);
        console.log(obj);
        this.flightList=obj.records||[];
        let list=this.flightList.map((item,index)=> {
            let {hour,minute}=decDatetime(item.takingofftime);
            let{hour:hour1,minute:minute1}=decDatetime(item.landingtime);

            return(<section className="flight-item" key={index}>
                <h3>{item.flightnumber.toUpperCase()}</h3>
                <ul>
                    <li>
                        <h2>{hour+":"+minute}</h2>
                        <p>{item.fromcity}{item.fromairport}机场{item.fromterminal}</p>
                    </li>
                    <li>
                        <img src="/weixinjsj/img/06.png" />
                    </li>
                    <li>
                        <h2>{hour1+":"+minute1}<em onClick={this.handleClick} id={index} /></h2>
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
