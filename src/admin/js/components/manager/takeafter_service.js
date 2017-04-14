import React from 'react';
import ReactDOM from 'react-dom';

import TextInput from '../widgets/text_input';
import TableHead from '../widgets/table_head';
import TableLine from '../widgets/table_line';
import WarnTip from '../dialog/warn_tip';
import Loading from "../dialog/loading";
import SelectInput from '../widgets/select_input';
import DateSelect from '../widgets/date_select';
import Page from '../widgets/page';
import {maintainState,maxNumber} from '../../util';

export default React.createClass({
    getInitialState(){
        return{
            orderData:[{}],
            pageObj:{},
            queryCondition:{ordertype:"all"},
            initWidths:[ 130,   100,   110,       130,        100,    130,       120,     100,  ],
            titles:    [ '用户','车辆','保养状态','司机是否推荐','车辆里程','返程信息','入库时间','订单来源']
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
    handleChange(e){
        let key=e.target.id;
        let val=e.target.value.trim();
        if(key==="car_brand"){
            this.state.queryCondition.brand=val;
        }else if(key==="order_source"){
            this.state.queryCondition.comefrom=val;
        }else if(key==="phone_no"){
            this.state.queryCondition.phoneno=val;
        }else if(key==="car_no"){
            this.state.queryCondition.carno=val;
        }
    },

    adaptScreen(){
        let initWidths=this.state.initWidths;
        let initSumWidth = initWidths.reduce((x,y)=>x+y);
        //补偿宽度
        let offsetWidth=225;
        //允许的最小宽度
        let minWidth=1240+offsetWidth,len=initWidths.length;
        let screenWidth=document.body.clientWidth-40;
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
    handlePageQuery(page, pageSize){
        let url="/api5/chorders/query?";
        let condition={page,pagesize:pageSize};
        url+=queryStr.stringify(condition);
        url+="&"+queryStr.stringify(this.state.queryCondition);
        console.log("车后订单列表url",url);
        this.switchLoading(true);
        fetch(url,{credentials: 'include'}).then((res)=>{
            console.log("车后订单列表响应："+res.status);
            this.switchLoading(false);
            if(+res.status < 400){
                return res.json();
            }else{
                throw new Error("服务异常");
            }
        }).then((obj)=>{
            console.log(obj);
            if(obj.code===0){
                this.setState({orderData:obj.records||[]});
                let pg=obj.pageObject;
                let amount=Math.ceil(pg.totalcount/pg.pagesize);
                this.setState({pageObj:{page:pg.page,pageCount:amount,pageSize:pg.pagesize}});
            }else {
                this.showWarnTip(obj.message);
            }
        }).catch((e)=>{
            console.trace('错误:', e);
        });
    },
    handleChStatusSwitch(type){
        this.state.queryCondition.ordertype=type;
        this.handlePageQuery(1,10);
    },
    render(){
        let sumWidth=this.state.sumWidth;
        let widths=this.state.widths;
        let titles=this.state.titles;
        let headData = titles.map((item,index)=>{
            return {name:item,width:widths[index]+'px'};
        });
        document.getElementById("appContainer").style.width= 200+sumWidth+'px';

        let list=this.state.orderData.map((item,index)=>{
            let mile=item.mileage===undefined?"":item.mileage+"km";
            let data=[
                {username:item.username,phone_no:item.userphoneno,order_no:item.chserialnumber,fieldName:'User'},
                {car_no:item.carno,car_color:item.carcolor,car_brand:item.brand,fieldName:'Car'},
                {status:maintainState(item.chorderstatus),fieldName:'MaintainStatus'},
                {refer:item.driverrecommended,fieldName:'DriverRecommend'},
                {miles:mile,fieldName:'CarMileage'},
                {back_flight:item.returningflight,back_time:item.returningdate,fieldName:'ReturnTicket'},
                {in_garage_time:item.parkingfinishtime,fieldName:'InGarageTime'},
                {order_source:item.ordercomefrom,is_end:true,fieldName:'OrderSource'}];
            return (<TableLine key={index} widths={widths} data={data}  section="take_after" />);
        });
        let orderType=this.state.queryCondition.ordertype;
        let tabList=[{status:"全部",value:"all"},{status:"待推荐",value:"toberecommended"},{status:"已推荐",value:"recommended"},
            {status:"用户已确认保养",value:"confirmed"},{status:"保养中",value:"inmaintainace"},{status:"保养已完成",value:"maintainacefinished"},
            {status:"已取消",value:"canceled"}, {status:"无需保养",value:"nomaintainace"},].map((item,index)=>{
            return (<li key={index} className={orderType===item.value?"selected":""}
                        onClick={()=>this.handleChStatusSwitch(item.value)}>{item.status}</li>)
        });
        return(
            <section className="data-section" style={{width:sumWidth+60}}>
                <div className="query-condition">
                    <SelectInput title="车辆品牌：" change={this.handleChange} pdl="0"
                                 name="car_brand" ref={(c)=>this.carBrand=c} />
                    <SelectInput title="订单来源：" change={this.handleChange}
                                 name="order_source" ref={(c)=>this.comefrom=c} />
                    <DateSelect title="入库时间：" change={(date)=>this.state.queryCondition.parkingfinisheddate=date}
                                ref={(c)=>this.inTime=c} />
                    <hr/>
                    <TextInput title="车主电话："  change={this.handleChange}  ref={(c)=>this.phoneNo=c} pdl="0"
                               enter={()=>this.handlePageQuery(1,10)} name="phone_no" holdText="请输入手机号"/>

                    <TextInput title="车牌号码："  change={this.handleChange}  ref={(c)=>this.carNo=c}
                               enter={()=>this.handlePageQuery(1,10)} name="car_no" holdText="请输入车牌号"/>
                    <DateSelect title="返程时间：" change={(date)=>this.state.queryCondition.returningdate=date}
                                ref={(c)=>this.returnTime=c} />
                    <button className="query-btn" onClick={()=>this.handlePageQuery(1,10)}>查询</button>
                </div>
                <ul className="tab-options">
                    {tabList}
                </ul>
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
