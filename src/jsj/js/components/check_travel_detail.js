import React from 'react';
import {decDatetime} from '../util';
export default React.createClass({

    componentWillMount(){
        document.title="行程详情";
        document.getElementById("appContainer").style.backgroundColor="#fff";
    },
    render(){
        let d = sessionStorage.getItem("TravelDetailInfo");
        d=JSON.parse(d);
        let flag=d.ordertype;
        let {year,month,day,hour,minute}=decDatetime(d.bookingtime);
        let {year:y1,month:mon1,day:d1,hour:h1,minute:min1}=decDatetime(d.createtime);
        let f=d.flightinfo;
        return(
            <div className="travel-detail">
                <ul className="travel-order-detail">
                    <li>成功支付</li>
                    <li>&yen;{parseFloat(d.totalfee).toFixed(2)}</li>
                    <li>
                        <p>费用总计</p>
                        <p>&yen;{d.totalfee}</p>
                    </li>
                    <li>订单信息</li>
                    <li>{+flag==1?'接机':'送机'}</li>
                    <li>
                        <p>航班号</p>
                        <p>{f.flightnumber||''}</p>
                    </li>
                    <li>
                        <p>用车时间</p>
                        <p>{year}-{month}-{day} {hour}:{minute}</p>
                    </li>
                    <li>
                        {+flag==1?(<p>出发机场</p>):(<p>出发地址</p>)}
                        <p>{d.startaddress||''}</p>
                    </li>
                    <li>
                        {+flag==1?(<p>送达地址</p>):(<p>送达机场</p>)}
                        <p>{d.endaddress||''}</p>
                    </li>
                    <li>
                        <p>行程备注</p>
                        <p>{d.userremark||''}</p>
                    </li>
                    <li>
                        <p>联系人</p>
                        <p>{d.actualname||''} {d.actualphone||''}</p>
                    </li>
                    <li>
                        <p>下单时间</p>
                        <p>{y1}-{mon1}-{d1} {h1}:{min1}</p>
                    </li>
                </ul>
            </div>
        );
    }
});
