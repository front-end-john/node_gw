 import React from 'react';
 import ReactDOM from 'react-dom';
 import WarnTip from '../dialog/warn_tip';
 export default React.createClass({
     getInitialState(){
         return{oilType:"1"};
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
         let type=this.type.value,code=this.code.value,cash=this.cash.value;
         console.log(type,code,cash);
     },
     handleOilType(e){
        let val=e.target.value;
        this.setState({oilType:val});
     },
     render(){
        let list=[];
        if(this.state.oilType==1){
            list[0]=(<option key="0" value="0#" >0#</option>);
        }else{
            list[0]=( <option key="0" value="92#" >92#</option>);
            list[1]=(<option key="1" value="95#" >95#</option>);
        }
        return(
            <div className="dialog">
                <h2 className="title">加油服务<i onClick={this.cancel}/></h2>
                <div className="dialog-important-user">
                    <p><em>燃油类型：</em>
                        <select onChange={this.handleOilType} ref={(c)=>this.type=c}>
                            <option value="">请选择</option>
                            <option value="1" >柴油</option>
                            <option value="2" >汽油</option>
                        </select><i className="select-arrow"/>
                    </p>
                    <p><em>燃油标号：</em>
                        <select ref={(c)=>this.code=c}>
                            <option value="">请选择</option>
                            {list}
                        </select><i className="select-arrow"/>
                    </p>
                    <p><em>加油金额：</em>
                        <select ref={(c)=>this.cash=c}>
                            <option value="100元" >100元</option>
                            <option value="200元" >200元</option>
                            <option value="300元" >300元</option>
                        </select><i className="select-arrow"/>
                    </p>
                    <p><em>备&emsp;&emsp;注：</em><textarea placeholder="填写备注"  /></p>
                </div>
                <section className="btn">
                    <button onClick={this.cancel}>取消</button>
                    <button onClick={this.ensure}>确认</button>
                </section>
            </div>
        );
     }
 });
