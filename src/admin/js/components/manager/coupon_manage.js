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
        console.log(this.state.queryCondition);
    },
    adaptScreen(widths,titles){
        this.setState({titles});
        let offsetWidth=60,len=widths.length,initWidths=widths.concat();
        let sumWidth = widths.reduce((x,y)=>x+y,offsetWidth),initSumWidth=sumWidth;
        let screenWidth=document.body.clientWidth||window.innerWidth;
        if(screenWidth-200 > initSumWidth){
            let incre=(screenWidth-200-initSumWidth)/len;
            widths=initWidths.map((item)=>item+incre);
            sumWidth = widths.reduce((x,y)=>x+y,offsetWidth);
            this.setState({sumWidth,widths});
        }else {
            this.setState({sumWidth,widths});
        }
        window.addEventListener("resize",()=>{
            let screenWidth=document.body.clientWidth||window.innerWidth;
            if(screenWidth-200 > initSumWidth){
                let incre=(screenWidth-200-initSumWidth)/len;
                widths=initWidths.map((item)=>item+incre);
                sumWidth = widths.reduce((x,y)=>x+y,offsetWidth);
                this.setState({sumWidth,widths});
            }
        },false);
    },
    componentWillMount(){
        let widths=[130,120,100,100,120,130,130,120,120];
        let titles=['ID','手机号','类型','状态','金额','领取时间','截止时间','活动来源','操作'];
        this.adaptScreen(widths,titles);
    },
    render(){
        let sumWidth=this.state.sumWidth;
        let widths=this.state.widths;
        let titles=this.state.titles;
        let headData = titles.map((item,index)=>{
            return {name:item,width:widths[index]+'px'};
        });
        document.getElementById("appContainer").style.width= 200+sumWidth+'px';

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
            <section className="data-section"  style={{width:sumWidth}}>
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
