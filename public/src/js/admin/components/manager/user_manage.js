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
        "use strict";
        console.log(this.state.queryCondition);
    },
    render(){
        "use strict";
        let widths=['230px','216px','210px','210px','210px','240px','180px','150px'];
        let headData=[{name:'手机号',width:'230px'},
            {name:'姓名',width:'210px'}, {name:'性别',width:'216px'},
            {name:'重要等级',width:'210px'},{name:'标注',width:'210px'},
            {name:'标星时间',width:'240px'},{name:'注册时间',width:'180px'},
            {name:'操作',width:'150px'}];

        let data=[{phone_no:'14572584545',fieldName:'PhoneNo'},
            {full_name:"中小屋",fieldName:'FullName'},
            {gender:"男",fieldName:'Gender'},
            {level:3,fieldName:'ImportantLevel'},
            {mark:'重要客户',fieldName:'Mark'},
            {mark_star_time:'2016-8-9 15:14',fieldName:'MarkStarTime'},
            {logon_time:'2016-8-9 15:14',fieldName:'LogonTime'},
            {op_items:["编辑","取消星级"],dialog_type:2,color:"#1A9FE5",fieldName:'Operation'}];
        return(
            <section className="data-section">
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