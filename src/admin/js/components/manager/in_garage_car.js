import React from 'react';
import ReactDOM from 'react-dom';
import TextScroll from '../widgets/text_scroll';
import TextInput from '../widgets/text_input';
import SelectInput from '../widgets/select_input';
import TableHead from '../widgets/table_head';
import TableLine from '../widgets/table_line';
import WarnTip from '../dialog/warn_tip';
import Page from '../widgets/page';
import {maxNumber} from '../../util';
let InGarageCar=React.createClass({
    getInitialState(){
        return{
            queryCondition:{},
            orderData:[],
            pageObj:{},
            initWidths:[ 130,    100,   110,   110,    110,  120,  110,       130,     120,      120,     120,     120],
            titles:    ['订单号','用户','标签','订单来源','车辆','机场','接车司机','入库时间','停车时长','返程航班','更多服务','航班状态']
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
        url+=queryStr.stringify({ordertype:'parkingparked',page:page,pagesize:pageSize});
        url+="&"+queryStr.stringify(this.state.queryCondition);
        fetch(url).then(function(res){
            console.log("查询订单列表响应状态："+res.status);
            if(+res.status < 400){
                return res.text();
            }else {
                throw new Error("服务异常");
            }
        }).then((str)=>{
            //console.log(str);
            try {
                let obj=JSON.parse(str);
                if(obj.code==0){
                    this.setState({orderData:obj.result});
                    this.setState({pageObj:{page:obj.page,pageCount:obj.pagecount,pageSize:obj.pagesize}});
                }else {
                    ReactDOM.render(<WarnTip msg={obj.msg}/>, mask);
                }
            }catch(e){
                ReactDOM.render(<WarnTip msg="后台服务异常！"/>, mask);
            }
        }).catch(function(e) {
            ReactDOM.render(<WarnTip msg="订单列表请求异常！"/>, mask);
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
        document.getElementById("appContainer").style.width=200+sumWidth+"px";
        let list=this.state.orderData.map((item,index)=>{
            let data=[{order_no:item.serialnumber,fieldName:'OrderNo'},
                {username:item.username,phone_no:item.userphoneno,fieldName:'User'},
                {tags:item.usertags,fieldName:'Label'},
                {order_source:item.comefrom,fieldName:'OrderSource'},
                {car_no:item.carno,car_color:item.carcolor,car_brand:item.brand,fieldName:'Car'},
                {airport:'广州白云',fieldName:'Airport'},
                {take_driver:'周当啊',fieldName:'TakeDriver'},
                {in_garage_time:"2016-8-9 15:14",fieldName:'InGarageTime'},
                {park_time_long:"4小时25分钟",fieldName:'ParkTimeLong'},
                {back_flight:"hu4564",back_time:"2017-1-21",fieldName:'ReturnTicket'},
                {wash:'下雨也洗车',oil:'汽油、92#、100元',fieldName:'MoreService'},
                {status:'起飞',start_time:"2016-12-12 14:14",fieldName:'ReturnFlightLaunchStatus'}];
            return (<TableLine key={index} widths={widths} data={data} />);
        });
        return(
            <section className="data-section" style={{width:sumWidth+20}}>
                <TextScroll />
                <div className="query-condition">
                    <SelectInput title="订单来源：" change={this.handleChange} pdl="0" name="order_source" defaultName="全部"/>
                    <TextInput title="订单号：" change={this.handleChange} name="order_no"
                               enter={()=>this.handlePageQuery(1,10)} holdText="请输入订单号" />
                    <TextInput title="用户手机：" change={this.handleChange} name="phone_no"
                               enter={()=>this.handlePageQuery(1,10)} holdText="请输入手机号"/>
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

export default InGarageCar;