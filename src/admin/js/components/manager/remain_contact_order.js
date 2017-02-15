import React from 'react';
import ReactDOM from 'react-dom';
import TextScroll from '../widgets/text_scroll';
import TextInput from '../widgets/text_input';
import SelectInput from '../widgets/select_input';
import TableHead from '../widgets/table_head';
import TableLine from '../widgets/table_line';
import ErrorTip from '../dialog/warn_tip';
import Page from '../widgets/page';
import {maxNumber} from '../../util';
let RemainContactOrder=React.createClass({
    getInitialState(){
        return{
            queryCondition:{},
            orderData:[],
            pageObj:{},
            initWidths:[ 130,    120,  120,   100,      130,      120,     140,     130,      120,     120,    80],
            titles:    ['订单号','用户','标签','订单来源','下单时间','车辆','去程航站楼','预约时间','返程信息','更多服务','操作']
        };
    },
    handleChange(e){
        let key=e.target.id;
        let val=e.target.value;
        if(key==="phone_no"){
            this.state.queryCondition.phoneno=val;
        }else if(key==="order_source"){
            this.state.queryCondition.comefrom=val;
        }else if(key==="order_no"){
            this.state.queryCondition.serialnumber=val;
        }
    },
    handlePageQuery(page,pageSize){
        let mask=document.getElementById("dialogContainer");
        let url="/admin/api/orders/query?";
        url+=queryStr.stringify({ordertype:'booking',page:page,pagesize:pageSize});
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
                ReactDOM.render(<ErrorTip msg="订单列表数据异常！"/>, mask);
            }
        }).catch(function(e) {
            console.trace('错误:', e);
            ReactDOM.render(<ErrorTip msg="订单列表请求异常！"/>, mask);
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
        document.getElementById("appContainer").style.width=200+sumWidth+"px";

        let list=this.state.orderData.map((item,index)=>{
            let flight=item.returningflight=="null"?item.returningflight:"";
            let returnDate=item.returningdate=="null"?item.returningdate:"";
            let services=item.serviceorders;
            let data=[{order_no:item.serialnumber,fieldName:'OrderNo'},
                {username:item.username,phone_no:item.userphoneno,fieldName:'User'},
                {tags:item.usertags,fieldName:'Label'},
                {order_source:item.comefrom,fieldName:'OrderSource'},
                {order_time:item.createtime,fieldName:'OrderTime'},
                {car_no:item.carno,car_color:item.carcolor,car_brand:item.brand,fieldName:'Car'},
                {terminal:item.terminalname,fieldName:'OnwardTerminal'},
                {session:item.bookingtime,fieldName:'Session'},
                {back_flight:flight,back_time:returnDate,fieldName:'ReturnTicket'},
                {wash:services[0]?'洗车':"",oil:services[1]?'加油':"",fieldName:'MoreService'},
                {op_items:["电话确认"],color:"#DB8800",fieldName:'TelEnsureOperation'}];
            return (<TableLine key={index} widths={widths} data={data} />);
        });
        return(
            <section className="data-section" style={{width:sumWidth+20}}>
                <TextScroll />
                <div className="query-condition">
                    <SelectInput title="订单来源：" change={this.handleChange} pdl="0" name="order_source" defaultName="全部"/>
                    <TextInput title="订单号：" change={this.handleChange}
                               enter={()=>this.handlePageQuery(1,10)} name="order_no" holdText="请输入订单号" />
                    <TextInput title="用户手机：" change={this.handleChange}
                               enter={()=>this.handlePageQuery(1,10)} name="phone_no" holdText="请输入手机号"/>
                    <button className="query-btn" onClick={()=>this.handlePageQuery(1,10)}>查询</button>
                    <button className="checkout">下单</button>
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

export default RemainContactOrder;