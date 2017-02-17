import React from 'react';
import ReactDOM from 'react-dom';
import TextScroll from '../widgets/text_scroll';
import TextInput from '../widgets/text_input';
import TableHead from '../widgets/table_head';
import UserLine from '../widgets/user_line';

import EditImportantUser from "../dialog/operate_important_user";
import {maxNumber} from '../../util';
let UserManager=React.createClass({
    getInitialState(){
        return{
            orderData:[],
            pageObj:{},
            queryCondition:{},
            initWidths:[150,    120,   100,    130,    140,   140,      140,   120],
            titles:    ['手机号','姓名','性别','重要等级','标注','标星时间','注册时间','操作']
        };
    },
    handleChange(e){
        let key=e.target.id;
        let val=e.target.value;
        if(key==="phone_no"){
            this.state.queryCondition.phone_no=val;
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
    handleImportantUser(type){
        let mask=document.getElementById("dialogContainer");
        ReactDOM.render(<EditImportantUser type={type}
                                           phone={this.phone||""} stars={this.stars||""} remark={""}
                                           url="/admin/api/users/marking"
                                           reload={this.loadOrderDetail} />, mask);
    },
    render(){
        let sumWidth=this.state.sumWidth;
        let widths=this.state.widths;
        let titles=this.state.titles;
        let headData = titles.map((item,index)=>{
            return {name:item,width:widths[index]+'px'};
        });
        document.getElementById("appContainer").style.width= 200+sumWidth+'px';

        let data=[{phone_no:'14572584545',fieldName:'PhoneNo'},
            {full_name:"中小屋",fieldName:'FullName'},
            {gender:"男",fieldName:'Gender'},
            {level:2,fieldName:'ImportantLevel'},
            {mark:'重要客户',fieldName:'Mark'},
            {mark_star_time:'2016-8-9 15:14',fieldName:'MarkStarTime'},
            {logon_time:'2016-8-9 15:14',fieldName:'LogonTime'},
            {op_items:["编辑","取消星级"],color:"#1A9FE5",fieldName:'Operation'}];
        return(
            <section className="data-section" style={{width:sumWidth+20}}>
                <TextScroll />
                <div className="query-condition">
                    <TextInput title="用户手机：" change={this.handleChange} pdl="0" name="phone_no" holdText="请输入手机号"/>
                    <button className="query-btn" onClick={this.handlePageQuery}>查询</button>
                    <button className="checkout" onClick={()=>this.handleImportantUser("add")}>新增</button>
                </div>
                <div className="data-list">
                    <TableHead data={headData} />
                    <UserLine widths={widths} data={data} />
                    <UserLine widths={widths} data={data} />
                    <UserLine widths={widths} data={data} />
                    <UserLine widths={widths} data={data} />
                </div>
            </section>
        );
    }
});

export default UserManager;