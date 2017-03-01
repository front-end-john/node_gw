import React from 'react';
import ReactDOM from 'react-dom';
import TextInput from '../widgets/text_input';
import TableHead from '../widgets/table_head';
import CouponLine from '../widgets/coupon_line';
import IssueCoupon from "../dialog/issue_coupon";
import WarnTip from '../dialog/warn_tip';
import Loading from "../dialog/loading";
import Page from '../widgets/page';
import {maxNumber} from '../../util';
export default React.createClass({
    getInitialState(){
        return{
            orderData:[],
            pageObj:{},
            queryCondition:{},
            initWidths:[  150, 120,   100,  100,  120,    130,     130,      120,   120],
            titles:    ['ID','手机号','类型','状态','金额','领取时间','截止时间','活动来源','操作']
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
        }else if(key==="wx_nick"){
            this.state.queryCondition.nickname=val;
        }
    },
    handlePageQuery(page,pageSize){
        let url="/admin/api/coupons/list?";
        url+=queryStr.stringify({page:page,pagesize:pageSize});
        url+="&"+queryStr.stringify(this.state.queryCondition);
        console.log("优惠券查询url",url);
        this.switchLoading(true);
        fetch(url,{credentials: 'include'}).then((res)=>{
            console.log("优惠券列表响应："+res.status);
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
                    this.setState({orderData:obj.coupons});
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

    handleCouponIssue(){
        let mask=document.getElementById("dialogContainer");
        ReactDOM.render(<IssueCoupon  updateList={()=>this.handlePageQuery(1,10)} />, mask);
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
            let data=[{coupon_id:item.couponid,fieldName:'CouponID'},
                {phone_no:item.phoneno,fieldName:'PhoneNo'},
                {type_msg:item.showname,fieldName:'CouponType'},
                {status:item.status,fieldName:'CouponStatus'},
                {amount:item.money,fieldName:'MoneyAmount'},
                {receive_time:item.starttime,fieldName:'ReceiveCouponTime'},
                {deadline_time:item.endtime,fieldName:'DeadlineTime'},
                {source:item.comefrom,fieldName:'ActivitySource'},
                {coupon_id:item.couponid,fieldName:'Operation'}];
            return (<CouponLine key={index} widths={widths} data={data} updateList={()=>this.handlePageQuery(1,10)} />);
        });

        return(
            <section className="data-section"  style={{width:sumWidth+20}}>
                <div className="query-condition">
                    <TextInput title="用户手机：" change={this.handleChange} pdl="0" name="phone_no"
                               enter={()=>this.handlePageQuery(1,10)} holdText="请输入手机号"/>
                    <TextInput title="微信昵称：" change={this.handleChange} name="wx_nick"
                               enter={()=>this.handlePageQuery(1,10)} holdText="请输入微信昵称" />
                    <button className="query-btn" onClick={()=>this.handlePageQuery(1,10)}>查询</button>
                    <button className="checkout" onClick={this.handleCouponIssue}>发放优惠券</button>
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
