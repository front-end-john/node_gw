import React from 'react';
import ReactDOM from 'react-dom';
import SelectInput from '../widgets/select_input';
import TableHead from '../widgets/table_head';
import TableLine from '../widgets/table_line';
import WarnTip from '../dialog/warn_tip';
import Loading from "../dialog/loading";
import CreateOrder from '../dialog/customer_service_order';
import Page from '../widgets/page';
import {maxNumber} from '../../util';
export default React.createClass({
    getInitialState(){
        return{
            queryCondition:{},
            orderData:[],
            pageObj:{},
            initWidths:[  90,   90,   100,    100,     120,     120,      120,     100,    80],
            titles:    [ '用户','标签','订单来源','车辆', '预约机场','预约时间','返程信息','更多服务','操作']
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
    handleCreateOrder(){
        let mask=document.getElementById("dialogContainer");
        ReactDOM.render(<CreateOrder updateList={()=>this.handlePageQuery(1,10)}/>, mask);
    },
    handleChange(e){
        let key=e.target.id;
        let val=e.target.value;
        if(key==="order_source"){
            this.state.queryCondition.comefrom=val;
        }else if(key==="airport"){
            this.state.queryCondition.airportid=val;
        }
    },
    handlePageQuery(page,pageSize){
        let url="/admin/api/orders/query?";
        url+=queryStr.stringify({ordertype:'booking',page:page,pagesize:pageSize});
        url+="&"+queryStr.stringify(this.state.queryCondition);
        console.log("待联系订单url",url);
        this.switchLoading(true);
        fetch(url,{credentials: 'include'}).then((res)=>{
            console.log("待联系订单响应："+res.status);
            this.switchLoading(false);
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
                this.showWarnTip("数据异常！");
            }
        }).catch((e)=> {
            this.showWarnTip("请求异常！");
            console.trace('错误:', e);
        });
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
    render(){
        let sumWidth=this.state.sumWidth;
        let widths=this.state.widths;
        let titles=this.state.titles;
        let headData = titles.map((item,index)=>{
            return {name:item,width:widths[index]+'px'};
        });
        document.getElementById("appContainer").style.width=200+sumWidth+"px";

        let list=this.state.orderData.map((item,index)=>{
            let flight=item.returningflight;
            let returnDate=item.returningdate;
            let moreService=item.serviceorders||[];
            let type1=(moreService[0]||{}).servicetype;
            let wash=moreService[0]||{},oil=moreService[1]||{};
            if(type1==10) {
                oil=moreService[0]||{};
                wash=moreService[1]||{};
            }
            let wColor=(wash.status || wash.status===0)?(wash.status==0?"#f00":"#1AA0E5"):"#323232";
            let oColor=(oil.status || oil.status===0)?(oil.status==0?"#f00":"#1AA0E5"):"#323232";
            let washConfig=wash.config,oilConfig=oil.config;
            let washCar=washConfig?(washConfig.rainwashing=="1"?"下雨也洗车":"下雨不洗车"):"";
            let addOil=oilConfig?(oilConfig.oiltype||"")+" "+(oilConfig.oillabel||"")+" "+(oilConfig.money||""):"";

            let data=[/*{order_no:item.serialnumber,fieldName:'OrderNo'},*/
                {username:item.username,phone_no:item.userphoneno,order_no:item.serialnumber,fieldName:'User'},
                {tags:item.usertags,fieldName:'Label'},
                {order_source:item.comefrom,fieldName:'OrderSource'},
              /*  {order_time:item.createtime,fieldName:'OrderTime'},*/
                {car_no:item.carno,car_color:item.carcolor,car_brand:item.brand,fieldName:'Car'},
                {terminal:item.terminalname,fieldName:'OnwardTerminal'},
                {session:item.bookingtime,os:item.status,fieldName:'Session'},
                {back_flight:flight,back_time:returnDate,fieldName:'ReturnTicket'},
                {wash:washCar,oil:addOil,colors:[wColor,oColor],fieldName:'MoreService'},
                {oid:item.serialnumber,fieldName:'TelEnsureOperation'}];
            return (<TableLine key={index} widths={widths} data={data} updateList={()=>this.handlePageQuery(1,10)}/>);
        });
        return(
            <section className="data-section" style={{width:sumWidth+60}}>
                <div className="query-condition">
                    <SelectInput title="订单来源：" change={this.handleChange} pdl="0" name="order_source"/>
                    <SelectInput title={<span>&emsp;&emsp;机&emsp;&emsp;场：</span>}
                                 change={this.handleChange} name="airport" />
                    <button className="query-btn" onClick={()=>this.handlePageQuery(1,10)}>查询</button>
                    <button className="checkout" onClick={this.handleCreateOrder}>下单</button>
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
