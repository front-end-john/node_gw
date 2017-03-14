import React from 'react';
import ReactDOM from 'react-dom';
import TextInput from '../widgets/text_input';
import TableHead from '../widgets/table_head';
import UserLine from '../widgets/user_line';
import WarnTip from '../dialog/warn_tip';
import Page from '../widgets/page';
import Loading from "../dialog/loading";
import EditImportantUser from "../dialog/operate_important_user";
import {maxNumber} from '../../util';
export default React.createClass({
    getInitialState(){
        return{
            orderData:[],
            pageObj:{},
            queryCondition:{},
            initWidths:[130,    110,   100,    120,    120,   130,      140,   120],
            titles:    ['手机号','姓名','性别','重要等级','标注','标星时间','注册时间','操作']
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
        }
    },
    handlePageQuery(page,pageSize){
        let url="/admin/api/users/query?";
        url+=queryStr.stringify({page:page,pagesize:pageSize});
        url+="&"+queryStr.stringify(this.state.queryCondition);
        console.log("用户列表url",url);
        this.switchLoading(true);
        fetch(url,{credentials: 'include'}).then((res)=>{
            console.log("用户列表响应："+res.status);
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
        let offsetWidth=220;
        //允许的最小宽度
        let minWidth=1340+offsetWidth,len=initWidths.length;
        let screenWidth=document.body.clientWidth;
        let sumWidth=initSumWidth,widths=initWidths;
        let actulWidth=maxNumber(minWidth,screenWidth,sumWidth+offsetWidth);

        let incre=(actulWidth-offsetWidth-initSumWidth)/len;
        widths=initWidths.map((item)=>item+incre);
        sumWidth=widths.reduce((x,y)=>x+y);
        this.setState({sumWidth:sumWidth,widths});
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
    handleImportantUser(type){
        let mask=document.getElementById("dialogContainer");
        ReactDOM.render(<EditImportantUser type={type} url="/admin/api/users/edit"
                                           reload={()=>this.handlePageQuery(1,10)} />, mask);
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
            let data=[{phone_no:item.phoneno,fieldName:'PhoneNo'},
                {full_name:item.realname,fieldName:'FullName'},
                {gender:item.sex,fieldName:'Gender'},
                {level:item.stars,fieldName:'ImportantLevel'},
                {mark:item.remark,fieldName:'Mark'},
                {mark_star_time:item.starstime,fieldName:'MarkStarTime'},
                {logon_time:item.regtime,fieldName:'LogonTime'},
                {name:item.realname,phone:item.phoneno,id:item.userid,
                    stars:item.stars,remark:item.remark,fieldName:'Operation'}];
            return (<UserLine key={index} widths={widths} data={data} updateList={()=>this.handlePageQuery(1,10)}/>);
        });
        return(
            <section className="data-section" style={{width:sumWidth+40}}>
                <div className="query-condition">
                    <TextInput title="用户手机：" change={this.handleChange} pdl="0" name="phone_no"
                               enter={()=>this.handlePageQuery(1,10)} holdText="请输入手机号"/>
                    <button className="query-btn" onClick={()=>this.handlePageQuery(1,10)}>查询</button>
                    <button className="checkout" onClick={()=>this.handleImportantUser("add")}>新增</button>
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
