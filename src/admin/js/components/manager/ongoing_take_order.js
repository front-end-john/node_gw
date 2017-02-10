import React from 'react';
import ReactDOM from 'react-dom';
import TextScroll from '../widgets/text_scroll';
import TextInput from '../widgets/text_input';
import SelectInput from '../widgets/select_input';
import TableHead from '../widgets/table_head';
import TableLine from '../widgets/table_line';
import ErrorTip from '../dialog/warn_tip';
import Page from '../widgets/page';
let OngoingTakeOrder=React.createClass({
    getInitialState(){
        return{
            queryCondition:{},
            orderData:[],
            pageObj:{}
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
        url+=queryStr.stringify({ordertype:'parkinggoing',page:page,pagesize:pageSize});
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
        let widths=[  130,   120,   120,  120,    120,    120,    130,     120,      130,      130];
        let titles=['订单号','用户','标签','订单来源','车辆','航站楼','预约时间','接车司机','分配时间','开始接车时间'];
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
                {tags:item.usertags,fieldName:'Label'},
                {order_source:item.comefrom,fieldName:'OrderSource'},
                {car_no:item.carno,car_color:item.carcolor,car_brand:item.brand,fieldName:'Car'},
                {city:'',terminal:item.terminalname,fieldName:'OnwardTerminal'},
                {session:item.bookingtime,fieldName:'Session'},
                {take_driver:item.parkingdrivername,color:"#DB8800",fieldName:'TakeDriver'},
                {assign_time:item.parkingassignedtime,fieldName:'AssignTime'},
                {start_take_time:item.parkingstartedtime,fieldName:'StartTakeTime'}];
            return (<TableLine key={index} widths={widths} data={data} />);
        });
        return(
            <section className="data-section" style={{width:sumWidth}}>
                <TextScroll />
                <div className="query-condition">
                    <SelectInput title="订单来源:" change={this.handleChange} name="order_source" defaultName="全部"/>
                    <TextInput title="订单号:" change={this.handleChange} name="order_no" holdText="请输入订单号" />
                    <TextInput title="用户手机:" change={this.handleChange} name="phone_no" holdText="请输入手机号"/>
                    <button className="query-btn" onClick={()=>this.handlePageQuery(1,10)}>查询</button>
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

export default OngoingTakeOrder;