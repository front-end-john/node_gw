 import React from 'react';
 import ReactDOM from 'react-dom';
 import WarnTip from '../dialog/warn_tip';
 export default React.createClass({
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
        let type=this.type.value,remark=this.remark.value;
        console.log(type,remark);
     },
     render(){
        return(
            <div className="dialog">
                <h2 className="title">洗车服务<i onClick={this.cancel}/></h2>
                <div className="dialog-important-user">
                    <p><em>洗车服务：</em>
                        <select ref={(c)=>this.type=c}>
                            <option value="">请选择服务类型</option>
                            <option value="1" >返程若下雨不洗车</option>
                            <option value="2" >返程下雨也需洗车</option>
                        </select><i className="select-arrow"/>
                    </p>
                    <p><em>备&emsp;&emsp;注：</em>
                        <textarea placeholder="填写备注" ref={(c)=>this.remark=c} /></p>
                </div>
                <section className="btn">
                    <button onClick={this.cancel}>取消</button>
                    <button onClick={this.ensure}>确认</button>
                </section>
            </div>
        );
     }
 });
