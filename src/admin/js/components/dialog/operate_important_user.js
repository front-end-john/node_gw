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
        this.cancel();

     },

     render(){
        let type=this.props.type;
        return(
            <div className="dialog">
                <h2 className="title">{type=="add"?"新增重要用户":"编辑重要用户"}<i onClick={this.cancel}/></h2>
                <div className="dialog-important-user">
                    <p><em>用户手机：</em><input placeholder="请输入手机号" defaultValue={this.props.phone}/></p>
                    <p><em>用户星级：</em>
                        <select defaultValue={this.props.stars}>
                            <option value="">请选择</option>
                            <option value="1" >&#9733;</option>
                            <option value="2" >&#9733;&#9733;</option>
                        </select><i className="select-arrow"/>
                    </p>
                    <p><em>备&emsp;&emsp;注：</em><textarea placeholder="填写备注" defaultValue={this.props.remark} /></p>
                </div>
                <section className="btn">
                    <button onClick={this.cancel}>取消</button>
                    <button onClick={this.ensure}>确认</button>
                </section>
            </div>
        );
     }
 });
