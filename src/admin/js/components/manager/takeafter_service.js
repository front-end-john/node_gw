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
import {decDatetime,maxNumber} from '../../util';

let JSJOrder=React.createClass({
    getInitialState(){
        return{
            orderData:[{},{}],
            pageObj:{},
            queryCondition:{},
            initWidths:[ 130,   100,   110,       130,        100,    130,       120,     100,     120],
            titles:    [ '用户','车辆','保养状态','司机是否推荐','车辆里程','返程信息','入库时间','订单来源','其他服务']
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
        if(key==="phone_no"){
            this.state.queryCondition.phoneno=val;
        }else if(key==="user_name"){
            this.state.queryCondition.username=val;
        }else if(key==="order_no"){
            this.state.queryCondition.serialnumber=val;
        }
    },
    componentWillReceiveProps(nextProps){
        /**
         * flag值改变时切换订单状态，更新列表数据
         */
        if(nextProps.location.query.flag!==this.props.location.query.flag){
            this.props=nextProps;
            this.name.textIn.value="";
            this.phone.textIn.value="";
            this.number.textIn.value="";
            this.setState({queryCondition:{}},()=>{
                this.handlePageQuery(1,10);
            });
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
        /*let url="/jsj/system/query?";
        let ordertype=this.props.location.query.flag;
        let condition={ordertype,page,pagesize:pageSize};
        url+=queryStr.stringify(condition);
        url+="&"+queryStr.stringify(this.state.queryCondition);
        console.log("jsj订单列表url",url);
        this.switchLoading(true);
        fetch(url,{credentials: 'include'}).then((res)=>{
            console.log("jsj订单列表响应："+res.status);
            this.switchLoading(false);
            if(+res.status < 400){
                return res.text();
            }else{
                throw new Error("服务异常");
            }
        }).then((str)=>{
            let obj=JSON.parse(str);
            if(obj.code==0){
                this.setState({orderData:obj.records||[]});
                this.setState({pageObj:{page:obj.page,pageCount:obj.pagecount,pageSize:obj.pagesize}});
            }else {
                this.showWarnTip(obj.message);
            }
        }).catch((e)=>{
            this.showWarnTip("请求接送机列表异常！");
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
        document.getElementById("appContainer").style.width= 200+sumWidth+'px';
        let list=this.state.orderData.map((item,index)=>{
            let moreService=item.serviceorders||[];
            let type1=(moreService[0]||{}).servicetype;
            let wash=moreService[0]||{},oil=moreService[1]||{};
            if(type1==10) {
                oil=moreService[0]||{};
                wash=moreService[1]||{};
            }
            let wColor=(wash.status || wash.status===0)?(wash.status===0?"#f00":"#1AA0E5"):"#323232";
            let oColor=(oil.status || oil.status===0)?(oil.status===0?"#f00":"#1AA0E5"):"#323232";
            let washConfig=wash.config,oilConfig=oil.config;
            let washCar=washConfig?(washConfig.rainwashing==1?"下雨也洗车":"下雨不洗车"):"无";
            let addOil=oilConfig?(oilConfig.oiltype||"")+" "+(oilConfig.oillabel||"")+" "+(oilConfig.money||""):"无";
            let data=[
                {username:"张先生",phone_no:"15866668888",order_no:item.serialnumber,fieldName:'User'},
                {car_no:"粤B56789",car_color:"灰色",car_brand:"宝马X5",fieldName:'Car'},
                {status:"已推荐",fieldName:'MaintainStatus'},
                {refer:"已到保养里程",fieldName:'DriverRecommend'},
                {miles:"51623 km",fieldName:'CarMileage'},
                {back_flight:item.returningflight,back_time:item.returningdate,fieldName:'ReturnTicket'},
                {in_garage_time:"2017-04-06 18:30",fieldName:'InGarageTime'},
                {order_source:item.comefrom,fieldName:'OrderSource'},
                {wash:washCar,oil:addOil,colors:[wColor,oColor],ids:[wash.serviceorderid,oil.serviceorderid],
                    os:item.status, name:item.username,is_end:true,phone:item.userphoneno,fieldName:'MoreService'}];
            return (<TableLine key={index} widths={widths} data={data} section="take_after" />);
        });
        return(
            <section className="data-section" style={{width:sumWidth+60}}>
                <div className="query-condition">
                    <SelectInput title="车辆品牌：" change={this.handleChange} pdl="0"
                                 name="car_brand" ref={(c)=>this.carBrand=c} />
                    <SelectInput title="订单来源：" change={this.handleChange}
                                 name="order_source" ref={(c)=>this.comefrom=c} />
                    <DateSelect title="入库时间：" change={(date)=>this.state.queryCondition.inTime=date}
                                ref={(c)=>this.inTime=c} />
                    <hr/>
                    <TextInput title="车主电话："  change={this.handleChange}  ref={(c)=>this.phoneNo=c} pdl="0"
                               enter={()=>this.handlePageQuery(1,10)} name="phone_no" holdText="请输入手机号"/>

                    <TextInput title="车牌号码："  change={this.handleChange}  ref={(c)=>this.carNo=c}
                               enter={()=>this.handlePageQuery(1,10)} name="car_no" holdText="请输入车牌号"/>
                    <DateSelect title="返程时间：" change={(date)=>this.state.queryCondition.returnTime=date}
                                ref={(c)=>this.returnTime=c} />
                    <button className="query-btn" onClick={()=>this.handlePageQuery(1,10)}>查询</button>
                </div>
                <ul className="tab-options">
                    <li>全部订单</li>
                    <li>待推荐</li>
                    <li>已推荐</li>
                    <li>用户确认需保养</li>
                    <li>保养中</li>
                    <li>保养完成</li>
                    <li>已取消</li>
                    <li>无需保养</li>
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

export default JSJOrder;