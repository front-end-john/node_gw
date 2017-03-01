 import React from 'react';
 import ReactDOM from 'react-dom';
 import WarnTip from '../dialog/warn_tip';
 import { DateField } from 'react-date-picker';
 export default React.createClass({
     componentWillMount(){
         let mask=document.getElementById("dialogContainer");
         mask.style.display="block";
     },
     cancel(){
         let mask=document.getElementById("dialogContainer");
         ReactDOM.render(<i/>, mask);
         mask.style.display="none";
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
     ensure(){
        let order_id=this.props.oid;
        let bookingtime=this.bookingtime;
        let url="/admin/api/orders/edit_bookingtime?";
        url+=queryStr.stringify({order_id,bookingtime});
        console.log("修改预约时间url",url);
        fetch(url,{credentials: 'include'}).then((res)=>{
            return res.json();
        }).then((json)=>{
            console.log('json', json);
            if(json.code==0){
                this.props.reload();
                this.cancel();
            }else {
                this.showWarnTip(json.msg);
            }
        }).catch((e)=>{
            this.showWarnTip("网络请求异常！");
            console.trace('网络请求异常', e);
        });
    },
    render(){
        return(
            <div className="dialog">
                <h2 className="title">修改预约时间<i onClick={this.cancel}/></h2>
                <div className="dialog-flight-info">
                    <p><em>当前预约时间：</em><input placeholder="请输入返程航班" readOnly
                                              defaultValue={this.props.bookingtime}/></p>
                    <div className="date-select"><em>改后预约时间：</em>
                        <DateField onChange={(date)=>this.bookingtime=date } dateFormat="YYYY-MM-DD HH:mm"
                        style={{borderColor:"#ddd",width:"220px",height:"36px"}} /></div>
                </div>
                <section className="btn">
                    <button onClick={this.cancel}>取消</button>
                    <button onClick={this.ensure}>确认</button>
                </section>
            </div>
        );
    }
});
