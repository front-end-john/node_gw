import React from 'react';

import TextScroll from '../widgets/text_scroll';
import TextInput from '../widgets/text_input';
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
        let widths=[  120,   120,  110,  130,  120,    120,     130,      130,        120,     100];
        let titles=['订单号','用户','标签','下单时间','出发地','目的地','航班号','预约时间','预约车型','订单状态'];
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

        let data=[{order_no:'1445515665454',fieldName:'OrderNo'},
            {username:"中小屋",phone_no:"124578654",fieldName:'User'},
            {trade:"发票",user_type:"关系客户",fieldName:'Label'},
            {create_order_time:"2016-8-9 15:14",fieldName:'CreateOrderTime'},
            {local:"深圳市南山区",address:'科兴科学园B栋15楼',fieldName:'StartAddress'},
            {local:"深圳",address:'宝安国际机场T3',fieldName:'EndAddress'},
            {number:"hu4564",launch_time:"2017-1-21",fieldName:'FlightNumber'},
            {booking_time:"2016-8-9 15:14",fieldName:'BookingTime'},
            {type:'豪华型',car_brief:'奥迪A6L 同等级车',fieldName:'CarType'},
            {status:'已完成',color:"#f00",fieldName:'OrderStatus'}];
        return(
            <section className="data-section" style={{width:sumWidth}}>
                <TextScroll />
                <div className="query-condition">
                    <TextInput title="用户姓名:" change={this.handleChange} name="username" holdText="请输入用户姓名" />
                    <TextInput title="用户手机:" change={this.handleChange} name="phone_no" holdText="请输入手机号"/>
                    <TextInput title="微信昵称:" change={this.handleChange} name="wx_nick" holdText="请输入微信昵称" />
                    <TextInput title="订单号:" change={this.handleChange} name="order_no" holdText="请输入订单号" />
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