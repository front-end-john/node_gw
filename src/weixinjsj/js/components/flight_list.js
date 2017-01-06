import React from 'react';
export default React.createClass({
    componentWillMount(){
        document.title="航班列表";
        document.body.addEventListener("touchstart",()=>{});
    },
    handleClick(e){
        let orderType=sessionStorage.getItem("OrderType");
        let id=e.target.id;
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
            let dt1=new Date(item.takingofftime);
            let dt2=new Date(item.landingtime);
            let h1=dt1.getHours(),m1=dt1.getMinutes(),t1=(h1<10?"0"+h1:h1)+":"+(m1<10?"0"+m1:m1);
            let h2=dt1.getHours(),m2=dt2.getMinutes(),t2=(h2<10?"0"+h2:h2)+":"+(m2<10?"0"+m2:m2);

            return(<section className="flight-item" key={index}>
                <h3>{item.flightnumber}</h3>
                <ul>
                    <li>
                        <h2>{t1}</h2>
                        <p>{item.fromcity}{item.fromairport}机场{item.fromterminal}</p>
                    </li>
                    <li>
                        <img src="/weixinjsj/img/06.png" />
                    </li>
                    <li>
                        <h2>{t2}<em onClick={this.handleClick} id={index} /></h2>
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
