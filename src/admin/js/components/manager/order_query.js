import React from 'react';
import ReactDOM from 'react-dom';

import TextInput from '../widgets/text_input';
import SelectInput from '../widgets/select_input';
import TableHead from '../widgets/table_head';
import TableLine from '../widgets/table_line';
import DateSelect from '../widgets/date_select';
import Page from '../widgets/page';
import WarnTip from '../dialog/warn_tip';
import Loading from "../dialog/loading";
import {getStateInfo,maxNumber} from '../../util';
export default React.createClass({
    getInitialState(){
        return{
            queryCondition:{},
            orderData:[],
            pageObj:{},
            initWidths:[  100,   80,     80,  100,   130,     130,       80,       130,         80,     130,  ],
            titles:    ['用户','订单来源','状态','车辆','预约机场','预约时间','接车司机','接车/入库时间','送车司机','出库/送还时间']
        };
    },
    showWarnTip(msg){
        let mask=document.getElementById("dialogContainer");
        if(msg===null){
            ReactDOM.render(<i/>, mask);
            mask.style.display="none";
        }else {
            ReactDOM.render(<WarnTip msg={msg}/>, mask);
        }
    },
    switchLoading(bl){
        let mask=document.getElementById("dialogContainer");
        if(bl){
            ReactDOM.render(<Loading />, mask);
        }else {
            ReactDOM.render(<i/>, mask);
            mask.style.display="none";
        }
    },
    handlePageQuery(page,pageSize){
        let url="/admin/api/orders/query?";
        url+=queryStr.stringify({ordertype:'all',page:page,pagesize:pageSize});

        let cond=this.state.queryCondition;
        if(cond.starttime){
            cond.timefilter=cond.timefilter||"parkingstartedtime";
        }
        url+="&"+queryStr.stringify(cond);
        console.log("全部订单查询url",url);
        this.switchLoading(true);
        fetch(url,{credentials: 'include'}).then((res)=>{
            console.log("全部订单查询响应："+res.status);
            this.switchLoading(false);
            if(+res.status < 400){
                return res.text();
            }else {
                throw new Error("服务异常");
            }
        }).then((str)=>{
            let obj=JSON.parse(str);
            if(obj.code===0){
                this.setState({orderData:obj.result});
                this.setState({pageObj:{page:obj.page,pageCount:obj.pagecount,pageSize:obj.pagesize}});
            }else {
                this.showWarnTip(obj.msg);
            }
        }).catch((e)=>{
            this.showWarnTip("网络请求异常！");
            console.trace('错误:', e);
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
            this.state.queryCondition.orderstatus=val;
        }
    },
    exportData(){
        console.log("导出数据");
    },
    clearCondition(){
        this.setState({queryCondition:{}});
        this.comefrom.reset();
        this.status.reset();
        this.airport.reset();
        this.timetype.reset();
        this.orderNo.reset();
        this.phoneNo.reset();
        this.carNo.reset();
        this.startTime.reset();
        this.endTime.reset();
    },
    adaptScreen(){
        let initWidths=this.state.initWidths;
        let initSumWidth = initWidths.reduce((x,y)=>x+y);
        //补偿宽度
        let offsetWidth=225;
        //允许的最小宽度
        let minWidth=1240+offsetWidth,len=initWidths.length;
        let screenWidth=document.body.clientWidth -40;
        let sumWidth=initSumWidth,widths=initWidths;
        let actulWidth=maxNumber(minWidth,screenWidth,sumWidth+offsetWidth);

        let incre=(actulWidth-offsetWidth-initSumWidth)/len;
        widths=initWidths.map((item)=>item+incre);
        sumWidth=widths.reduce((x,y)=>x+y);
        this.setState({sumWidth:sumWidth,widths});
    },
    componentWillMount(){
        this.adaptScreen();
        this.handlePageQuery(1,10);
    },
    componentDidMount(){
        window.addEventListener("resize",this.adaptScreen,false);
    },
    componentWillUnmount(){
        window.removeEventListener("resize",this.adaptScreen);
    },
    render(){
        let sumWidth=this.state.sumWidth;
        let widths=this.state.widths;
        let titles=this.state.titles;
        let headData = titles.map((item,index)=>{
            return {name:item,width:widths[index]+'px'};
        });

        document.getElementById("appContainer").style.width=sumWidth+200+"px";
        let list=this.state.orderData.map((item,index)=>{
            let states=getStateInfo(item.status);
            let cancelBg=+item.status===-1?"#f5f5f5":"#fff";
            let data=[
                {username:item.username,order_no:item.serialnumber,phone_no:item.userphoneno,fieldName:'User'},
                {order_source:item.comefrom,fieldName:'OrderSource'},
                {pay_status:states[0],color:states[1],fieldName:'PayStatus'},
                {car_no:item.carno,car_color:item.carcolor,car_brand:item.brand,fieldName:'Car'},
                {airport:item.terminalname,fieldName:'Airport'},
                {order_time:item.bookingtime,fieldName:'AdvanceTime',
                    back_time:(item.returningflight||"")+" "+(item.returningdate||"")},
                {oid:item.serialnumber,aid:item.airportid,did:item.parkingdriverid, os:item.status,
                    color:"#DB8800",take_driver:item.parkingdrivername,fieldName:'TakeDriver'},
                {take_car_at:item.parkingstartedtime,in_garage_at:item.parkingfinishedtime,fieldName:'TakeCarStatus'},
                {oid:item.serialnumber,aid:item.airportid,did:item.returningdriverid,os:item.status,
                    color:"#1A9FE5",send_driver:item.returningdrivername,fieldName:'SendDriver'},
                {send_car_start:item.returningstartedtime,
                    send_car_end:item.returningfinishedtime,fieldName:'SendCarStatus'}];
            return (<TableLine background={cancelBg} key={index} widths={widths} data={data} />);
        });
        return(
            <section className="data-section" style={{width:sumWidth+60}}>
                <div className="query-condition">
                    <SelectInput title="订单来源：" change={this.handleTextInputChange} pdl="0"
                                 name="order_source" ref={(c)=>this.comefrom=c} />
                    <SelectInput title={<span>&emsp;&emsp;订单状态：</span>} change={this.handleTextInputChange}
                                 ref={(c)=>this.status=c} name="order_status" />
                    <SelectInput title={<span>&emsp;&emsp;机&emsp;&emsp;场：</span>} ref={(c)=>this.airport=c}
                                 change={this.handleTextInputChange} name="airport" />
                    <hr/>
                    <TextInput title={<span>订&ensp;单&ensp;号：</span>} change={this.handleTextInputChange} pdl="0"
                               enter={()=>this.handlePageQuery(1,10)} name="order_no" holdText="请输入订单号"
                               ref={(c)=>this.orderNo=c}/>
                    <TextInput title={<span>&emsp;&emsp;用户手机：</span>} change={this.handleTextInputChange}
                               enter={()=>this.handlePageQuery(1,10)} name="phone_no" holdText="请输入手机号"
                               ref={(c)=>this.phoneNo=c}/>
                    <TextInput title={<span>&emsp;&emsp;车牌号码：</span>} change={this.handleTextInputChange}
                               enter={()=>this.handlePageQuery(1,10)} name="car_no" holdText="请输入车牌号"
                               ref={(c)=>this.carNo=c}/>
                    <button className="query-btn" style={{width:260}}
                            onClick={()=>this.handlePageQuery(1,10)}>查询</button>
                    <hr/>
                    <SelectInput title="筛选时间：" change={this.handleTextInputChange} pdl="0"
                                 name="time_type" defaultName="选择筛选的时间" ref={(c)=>this.timetype=c} />
                    <DateSelect title={<span>&emsp;&emsp;开始时间：</span>} format="YYYY-MM-DD"
                                change={(date)=>this.state.queryCondition.starttime=date}
                                ref={(c)=>this.startTime=c} />
                    <DateSelect title={<span>&emsp;&emsp;结束时间：</span>} format="YYYY-MM-DD"
                                change={(date)=>this.state.queryCondition.endtime=date}
                                ref={(c)=>this.endTime=c} />
                    <button className="checkout" style={{marginLeft:50}} onClick={this.exportData}>导出</button>
                    <button className="reset" onClick={this.clearCondition}>清空查询条件</button>
                </div>
                {list.length>0?(<div className="data-list">
                        <TableHead data={headData} />
                        {list}
                        <Page {...this.state.pageObj} paging={this.handlePageQuery}/>
                    </div>):(<div className="data-none">
                        <TableHead data={headData} />
                        <p><img src="/duck/img/icon/06.png" />暂时没有订单记录</p>
                    </div>)}
            </section>
        );
    }
});
