 import React from 'react';
 import ReactDOM from 'react-dom';
 import WarnTip from '../dialog/warn_tip';
 export default React.createClass({
     getInitialState(){
         return {};
     },
    componentWillMount(){
        let mask=document.getElementById("dialogContainer");
        mask.style.display="block";
        let url="/api5/shops/list";
        fetch(url,{credentials:'include'}).then((res)=>{
            console.log("获取车管家响应：",res.status);
            if(+res.status < 400){
                return res.json();
            }else {
                throw new Error("服务异常");
            }
        }).then((obj)=>{
            if(obj.code === 0){
                this.setState({shops:obj.records});
            }else {
                this.showWarnTip(obj.msg,2);
            }
        }).catch((e)=>{
            this.showWarnTip("网络请求异常",2);
            console.warn('异常接口：', url,"异常对象：",e);
        });
    },
    showWarnTip(msg,floor=1){
        let dialogContainer="dialogContainer";
        if(floor===2) dialogContainer="secDialogContainer";
        let mask=document.getElementById(dialogContainer);
        if(msg===null){
            ReactDOM.render(<i/>, mask);
            mask.style.display="none";
        }else {
            ReactDOM.render(<WarnTip dc={dialogContainer} msg={msg}/>, mask);
        }
    },
    cancel(){
        let mask=document.getElementById("dialogContainer");
        ReactDOM.render(<i/>, mask);
        mask.style.display="none";
    },
    ensure(){
        let url=this.props.url+"?";
        let chserialnumber=this.props.number;
        let shopid=this.shop;
        if(!shopid){
            this.showWarnTip("请选择一个4S店！",2);return 0;
        }
        url+=queryStr.stringify({chserialnumber,shopid});
        console.log("推荐保养接口",url);
        fetch(url,{credentials:'include'}).then((res)=>{
            console.log("推荐保养接口响应：",res.status);
            if(+res.status < 400){
                return res.json();
            }else {
                throw new Error("服务异常");
            }
        }).then((obj)=>{
            if(obj.code === 0){
                this.showWarnTip(obj.message);
                this.props.shift("recommended");
                this.props.reload();
            }else {
                this.showWarnTip(obj.message,2);
            }
        }).catch((e)=>{
            this.showWarnTip("网络请求异常",2);
            console.warn('异常接口：', url,"异常对象：",e);
        });
    },
    render(){
        let shops=(this.state.shops||[]).map((obj,idx)=>{
            return (<option key={idx} value={obj.id}>{obj.name}</option>);
        });
        let selectStyle={width:200,height:36,verticalAlign:"middle"};
        return(
            <div className="dialog">
                <h2 className="title">向客户推荐保养<i onClick={this.cancel}/></h2>
                <div className="dialog-flight-info">
                    <p className="recommend-maintain">
                        <em>选择4S店：</em>
                        <select style={selectStyle} onChange={(e)=>this.shop=e.target.value}>
                            <option>无</option>{shops}</select>
                    </p>
                </div>
                <section className="btn">
                    <button onClick={this.cancel}>取消</button>
                    <button onClick={this.ensure}>确认</button>
                </section>
            </div>
        );
    }
});
