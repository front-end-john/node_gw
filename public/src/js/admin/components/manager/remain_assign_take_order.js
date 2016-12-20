import React from 'react';

import TextScroll from '../widgets/text_scroll';
import TextInput from '../widgets/text_input';
import SelectInput from '../widgets/select_input';
import TableHead from '../widgets/table_head';
import TableLine from '../widgets/table_line';

let RemainAssignTakeOrder=React.createClass({
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
        let widths=['180px','180px','180px','200px','180px','198px','200px','180px','130px'];
        let headData=[{name:'订单号',width:'180px'},
            {name:'用户',width:'180px'}, {name:'标签',width:'180px'},
            {name:'订单来源',width:'200px'},{name:'车辆',width:'180px'},
            {name:'航站楼',width:'198px'},{name:'预约时间',width:'200px'},
            {name:'剩余接车时间',width:'180px'},{name:'操作',width:'130px'}];

        let data=[{order_no:'1445515665454',fieldName:'OrderNo'},
            {username:"中小屋",phone_no:"124578654",fieldName:'User'},
            {trade:"发票",user_type:"关系客户",fieldName:'Label'},
            {order_source:"携程",fieldName:'OrderSource'},
            {car_no:'奥B4878',car_color:'白色',car_brand:'宝马',fieldName:'Car'},
            {city:'广州',terminal:'白云国际机场T1',fieldName:'OnwardTerminal'},
            {session:"2016-8-9 15:14",fieldName:'Session'},
            {remain_time:"30分钟",fieldName:'RemainTakeCarTime'},
            {op_items:1,op_1:"分配接车司机",dialog_type:2,color:"#DB8800",fieldName:'Operation'}];
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

export default RemainAssignTakeOrder;