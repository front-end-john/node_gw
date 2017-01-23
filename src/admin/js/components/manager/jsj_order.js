import React from 'react';
import ReactDOM from 'react-dom';
import TextScroll from '../widgets/text_scroll';
import TextInput from '../widgets/text_input';
import TableHead from '../widgets/table_head';
import TableLine from '../widgets/table_line';
import ErrorTip from '../dialog/error_tip';
import Page from '../widgets/page';
import {decDatetime} from '../../util';

let JSJOrder=React.createClass({
    getInitialState(){
        return{
            queryUrl:"/jsj/system/orderlist",
            orderData:[],
            pageObj:{},
            queryCondition:{
                username:"",
                order_no:"",
                phone_no:""
            }
        };
    },
    handleChange(e){
        let key=e.target.id;
        let val=e.target.value.trim();
        if(key==="phone_no"){
            this.state.queryCondition.phone_no=val;
        }else if(key==="username"){
            this.state.queryCondition.username=val;
        }else if(key==="order_no"){
            this.state.queryCondition.order_no=val;
        }
    },
    componentWillReceiveProps(nextProps){
        /**
         * flag值改变时切换订单状态，更新列表数据
         */
        if(nextProps!=this.props){
            this.props=nextProps;
            this.handleQueryList(1,10);
        }
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
    handleClickQuery(){
        this.state.queryUrl="/jsj/system/query";
        this.handleQueryList(1,10);
    },
    handleQueryList(page, pageSize){
        let qc=this.state.queryCondition;
        let mask=document.getElementById("dialogContainer");
        let url=this.state.queryUrl+"?";
        let ordertype=this.props.location.query.flag;
        let condition={ordertype,page,pagesize:pageSize};
        if(url.indexOf("query")>-1){
            condition.username=qc.username;
            condition.phoneno=qc.phone_no;
            condition.serialnumber=qc.order_no;
        }
        url+=queryStr.stringify(condition);
        fetch(url).then(function(res){
            console.log("查询订单列表响应状态："+res.status);
            if(+res.status < 400){
                return res.text();
            }else{
                throw new Error("服务异常");
            }
        }).then((str)=>{
            let obj=JSON.parse(str);
            console.log("接送机列表数据：",obj);
            if(obj.code==0){
                this.setState({orderData:obj.records||[]});
                this.setState({pageObj:{page:obj.page,pageCount:obj.pagecount,pageSize:obj.pagesize}});
            }else {
                ReactDOM.render(<ErrorTip msg={obj.message}/>, mask);
            }
        }).catch(function(e) {
            ReactDOM.render(<ErrorTip msg="请求接送机列表异常！"/>, mask);
            console.trace('错误:', e);
        });
    },
    componentWillMount(){
        let widths=[  140,   120,  110,  130,  120,    120,     130,      130,        120,     100];
        let titles=['订单号','用户','标签','下单时间','出发地','目的地','航班号','预约时间','预约车型','订单状态'];
        this.adaptScreen(widths,titles);
        this.handleQueryList(1,10);
    },
    render(){
        let type=this.props.location.query.flag;
        let sumWidth=this.state.sumWidth;
        let widths=this.state.widths;
        let titles=this.state.titles;
        let headData = titles.map((item,index)=>{
            return {name:item,width:widths[index]+'px'};
        });
        document.getElementById("appContainer").style.width= 200+sumWidth+'px';

        let list=this.state.orderData.map((item,index)=>{
            let {year,month,day,hour,minute} =decDatetime(item.createtime);
            let {year:year1,month:mon1,day:day1,hour:hour1,minute:min1} =decDatetime(item.bookingtime);
            let {year:year2,month:mon2,day:day2} =decDatetime(item.flightdate);
            let data=[
                {order_no:item.serialnumber,fieldName:'OrderNo'},
                {username:item.username,phone_no:item.phoneno,fieldName:'User'},
                {tags:item.tags,fieldName:'Label'},
                {create_order_time:year+"-"+month+"-"+day+" "+hour+":"+minute,fieldName:'CreateOrderTime'},
                {local:"",address:item.startaddress,fieldName:'StartAddress'},
                {address:item.endaddress,fieldName:'EndAddress'},
                {number:item.flightnumber.toUpperCase(),launch_time:year2+"-"+mon2+"-"+day2,fieldName:'FlightNumber'},
                {booking_time:year1+"-"+mon1+"-"+day1+" "+hour1+":"+min1,fieldName:'BookingTime'},
                {type:item.cartypename+'型',car_brief:item.cartypedescription,fieldName:'CarType'},
                {status:item.statusdescription,color:"#f00",fieldName:'OrderStatus'}];
            return (<TableLine key={index} widths={widths} data={data} section="jsj" type={type} />);
        });

        return(
            <section className="data-section" style={{width:sumWidth}}>
                <TextScroll />
                <div className="query-condition">
                    <TextInput title="用户姓名:" change={this.handleChange} name="username" holdText="请输入用户姓名" />
                    <TextInput title="用户手机:" change={this.handleChange} name="phone_no" holdText="请输入手机号"/>
                    <TextInput title="订单号:" change={this.handleChange} name="order_no" holdText="请输入订单号" />
                    <button className="query-btn" onClick={this.handleClickQuery}>查询</button>
                </div>
                <TableHead data={headData} />
                {list}
                <Page {...this.state.pageObj} paging={this.handleQueryList}/>
            </section>
        );
    }
});

export default JSJOrder;