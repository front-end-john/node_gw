import React from 'react';
import ReactDOM from 'react-dom';

import TextScroll from '../widgets/text_scroll';
import TextInput from '../widgets/text_input';
import SelectInput from '../widgets/select_input';
import TableHead from '../widgets/table_head';
import TableLine from '../widgets/table_line';
import DateSelect from '../widgets/date_select';
import Page from '../widgets/page';
import WarnTip from '../dialog/warn_tip';
import {getStateMsg} from '../../util';
let OrderQuery=React.createClass({
    getInitialState(){
        return{
            queryCondition:{},
            orderData:[],
            pageObj:{}
        };
    },
    handlePageQuery(page,pageSize){
        let mask=document.getElementById("dialogContainer");
        let url="/admin/api/orders/query?";
        url+=queryStr.stringify({ordertype:'all',page:page,pagesize:pageSize});
        url+="&"+queryStr.stringify(this.state.queryCondition);
        console.log("订单查询url",url);
        fetch(url).then(function(res){
            console.log("查询订单列表响应状态："+res.status);
            if(+res.status < 400){
                return res.text();
            }else {
                throw new Error("服务异常");
            }
        }).then((str)=>{
            let obj=JSON.parse(str);
            if(obj.code==0){
                this.setState({orderData:obj.result});
                this.setState({pageObj:{page:obj.page,pageCount:obj.pagecount,pageSize:obj.pagesize}});
            }else {
                ReactDOM.render(<WarnTip msg="订单列表数据异常！"/>, mask);
            }
        }).catch(function(e) {
            console.trace('错误:', e);
            ReactDOM.render(<WarnTip msg="网络请求异常！"/>, mask);
        });
    },
    handleTextInputChange(e){
        let key=e.target.id;
        let val=e.target.value;
        if(key==="phone_no"){
            this.state.queryCondition.phoneno=val;
        }else if(key==="car_no"){
            this.state.queryCondition.carno=val;
        }else if(key==="order_source"){
            this.state.queryCondition.comefrom=val;
        }else if(key==="order_no"){
            this.state.queryCondition.serialnumber=val;
        }else if(key==="time_type"){
            this.state.queryCondition.timefilter=val;
        }else if(key==="airport"){
            this.state.queryCondition.airportid=val;
        }else if(key==="order_status"){
            this.state.queryCondition.status=val;
        }
    },
    exportData(){
        console.log("导出数据");
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
        this.handlePageQuery(1,10);
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
                    back_time:(item.returningflight||"")+" "+(item.returningdate||""),fieldName:'AdvanceTime'},
                {take_driver:item.parkingdrivername,fieldName:'TakeDriver'},
                {take_car_at:item.parkingstartedtime,in_garage_at:item.parkingfinishedtime,fieldName:'TakeCarStatus'},
                {send_driver:item.returningdrivername,fieldName:'SendDriver'},
                {send_car_start:item.returningstartedtime,
                    send_car_end:item.returningfinishedtime,fieldName:'SendCarStatus'}
                ,{pay_status:getStateMsg(item.status),fieldName:'PayStatus'}];
            return (<TableLine key={index} widths={widths} data={data} />);
        });
        return(
            <section className="data-section" style={{width:sumWidth+'px'}}>
                <TextScroll />
                <div className="query-condition">
                    <SelectInput title="订单来源:" change={this.handleTextInputChange} name="order_source" defaultName="全部"/>
                    <SelectInput title="订单状态:" change={this.handleTextInputChange} name="order_status" defaultName="全部"/>
                    <SelectInput title={<span>机&emsp;&emsp;场:</span>} change={this.handleTextInputChange} name="airport" defaultName="全部"/>
                    <hr/>
                    <TextInput title={<span>订&ensp;单&ensp;号:</span>} change={this.handleTextInputChange} name="order_no" holdText="请输入订单号" />
                    <TextInput title="用户手机:" change={this.handleTextInputChange} name="phone_no" holdText="请输入手机号"/>
                    <TextInput title="车牌号码:" change={this.handleTextInputChange} name="car_no" holdText="请输入车牌号" />
                    <hr/>
                    <SelectInput title="筛选时间:" change={this.handleTextInputChange} name="time_type" defaultName="选择筛选的时间"/>
                    <DateSelect title="开始时间:" change={(date)=>this.state.queryCondition.starttime=date} />
                    <DateSelect title="结束时间:" change={(date)=>this.state.queryCondition.endtime=date}  />
                    <button className="query-btn" onClick={()=>this.handlePageQuery(1,10)}>查询</button>
                    <button className="checkout" onClick={this.exportData}>导出</button>
                </div>
                <div className="data-list">
                    <TableHead data={headData} />
                    {list}
                    <Page {...this.state.pageObj} paging={this.handlePageQuery}/>
                </div>
            </section>
        );
    }
});

export default OrderQuery;