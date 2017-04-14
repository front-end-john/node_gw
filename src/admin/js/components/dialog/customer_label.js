import React from 'react';
import ReactDOM from 'react-dom';
import WarnTip from '../dialog/warn_tip';
import {isExitValue} from '../../util'
let Ensure=React.createClass({
    componentWillMount(){
        let mask=document.getElementById("dialogContainer");
        mask.style.display="block";
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
    cancel(){
        let mask=document.getElementById("dialogContainer");
        ReactDOM.render(<i/>, mask);
        mask.style.display="none";
    },
    handleSelectLabel(e){
        let ele=e.target;
        if(ele.nodeName==="LI"){
            if(ele.className==="selected"){
                ele.className="";
                this.handleMark(ele.innerHTML,-1);
            }else {
                ele.className="selected";
                this.handleMark(ele.innerHTML,1);
            }
        }
    },
    handleMark(label,state){
        let url=this.props.url+"?"+queryStr.stringify({user_id:this.props.uid,tag:label,state});
        console.log("添加标签url",url);
        fetch(url,{credentials: 'include'}).then((res)=>{
            console.log("添加标签响应：",res.status);
            if(+res.status < 400){
                return res.text();
            }else {
                throw new Error("服务异常");
            }
        }).then((str)=>{
            console.log("添加标签的响应内容",str);
            let obj=JSON.parse(str);
            if(obj.code===0){
                this.props.reload();
            }else {
                this.showWarnTip("标签操作失败！");
            }
        }).catch((e)=>{
            this.showWarnTip("网络请求异常！");
            console.trace('错误:', e);
        });
    },
    render(){
        let tagArr=['机场客户','优质客户','关系客户','无需电话确认','无烟客户','发票'];
        let list=tagArr.map((item,index)=>{
            let is=isExitValue(this.props.tags,item);
            return( <li key={index} className={is?"selected":""}>{item}</li>);
        });
        return(
            <div className="dialog">
                <h2 className="title">客户标签<i onClick={this.cancel}/></h2>
                <ul className="customer-label" onClick={this.handleSelectLabel}>
                    {list}
                </ul>
            </div>
        );
    }
});

export default Ensure;
