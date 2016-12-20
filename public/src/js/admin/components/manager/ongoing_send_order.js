import React from 'react';

import TextScroll from '../widgets/text_scroll';
import TextInput from '../widgets/text_input';
import SelectInput from '../widgets/select_input';
import TableHead from '../widgets/table_head';
import TableLine from '../widgets/table_line';

let OngoingSendOrder=React.createClass({
    getInitialState(){
        "use strict";
        return{
            queryCondition:{
                order_source:"",
                order_no:"",
                phone_no:""
            }
        };
    },
    handleChange(e){
        "use strict";
        let key=e.target.id;
        let val=e.target.value;
        if(key==="phone_no"){
            this.state.queryCondition.phone_no=val;
        }else if(key==="order_source"){
            this.state.queryCondition.order_source=val;
        }else if(key==="order_no"){
            this.state.queryCondition.order_no=val;
        }
    },
    handleQuery(){
        "use strict";
        console.log(this.state.queryCondition);
    },
    render(){
        "use strict";
        let widths=['168px','158px','158px','150px','158px','160px','180px','180px','150px','160px'];
        let headData=[{name:'订单号',width:'168px'},
            {name:'用户',width:'158px'}, {name:'标签',width:'158px'},
            {name:'车辆',width:'150px'}, {name:'机场',width:'158px'},
            {name:'返程航班',width:'160px'}, {name:'航班状态',width:'180px'},
            {name:'预约取车时间',width:'180px'}, {name:'送车司机',width:'150px'},
            {name:'开始送车时间',width:'160px'}];

        let data=[{order_no:'1445515665454',fieldName:'OrderNo'},
            {username:"中小屋",phone_no:"124578654",fieldName:'User'},
            {trade:"发票",user_type:"关系客户",fieldName:'Label'},
            {car_no:'奥B4878',car_color:'白色',car_brand:'宝马',fieldName:'Car'},
            {airport:'广州白云',fieldName:'Airport'},
            {back_flight:"hu4564",back_time:"2017-1-21",fieldName:'ReturnTicket'},
            {status:'落地',start_time:"已过去10分钟",fieldName:'ReturnFlightStatus'},
            {order_fetch_time:"2016-8-9 15:14",fieldName:'OrderFetchTime'},
            {send_driver:'周当啊',color:"#1A9FE5",fieldName:'SendDriver'},
            {start_send_time:"2016-8-9 15:14",fieldName:'StartSendTime'}];
        return(
            <section className="data-section">
                <TextScroll />
                <div className="query-condition">
                    <SelectInput title="订单来源:" change={this.handleChange} name="order_source" defaultName="全部"/>
                    <TextInput title="订单号:" change={this.handleChange} name="order_no" holdText="请输入订单号" />
                    <TextInput title="用户手机:" change={this.handleChange} name="phone_no" holdText="请输入手机号"/>
                    <button className="query-btn" onClick={this.handleQuery}>查询</button>
                </div>
                <TableHead data={headData} />
                <TableLine widths={widths} data={data} />
                <TableLine widths={widths} data={data} />
                <TableLine widths={widths} data={data} />
                <TableLine widths={widths} data={data} />
            </section>
        );
    }
});

export default OngoingSendOrder;