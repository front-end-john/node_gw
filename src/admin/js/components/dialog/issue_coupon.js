 import React from 'react';
 import ReactDOM from 'react-dom';
 import WarnTip from '../dialog/warn_tip';
 import { DateField } from 'react-date-picker';
 export default React.createClass({
     getInitialState(){
         return {couponType:0};
     },
     componentWillMount(){
         let mask=document.getElementById("dialogContainer");
         mask.style.display="block";
     },
     showWarnTip(msg,floor=1){
         let dialogContainer="dialogContainer";
         if(floor==2) dialogContainer="secDialogContainer";
         let mask=document.getElementById(dialogContainer);
         if(msg===null){
             ReactDOM.render(<i/>, mask);
             mask.style.display="none";
         }else {
             ReactDOM.render(<WarnTip dc={dialogContainer} msg={msg}/>, mask);
         }
     },
     validValue(val,reg,msg){
         if(val===0){
             return true;
         }else if(!val){
             this.showWarnTip(msg[0],2);
             return false;
         }else if(reg && !reg.test(val)){
             this.showWarnTip(msg[1],2);
             return false;
         }else {
             return true;
         }
     },
     cancel(){
         let mask=document.getElementById("dialogContainer");
         ReactDOM.render(<i/>, mask);
         mask.style.display="none";
     },
     handleRadio(e){
         this.setState({couponType:e.target.value});
     },
     ensure(){
         let phoneno=this.phone.value.trim();
         let comefrom=this.comefrom.value;
         let coupontype=this.state.couponType;
         let ctype=parseInt(coupontype);
         let days="",money="",discount="";
         let amount=this.amount.value;
         let tip="优惠时长不能为空！";
         if(ctype===3){
             days=amount;
         }else if(ctype===1){
             money=amount;tip="优惠金额不能为空！";
         }else if(ctype===0){
             discount=amount;tip="优惠折扣不能为空！";
         }
         let expiretime=this.deadline;
         let remark=this.remark.value;
         if(!this.validValue(phoneno,/^1[0-9]{10}$/,["手机号不能为空！","手机号不合法！"])) return 0;
         if(!this.validValue(amount,null,[tip])) return 0;
         if(!this.validValue(expiretime,null,["截止时间不能为空！"])) return 0;
         if(!this.validValue(remark,null,["备注不能为空！"])) return 0;
         let url="/admin/api/coupons/createcoupon?";
         url+=queryStr.stringify({phoneno,comefrom,coupontype,days,money,discount,expiretime,remark});
         console.log("发放优惠券url",url);
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
                     this.props.updateList();
                 }else{
                     this.showWarnTip(obj.message);
                 }
             }catch(e){
                 this.showWarnTip("数据异常");
                 console.error("json数据异常：",e);
                 console.log("异常数据为：",str);
             }
         }).catch((e)=>{
             this.showWarnTip("请求异常");
             console.trace('请求错误:', e);
         });
     },
     handlePhoneChange(e){
         let val=e.target.value;
         if(/^1\d{10}$/.test(val)){
             let url="/admin/api/users/userinfo?phoneno="+val;
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
                         this.setState({user:obj.user});
                     }else {
                         console.log("后台提示：",obj);
                     }
                 }catch(e){
                     console.error("json数据异常：",e);
                     console.log("异常数据为：",str);
                 }
             }).catch((e)=>{
                 console.trace('请求错误:', e);
             });
         }
     },
     render(){
        let type=this.state.couponType;
        let label="优惠时长",holder="请输入天数";
        if(type==1){
            label="优惠金额";holder="请输入金额";
        }else if(type==0){
            label="优惠折扣";holder="请输入折扣";
        }
        return(
            <div className="dialog">
                <h2 className="title">发放优惠券<i onClick={this.cancel}/></h2>
                <div className="dialog-important-user">
                    <p><em>用户手机：</em><input placeholder="请输入手机号" ref={(c)=>this.phone=c }/></p>
                    <p><em>用户来源：</em>
                        <select ref={(c)=>this.comefrom=c}>
                            <option value="service">客服</option>
                            <option value="FEIBOTONG_TAOBAO">淘宝</option>
                        </select><i className="select-arrow"/>
                    </p>
                    <p className="group-radio"><em>优惠类型：</em>
                        <span><input onClick={this.handleRadio} type="radio" defaultChecked value="3" name="coupontype"/>按天数</span>
                        <span><input onClick={this.handleRadio} type="radio" value="1" name="coupontype"/>按金额</span>
                        <span><input onClick={this.handleRadio} type="radio" value="0" name="coupontype"/>按折扣</span>
                    </p>
                    <p><em>{label}：</em><input placeholder={holder} type="number" ref={(c)=>this.amount=c}/></p>
                    <div className="date-select"><em>截止时间：</em>
                        <DateField onChange={(date)=>this.deadline=date } dateFormat="YYYY-MM-DD"
                                   style={{borderColor:"#ddd",width:"220px",height:"36px",borderRadius:2}} /></div>
                    <p><em>备&emsp;&emsp;注：</em><textarea placeholder="填写备注" ref={(c)=>this.remark=c}/></p>
                </div>
                <section className="btn">
                    <button onClick={this.cancel}>取消</button>
                    <button onClick={this.ensure}>确认</button>
                </section>
            </div>
        );
     }
 });
