import React from 'react'

import TextScroll from '../widgets/text_scroll'
import TextInput from '../widgets/text_input'
import SelectInput from '../widgets/select_input'
import TableHead from '../widgets/table_head'
import TableLine from '../widgets/table_line'
import {maxNumber} from '../../util';
let EvaluationManage=React.createClass({
    getInitialState(){
        return{
            orderData:[],
            pageObj:{},
            queryCondition:{},
            initWidths:[ 150,   120,  120,  130,    130,     130,      160,     110,   120],
            titles:    ['订单号','用户','车辆','机场','评价时间','评价星级','客服回复','展现状态','操作']
        };
    },
    handleChange(e){
        let key=e.target.id;
        let val=e.target.value;
        if(key==="phone_no"){
            this.state.queryCondition.phone_no=val;
        }else if(key==="order_source"){
            this.state.queryCondition.order_source=val;
        }else if(key==="order_no"){
            this.state.queryCondition.order_no=val;
        }
    },
    handlePageQuery(){
        console.log(this.state.queryCondition);
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
        document.getElementById("appContainer").style.width=sumWidth+200+'px';

        let data=[{order_no:'1445515665454',fieldName:'OrderNo'},
            {username:"中小屋",phone_no:"124578654",fieldName:'User'},
            {car_no:'奥B4878',car_color:'白色',car_brand:'宝马',fieldName:'Car'},
            {airport:'广州白云',fieldName:'Airport'},
            {evaluate_time:'2016-12-12 14:14',fieldName:'EvaluateTime'},
            {evaluate_star_level:5,fieldName:'EvaluateStarLevel'},
            {service_reply:"未回复",fieldName:'CustomerServiceReply'},
            {status:"仅此用户可见",fieldName:'ShowStatus'},
            {op_items:['展现','回复'],dialogs:[1,2],color:"#1A9FE5",fieldName:'Operation'}];
        return(
            <section className="data-section" style={{width:sumWidth+20}}>
                <TextScroll />
                <div className="query-condition">

                    <TextInput title="用户手机：" change={this.handleChange} pdl="0" name="phone_no" holdText="请输入手机号"/>
                    <SelectInput title="展现状态：" change={this.handleChange} name="order_source" defaultName="全部"/>
                    <SelectInput title="泊车司机：" change={this.handleChange} name="order_source" defaultName="全部"/>
                    <SelectInput title="送车司机：" change={this.handleChange} name="order_source" defaultName="全部"/>
                    <hr/>
                    <SelectInput title="服务打星：" change={this.handleChange} pdl="0" name="order_source" defaultName="全部"/>
                    <SelectInput title="泊车打星：" change={this.handleChange} name="order_source" defaultName="全部"/>
                    <SelectInput title="送车打星：" change={this.handleChange} name="order_source" defaultName="全部"/>
                    <button className="query-btn" onClick={this.handleQuery}>查询</button>
                </div>
                <div className="data-list">
                    <TableHead data={headData} />
                    <TableLine widths={widths} data={data} />
                    <TableLine widths={widths} data={data} />
                    <TableLine widths={widths} data={data} />
                    <TableLine widths={widths} data={data} />
                </div>
            </section>
        );
    }
});

export default EvaluationManage;