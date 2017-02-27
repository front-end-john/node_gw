import React from 'react';
import ReactDOM from 'react-dom';
import SelectInput from '../widgets/select_input';
import TableHead from '../widgets/table_head';
import TableLine from '../widgets/table_line';
import WarnTip from '../dialog/warn_tip';
import Page from '../widgets/page';
import {maxNumber} from '../../util';
export default React.createClass({
    getInitialState(){
        return{
            queryCondition:{},
            orderData:[],
            pageObj:{},
            initWidths:[ 120,    110,  110,    110,   110,  110,   120,      110,      120,       130,         130,    120],
            titles:    ['订单号','用户','标签','订单来源','车辆','机场','返程航班','航班状态','回程航站楼','预约取车时间','更多服务','操作']
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
        url+=queryStr.stringify({ordertype:'returningassigning',page:page,pagesize:pageSize});
        url+="&"+queryStr.stringify(this.state.queryCondition);
        console.log("订单查询url",url);
        fetch(url).then((res)=>{
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
                this.showWarnTip(obj.msg);
            }
        }).catch((e)=>{
            this.showWarnTip("请求异常！");
            console.trace('错误:', e);
        });
    },
    adaptScreen(){
        let initWidths=this.state.initWidths;
        let initSumWidth = initWidths.reduce((x,y)=>x+y);
        //补偿宽度
        let offsetWidth=260;
        //允许的最小宽度
        let minWidth=1400+offsetWidth,len=initWidths.length;
        let screenWidth=document.body.clientWidth;
        let sumWidth=initSumWidth,widths=initWidths;
        let actulWidth=maxNumber(minWidth,screenWidth,sumWidth+offsetWidth);

        let incre=(actulWidth-offsetWidth-initSumWidth)/len;
        widths=initWidths.map((item)=>item+incre);
        sumWidth=widths.reduce((x,y)=>x+y);
        this.setState({sumWidth:sumWidth+40,widths});
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
        document.getElementById("appContainer").style.width=200+sumWidth+'px';
        let list=this.state.orderData.map((item,index)=>{
            let data=[{order_no:item.serialnumber,fieldName:'OrderNo'},
                {username:item.username,phone_no:item.userphoneno,fieldName:'User'},
                {tags:item.usertags,fieldName:'Label'},
                {order_source:item.comefrom,fieldName:'OrderSource'},
                {car_no:item.carno,car_color:item.carcolor,car_brand:item.brand,fieldName:'Car'},
                {airport:'广州白云',fieldName:'Airport'},
                {back_flight:"hu4564",back_time:"2017-1-21",fieldName:'ReturnTicket'},
                {status:'落地',start_time:"已过去10分钟",fieldName:'ReturnFlightLandStatus'},
                {terminal:'白云T1',fieldName:'ReturnTerminal'},
                {order_fetch_time:"2016-8-9 15:14",fieldName:'OrderFetchTime'},
                {wash:'下雨也洗车',oil:'汽油、92#、100元',fieldName:'MoreService'},
                {op_items:["分配送车司机"],dialogs:[1],color:"#1A9FE5",fieldName:'Operation'}];
            return (<TableLine key={index} widths={widths} data={data} />);
        });

        return(
            <section className="data-section" style={{width:sumWidth+20}}>
                <div className="query-condition">
                    <SelectInput title="订单来源：" change={this.handleChange} pdl="0" name="order_source"/>
                    <SelectInput title={<span>&emsp;&emsp;机&emsp;&emsp;场：</span>}
                                 change={this.handleTextInputChange} name="airport" />
                    <button className="query-btn" onClick={()=>this.handlePageQuery(1,10)}>查询</button>
                </div>

                {list.length>0?(<div className="data-list">
                        <TableHead data={headData} />
                        {list}
                        <Page {...this.state.pageObj} paging={this.handlePageQuery}/>
                    </div>):(<div className="data-none">
                        <TableHead data={headData} />
                        <p><img src="/admin/img/icon/06.png" />暂时没有订单记录</p>
                    </div>)}
            </section>
        );
    }
});
