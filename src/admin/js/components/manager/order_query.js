import React from 'react';
import ReactDOM from 'react-dom';

import TextScroll from '../widgets/text_scroll';
import TextInput from '../widgets/text_input';
import SelectInput from '../widgets/select_input';
import TableHead from '../widgets/table_head';
import TableLine from '../widgets/table_line';
import DateSelect from '../widgets/date_select';
import Page from '../widgets/page';



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
            },
            orderData:[],
            pageObj:{}
        };
    },
    componentWillMount(){

    },
    handlePageClick(page,pageSize){
        let url="/admin/api/orders/query?";
        url+=queryStr.stringify({ordertype:'all',page:page,pagesize:pageSize});
        fetch(url).then(function(res){
            console.log("查询订单列表响应状态："+res.status);
            if(+res.status < 400){
                return res.text();
            }else {
                throw new Error("服务异常");
            }
        }).then((str)=>{
            let obj=JSON.parse(str);
            //console.log(obj);
            this.setState({orderData:obj.result});
            this.setState({pageObj:{page:obj.page,pageCount:obj.pagecount,pageSize:obj.pagesize}});
        }).catch(function(e) {
            console.trace('错误:', e);
        });
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
        let widths=[ 130,    110,    120,    128,  160,   190,       90,       130,         90,      130,    80];
        let titles=['订单号','用户','订单来源','车辆','机场','预约时间','接车司机','接车/入库时间','送车司机','送车时间','状态'];
        this.adaptScreen(widths,titles);
        this.handlePageClick(1,10);
        /*let url="/admin/api/orders/query?";
        url+=queryStr.stringify({ordertype:'all',page:1,pagesize:10});
        console.log("订单初始化查询url：",url);
        fetch(url).then(function(res){
            //console.log("查询车型响应状态："+res.status);
            if(+res.status < 400){
                return res.text();
            }else {
                throw new Error("服务异常");
            }
        }).then((str)=>{
            let obj=JSON.parse(str);
            console.log(obj);
            this.setState({orderData:obj.result});
            this.setState({pageObj:{page:obj.page,pageCount:obj.pagecount,pageSize:obj.pagesize}});
            //sessionStorage.setItem("carTypeList",str);
            //location.href="#/select_car_type";

        }).catch(function(e) {
            console.trace('错误:', e);
        });*/
    },
    render(){
        let sumWidth=this.state.sumWidth;
        let widths=this.state.widths;
        let titles=this.state.titles;
        let headData = titles.map((item,index)=>{
            return {name:item,width:widths[index]+'px'};
        });
        document.getElementById("appContainer").style.width=200+sumWidth+"px";
        let list=this.state.orderData.map((item,index)=>{
            let data=[{order_no:item.serialnumber,fieldName:'OrderNo'},
                {username:item.username,phone_no:item.userphoneno,fieldName:'User'},
                {order_source:item.comefrom,fieldName:'OrderSource'},
                {car_no:item.carno,car_color:item.carcolor,car_brand:item.brand,fieldName:'Car'},
                {airport:item.terminalname,fieldName:'Airport'},
                {order_time:item.bookingtime,
                    back_time:item.returningflight+" "+item.returningdate,fieldName:'AdvanceTime'},
                {take_driver:item.parkingdrivername,fieldName:'TakeDriver'},
                {take_car_at:item.parkingstartedtime,in_garage_at:item.parkingfinishedtime,fieldName:'TakeCarStatus'},
                {send_driver:item.returningdrivername,fieldName:'SendDriver'},
                {send_car_start:item.returningstartedtime,
                    send_car_end:item.returningfinishedtime,fieldName:'SendCarStatus'}
                ,{pay_status:'未支付',fieldName:'PayStatus'}];
            return (<TableLine key={index} widths={widths} data={data} />);
        });
        return(
            <section className="data-section" style={{width:sumWidth+'px'}}>
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
                {list}
                <Page {...this.state.pageObj} paging={this.handlePageClick}/>
            </section>
        );
    }
});

export default OrderQuery;