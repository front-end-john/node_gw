 import React from 'react';
 import ReactDOM from 'react-dom';
 import WarnTip from '../dialog/warn_tip';
 export default React.createClass({
     getInitialState(){
         return{oilType:"汽油"};
     },
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
     ensure(){
         let serialnumber=this.props.number;
         let oiltype=this.oilType.value,oillabel=this.oilLabel.value,money=this.money.value;
         let remark=this.remark.value;
         let url=this.props.url+"?";
         if(this.props.type=="add"){
             url+=queryStr.stringify({serialnumber,oiltype,oillabel,money,remark});
         }else {
             let serviceorderid=this.props.soid;
             url+=queryStr.stringify({serviceorderid,oiltype,oillabel,money,remark});
         }
         fetch(url,{credentials: 'include'}).then((res)=>{
             if(+res.status < 400){
                 return res.text();
             }else {
                 throw new Error("服务端异常");
             }
         }).then((str)=>{
             try{
                 let obj=JSON.parse(str);
                 if(obj.code==0){
                     this.cancel();
                     this.props.reload();
                 }else {
                     this.showWarnTip(obj.msg);
                 }
             }catch(e){
                 this.showWarnTip("数据异常");
                 console.error("json数据异常：",e);
                 console.log("异常数据为：",str);
             }
         }).catch((e)=>{
             this.showWarnTip("请求错误");
             console.trace('请求错误:', e);
         });
     },
     handleOilType(e){
        let val=e.target.value;
        this.setState({oilType:val});
     },
     render(){
        let list=[];
        if(this.state.oilType=="柴油"){
            list[0]=(<option key="0" value="0#" >0#</option>);
        }else{
            list[0]=( <option key="0" value="92#" >92#</option>);
            list[1]=(<option key="1" value="95#" >95#</option>);
            list[2]=(<option key="2" value="98#" >98#</option>);
        }
        let type=this.props.type;
        let eidtType=type=="add"?"添加":"修改";
        return(
            <div className="dialog">
                <h2 className="title">{eidtType}加油服务<i onClick={this.cancel}/></h2>
                <div className="dialog-important-user">
                    <p><em>燃油类型：</em>
                        <select onChange={this.handleOilType} ref={(c)=>this.oilType=c} defaultValue={this.props.oiltype}>
                            <option value="">请选择</option>
                            <option value="汽油" >汽油</option>
                            <option value="柴油" >柴油</option>
                        </select><i className="select-arrow"/>
                    </p>
                    <p><em>燃油标号：</em>
                        <select ref={(c)=>this.oilLabel=c} defaultValue={this.props.label}>
                            <option value="">请选择</option>
                            {list}
                        </select><i className="select-arrow"/>
                    </p>
                    <p><em>加油金额：</em>
                        <select ref={(c)=>this.money=c} defaultValue={this.props.money}>
                            <option value="100" >100元</option>
                            <option value="200" >200元</option>
                            <option value="300" >300元</option>
                        </select><i className="select-arrow"/>
                    </p>
                    <p><em>备&emsp;&emsp;注：</em><textarea placeholder="填写备注" ref={(c)=>this.remark=c}
                                                         defaultValue={this.props.remark}/></p>
                </div>
                <section className="btn">
                    <button onClick={this.cancel}>取消</button>
                    <button onClick={this.ensure}>确认</button>
                </section>
            </div>
        );
     }
 });
