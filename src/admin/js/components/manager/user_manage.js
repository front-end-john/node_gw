import React from 'react';

import TextScroll from '../widgets/text_scroll';
import TextInput from '../widgets/text_input';
import TableHead from '../widgets/table_head';
import UserLine from '../widgets/user_line';

let UserManager=React.createClass({
    getInitialState(){
        "use strict";
        return{
            queryCondition:{
                phone_no:""
            }
        };
    },
    handleChange(e){
        "use strict";
        let key=e.target.id;
        let val=e.target.value;
        if(key==="phone_no"){
            this.state.queryCondition.phone_no=val;
        }
    },
    handleQuery(){
        console.log(this.state.queryCondition);
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
        let widths=[130,    120,   100,    130,    140,   140,      140,   120];
        let titles=['手机号','姓名','性别','重要等级','标注','标星时间','注册时间','操作'];
        this.adaptScreen(widths,titles);
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
            {level:3,fieldName:'ImportantLevel'},
            {mark:'重要客户',fieldName:'Mark'},
            {mark_star_time:'2016-8-9 15:14',fieldName:'MarkStarTime'},
            {logon_time:'2016-8-9 15:14',fieldName:'LogonTime'},
            {op_items:["编辑","取消星级"],dialogs:[2],color:"#1A9FE5",fieldName:'Operation'}];
        return(
            <section className="data-section" style={{width:sumWidth}}>
                <TextScroll />
                <div className="query-condition">
                    <TextInput title="用户手机:" change={this.handleChange} name="phone_no" holdText="请输入手机号"/>
                    <button className="query-btn" onClick={this.handleQuery}>查询</button>
                    <button className="checkout" >新增</button>
                </div>
                <TableHead data={headData} />
                <UserLine widths={widths} data={data} />
                <UserLine widths={widths} data={data} />
                <UserLine widths={widths} data={data} />
                <UserLine widths={widths} data={data} />
            </section>
        );
    }
});

export default UserManager;