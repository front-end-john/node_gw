import React from 'react';

import TextScroll from '../widgets/text_scroll';
import TextInput from '../widgets/text_input';
import SelectInput from '../widgets/select_input';
import TableHead from '../widgets/table_head';
import TableLine from '../widgets/table_line';

let AirportTempPark=React.createClass({
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
        let widths=['168px','156px','156px','180px','152px','168px','180px','170px','168px','140px'];
        let headData=[{name:'订单号',width:'168px'},
            {name:'用户',width:'156px'}, {name:'标签',width:'156px'},
            {name:'订单来源',width:'180px'},{name:'车辆',width:'152px'},
            {name:'航站楼',width:'168px'},{name:'预约时间',width:'180px'},
            {name:'挪车司机',width:'170px'},{name:'机场停放时间',width:'168px'},
            {name:'开始挪车时间',width:'140px'}];

        let data=[{order_no:'1445515665454',fieldName:'OrderNo'},
            {username:"中小屋",phone_no:"124578654",fieldName:'User'},
            {trade:"发票",user_type:"关系客户",fieldName:'Label'},
            {order_source:"携程",fieldName:'OrderSource'},
            {car_no:'奥B4878',car_color:'白色',car_brand:'宝马',fieldName:'Car'},
            {city:'广州',terminal:'白云国际机场T1',fieldName:'OnwardTerminal'},
            {session:"2016-8-9 15:14",fieldName:'Session'},
            {move_driver:'周当啊',color:"#DB8800",fieldName:'MoveDriver'},
            {airport_park_time_long:"4小时25分钟",fieldName:'AirportParkTimeLong'},
            {start_move_time:"2016-12-12 14:24",fieldName:'StartMoveTime'}];
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

export default AirportTempPark;