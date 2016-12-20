import React from 'react';

import TextScroll from '../widgets/text_scroll';
import TextInput from '../widgets/text_input';
import TableHead from '../widgets/table_head';
import CouponLine from '../widgets/coupon_line';

export default React.createClass({
    getInitialState(){
        "use strict";
        return{
            queryCondition:{
                phone_no:"",
                wx_nick:""
            }
        };
    },
    handleChange(e){
        "use strict";
        let key=e.target.id;
        let val=e.target.value;
        if(key==="phone_no"){
            this.state.queryCondition.phone_no=val;
        }else if(key==="wx_nick"){
            this.state.queryCondition.wx_nick=val;
        }
    },
    handleQuery(){
        "use strict";
        console.log(this.state.queryCondition);
    },
    render(){
        "use strict";
        let widths=['170px','180px','190px','190px','190px','200px','180px','180px','150px'];
        let headData= [
            {name:'ID',width:'170px'},
            {name:'手机号',width:'180px'},
            {name:'类型',width:'190px'},
            {name:'状态',width:'190px'},
            {name:'金额',width:'190px'},
            {name:'领取时间',width:'200px'},
            {name:'截止时间',width:'180px'},
            {name:'活动来源',width:'180px'},
            {name:'操作',width:'150px'}];

        let data=[{id:'1457',fieldName:'CouponID'},
            {phone_no:"1457258456",fieldName:'PhoneNo'},
            {type_msg:"停车优惠券(按天数)",fieldName:'CouponType'},
            {status:"已使用",fieldName:'CouponStatus'},
            {amount:'2天',fieldName:'MoneyAmount'},
            {receive_time:'2016-8-9',fieldName:'ReceiveCouponTime'},
            {deadline_time:'2016-8-9',fieldName:'DeadlineTime'},
            {source:'深圳航空客户专享',fieldName:'ActivitySource'},
            {op_items:["删除"],dialogs:[1],color:"#1A9FE5",fieldName:'Operation'}];
        return(
            <section className="data-section">
                <TextScroll />
                <div className="query-condition">
                    <TextInput title="用户手机:" change={this.handleChange} name="phone_no" holdText="请输入手机号"/>
                    <TextInput title="微信昵称:" change={this.handleChange} name="wx_nick" holdText="请输入微信昵称" />
                    <button className="query-btn" onClick={this.handleQuery}>查询</button>
                    <button className="checkout" >发放优惠券</button>
                </div>
                <TableHead data={headData} />
                <CouponLine widths={widths} data={data} />
                <CouponLine widths={widths} data={data} />
                <CouponLine widths={widths} data={data} />
                <CouponLine widths={widths} data={data} />
            </section>
        );
    }
});
