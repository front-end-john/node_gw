import React from 'react';
import ReactDOM from 'react-dom';

import TextScroll from '../widgets/text_scroll';
import TextInput from '../widgets/text_input';
import SelectInput from '../widgets/select_input';
import TableHead from '../widgets/table_head';
import TableLine from '../widgets/table_line';
import DateSelect from '../widgets/date_select';



//import OPImportantUser from '../dialog/operate_important_user';
//import OPFlightInfo from '../dialog/operate_flight_info';
//import EditUserInfo from '../dialog/edit_user_info';
//import IssueCoupon from '../dialog/issue_coupon';
//import OilService from '../dialog/oil_service';
//import WashService from '../dialog/wash_service';
//import AddRemark from '../dialog/add_remark';
//import ModifyCarInfo from '../dialog/modify_car_info';
//import ModifyPassword from '../dialog/modify_password';
//import CustomerLabel from '../dialog/customer_label';
import CustomerLabel from '../dialog/assign_driver';


let OrderQuery=React.createClass({
    getInitialState(){
        "use strict";
        return{
            queryCondition:{
                phone_no:"",
                car_no:"",
                wx_nick:"",
                order_source:"",
                order_no:"",
                time_type:"",
                start_time:"",
                end_time:"",
                airport:"",
                order_status:""
            }
        };
    },
    handleChange(e){
        "use strict";
        let key=e.target.id;
        let val=e.target.value;
        //console.log(key+":"+val);
        if(key==="phone_no"){
            this.state.queryCondition.phone_no=val;
        }else if(key==="car_no"){
            this.state.queryCondition.car_no=val;
        }else if(key==="wx_nick"){
            this.state.queryCondition.wx_nick=val;
        }else if(key==="order_source"){
            this.state.queryCondition.order_source=val;
        }else if(key==="order_no"){
            this.state.queryCondition.order_no=val;
        }else if(key==="time_type"){
            this.state.queryCondition.time_type=val;
        }else if(key==="start_time"){
            this.state.queryCondition.start_time=val;
        }else if(key==="end_time"){
            this.state.queryCondition.end_time=val;
        }else if(key==="airport"){
            this.state.queryCondition.airport=val;
        }else if(key==="order_status"){
            this.state.queryCondition.order_status=val;
        }
    },
    handleDateSelect(date,obj){
        "use strict";
        console.log(date);
        console.log(obj);
    },
    handleQuery(){
        "use strict";
        console.log(this.state.queryCondition);
    },
    showDialog(){
        "use strict";
        let mask=document.getElementById("dialogContainer");
        mask.style.display="block";
        ReactDOM.render(<CustomerLabel />, mask);
    },
    render(){
        "use strict";
        let widths=['152px','140px','170px','138px','140px','166px','168px','202px','168px','110px','85px'];
        let headData=[{name:'订单号',width:'152px'},{name:'用户',width:'140px'},
            {name:'订单来源',width:'170px'}, {name:'车辆',width:'138px'},{name:'机场',width:'140px'},
            {name:'预约时间',width:'166px'},{name:'接车司机',width:'168px'},{name:'接车/入库时间',width:'202px'},
            {name:'送车司机',width:'168px'},{name:'送车时间',width:'110px'},{name:'状态',width:'85px'}];

        let data=[{order_no:'1445515665454',fieldName:'OrderNo'},
            {username:"中小屋",phone_no:"124578654",fieldName:'User'},
            {order_source:"携程",fieldName:'OrderSource'},
            {car_no:'奥B4878',car_color:'白色',car_brand:'宝马',fieldName:'Car'},
            {airport:'广州白云',fieldName:'Airport'},
            {order_time:"2016-12-12 12:12",back_time:"hu456 2017-1-21",fieldName:'AdvanceTime'},
            {take_driver:'周当啊',fieldName:'TakeDriver'},
            {take_car_at:'2016-05-15 15:14',in_garage_at:'2016-12-12 12:12',fieldName:'TakeCarStatus'},
            {send_driver:'周当啊',fieldName:'SendDriver'},
            {send_car_start:'2016-05-15 15:14',send_car_end:'2016-12-12 12:12',fieldName:'SendCarStatus'}
            ,{pay_status:'未支付',fieldName:'PayStatus'}];
        return(
            <section className="data-section">
                <TextScroll />
                <div className="query-condition">
                    <TextInput title="用户手机:" change={this.handleChange} name="phone_no" holdText="请输入手机号"/>
                    <TextInput title="车牌号码:" change={this.handleChange} name="car_no" holdText="请输入车牌号" />
                    <TextInput title="微信昵称:" change={this.handleChange} name="wx_nick" holdText="请输入微信昵称" />
                    <SelectInput title="订单来源:" change={this.handleChange} name="order_source" defaultName="全部"/>
                    <SelectInput title="订单状态:" change={this.handleChange} name="order_status" defaultName="全部"/>
                    <TextInput title="订单号:" change={this.handleChange} name="order_no" holdText="请输入订单号" />
                    <hr/>
                    <SelectInput title="筛选时间:" change={this.handleChange} name="time_type" defaultName="选择筛选的时间"/>
                    <DateSelect title="开始时间:" change={this.handleDateSelect}  holdText="2016-12-08" />
                    <DateSelect title="结束时间:" change={this.handleDateSelect} name="end_time" holdText="2016-12-08" />
                    <SelectInput title="机场:" change={this.handleChange} name="airport" defaultName="全部"/>

                    <button className="query-btn" onClick={this.handleQuery}>查询</button>
                    <button className="checkout" onClick={this.showDialog}>导出</button>
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

export default OrderQuery;