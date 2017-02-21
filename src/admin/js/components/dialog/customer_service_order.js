 import React from 'react';
 import ReactDOM from 'react-dom';
 import { DateField } from 'react-date-picker';
 import WarnTip from '../dialog/warn_tip';
 import {addUniqueEle} from '../../util';
 export default React.createClass({
     getInitialState(){
         return{}
     },
     componentWillMount(){
         let mask=document.getElementById("dialogContainer");
         mask.style.display="block";
     },
     componentDidMount(){
         let url="/admin/api/areas/terminals";
         fetch(url).then((res)=>{
             if(+res.status < 400){
                 return res.text();
             }else {
                 throw new Error("服务端异常");
             }
         }).then((str)=>{
             let obj=JSON.parse(str);
             let list=obj.terminals;
             let cities={},ids=[],len=list.length;
             for(let i=0;i<len;i++){
                 let item=list[i],cid=item.airportid;
                 let ret=addUniqueEle(ids,cid);
                 if(ret > 0){
                     cities[cid]={cityname:item.cityname,cityid:cid,terminals:[{name:item.name,id:item.terminalid}]};
                 }else {
                     cities[cid].terminals.push({name:item.name,id:item.terminalid});
                 }
             }
             //console.log("cities:",cities);
             this.setState({cities:cities});
         }).catch((e)=>{
             console.trace('异常:', e);
         });
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
     handleFetch(url,ok,err){
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
                    ok(obj);
                 }else {
                    err(obj);
                 }
             }catch(e){
                 console.error("json数据异常：",e);
                 console.log("异常数据为：",str);
             }
         }).catch((e)=>{
             console.trace('请求错误:', e);
         });
     },
     handlePhoneChange(e){
         let val=e.target.value;
         if(/^1\d{10}$/.test(val)){
             let url="/admin/api/users/userinfo?phoneno="+val;
             this.handleFetch(url,(obj)=>{
                 console.log("user:",obj);
                 this.username.value=obj.user.realname;
                 this.gender.value=obj.user.sex;
                 url="/admin/api/cars/list_by_userid?userid="+obj.user.userid;
                 this.handleFetch(url,(obj)=>{
                    console.log("cars:",obj);
                    this.setState({cars:obj.cars});
                 },(obj)=>{
                     console.log("问题数据：",obj);
                 });
             },(obj)=>{
                 console.log("问题数据：",obj);
             });
         }
     },
     cancel(){
         let mask=document.getElementById("dialogContainer");
         ReactDOM.render(<i/>, mask);
         mask.style.display="none";
     },
     ensure(){
        this.cancel();
        let url="/admin/api/orders/neworder?phoneno=15172037122&" +
            "realname=%E6%9D%8E%E6%89%AC&gender=0&carid=1413&" +
            "carno=&carbrand=%E5%A5%A5%E8%BF%AAA4&" +
            "carcolor=%E7%99%BD%E8%89%B2&terminalid=2&" +
            "bookingtime=2017-02-22+18%3A30";
        /*fetch(url,{credentials: 'include'}).then((res)=>{
             if(+res.status < 400){
                 return res.text();
             }else {
                 throw new Error("服务端异常");
             }
        }).then((str)=>{
             try{
                 let obj=JSON.parse(str);
                 if(obj.code==0){

                 }else {

                 }
             }catch(e){
                 console.error("json数据异常：",e);
                 console.log("异常数据为：",str);
             }
        }).catch((e)=>{
             console.trace('请求错误:', e);
        });*/
     },
     render(){
         let cities=this.state.cities||{};
         let properties=Object.getOwnPropertyNames(cities);

         let cityOptions=properties.map((item,index)=>{
             let obj=cities[item];
             return (<option key={index} value={obj.cityid}> {obj.cityname}</option>);
         });

         let cid=this.state.city_id||"";
         let terminals=(cities[cid]||{}).terminals||[];
         let terminalOptions=terminals.map((item,index)=>{
             return (<option key={index} value={item.id}> {item.name}</option>);
         });

         let cars=this.state.cars||[];
         let carnos=cars.map((item,index)=>{
             return ( <option key={index} value={item.carno} onClick={()=>{
                 this.carColor.value=item.color;
                 this.carBrand.value=item.brand;
             }}>
                 {item.carno}</option>);
         });
         let car=cars[0]||{};

         return(
            <div className="dialog">
                <h2 className="title">客服下单<i onClick={this.cancel}/></h2>
                <div className="dialog-place-order">
                    <p><em>用户手机：</em><input type="text" placeholder="请输入手机号" onChange={this.handlePhoneChange}/></p>
                    <p><em>用户姓名：</em><input type="text" placeholder="请输入姓名" className="username" ref={(c)=>this.username=c}/>
                        <select className="user-gender" ref={(c)=>this.gender=c} >
                            <option value="1" >男</option>
                            <option value="0" >女</option>
                        </select><i className="select-arrow"/>
                    </p>
                    <p>
                        <em>车牌号码：</em>
                        <select className="user-gender" ref={(c)=>this.carNo=c} value={car.carno||""}>
                            <option value="">车牌号</option>
                            {carnos}
                    </select><i className="select-arrow"/>
                        <input type="text" placeholder="颜色（选填）" value={ car.color||""} ref={(c)=>this.carColor=c}
                               className="username" style={{marginLeft:"-13px"}}/>
                        <input type="text" placeholder="车型（选填）" value={ car.brand ||""} ref={(c)=>this.carBrand=c}
                               className="username"/>
                    </p>
                    <p><em>接车地点：</em>
                        <select style={{marginRight:"10px",width:"100px"}} ref={(c)=>this.city=c}
                                onChange={(e)=>this.setState({city_id:e.target.value})}>
                            <option value="">城市</option>
                            {cityOptions}
                        </select><i className="select-arrow"/>
                        <select style={{marginRight:"10px",width:"200px"}} ref={(c)=>this.terminal=c}>
                            <option value="">请选择航站楼</option>
                            {terminalOptions}
                        </select><i className="select-arrow"/>
                    </p>
                    <div className="date-select"><em>预约时间：</em>
                        <DateField onChange={(date)=>this.bookingtime=date }
                                   dateFormat="YYYY-MM-DD HH:mm" placeholder="请输入预约时间"
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
