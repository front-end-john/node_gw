import React from 'react'
import ReactDOM from 'react-dom';
import TextInput from '../widgets/text_input'
import SelectInput from '../widgets/select_input'
import TableHead from '../widgets/table_head'
import TableLine from '../widgets/table_line'
import WarnTip from '../dialog/warn_tip';
import Loading from "../dialog/loading";
import Page from '../widgets/page';
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
        let val=e.target.value;
        if(key==="phone_no"){
            this.state.queryCondition.phoneno=val;
        }else if(key==="show_status"){
            this.state.queryCondition.state=val;
        }else if(key==="parking_driver"){
            this.state.queryCondition.parkingdriverid=val;
        }else if(key==="sending_driver"){
            this.state.queryCondition.returningdriverid=val;
        }else if(key==="service_star"){
            this.state.queryCondition.servicescore=val;
        }else if(key==="parking_star"){
            this.state.queryCondition.parkingscore=val;
        }else if(key==="sending_star"){
            this.state.queryCondition.returningscore=val;
        }
    },
    handlePageQuery(page,pageSize){
        let url="/admin/api/comments/list?";
        url+=queryStr.stringify({page:page,pagesize:pageSize});
        url+="&"+queryStr.stringify(this.state.queryCondition);
        console.log("评价列表url",url);
        this.switchLoading(true);
        fetch(url,{credentials: 'include'}).then((res)=>{
            console.log("评价列表响应："+res.status);
            this.switchLoading(false);
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
                    this.showWarnTip(obj.msg);
                }
            }catch(e){
                this.showWarnTip("数据异常");
            }
        }).catch((e)=>{
            this.showWarnTip("请求异常");
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
        document.getElementById("appContainer").style.width=sumWidth+200+'px';
        let list=this.state.orderData.map((item,index)=>{
            let data=[{order_no:item.serialnumber,fieldName:'OrderNo'},
                {username:item.username,phone_no:item.phoneno,fieldName:'User'},
                {car_no:item.carno,car_color:item.carcolor,car_brand:item.brand,fieldName:'Car'},
                {airport:item.terminalname,fieldName:'Airport'},
                {evaluate_time:item.commentcreatetime,fieldName:'EvaluateTime'},
                {evaluate_star_level:item.servicescore,fieldName:'EvaluateStarLevel'},
                {service_reply:item.responsecontent,fieldName:'CustomerServiceReply'},
                {status:item.showpublic,fieldName:'ShowStatus'},
                {order_id:item.orderid,show:item.showpublic,reply:item.responsecontent,fieldName:'CommentOperation'}];
            return (<TableLine key={index} widths={widths} data={data} />);
        });

        return(
            <section className="data-section" style={{width:sumWidth+20}}>
                <div className="query-condition">
                    <TextInput title="用户手机：" change={this.handleChange} pdl="0" name="phone_no" holdText="请输入手机号"/>
                    <SelectInput title="展现状态：" change={this.handleChange} name="show_status" />
                    <SelectInput title="接车司机：" change={this.handleChange} name="parking_driver" />
                    <SelectInput title="送车司机：" change={this.handleChange} name="sending_driver" />
                    <hr/>
                    <SelectInput title="服务打星：" change={this.handleChange} pdl="0" name="service_star" />
                    <SelectInput title="接车打星：" change={this.handleChange} name="parking_star" />
                    <SelectInput title="送车打星：" change={this.handleChange} name="sending_star" />
                    <button className="query-btn" onClick={()=>this.handleQuery(1,10)}>查询</button>
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

export default EvaluationManage;