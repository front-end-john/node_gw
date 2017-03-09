 import React from 'react';
 import ReactDOM from 'react-dom';
 import { DateField } from 'react-date-picker';
 import WarnTip from '../dialog/warn_tip';
 import {addUniqueEle} from '../../util';
 export default React.createClass({
     getInitialState(){
         return{submitLock:false}
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
             let cities={},names=[],len=list.length;
             for(let i=0;i<len;i++){
                 let item=list[i],name=item.cityname;
                 let ret=addUniqueEle(names,name);
                 if(ret > 0){
                     cities[name]={cityname:name,terminals:[{name:item.name,id:item.terminalid}]};
                 }else {
                     cities[name].terminals.push({name:item.name,id:item.terminalid});
                 }
             }
             this.setState({cities:cities});
         }).catch((e)=>{
             console.trace('异常:', e);
         });
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
         if(val.length>11){
             this.phone.value=val.trim().substr(0,11);
         }
         if(/^1[0-9]{10}$/.test(val)){
             let url="/admin/api/users/userinfo?phoneno="+val;
             this.handleFetch(url,(obj)=>{
                 //console.log("user:",obj);
                 this.username.value=obj.user.realname;
                 this.gender.value=obj.user.sex;
                 url="/admin/api/cars/list_by_userid?userid="+obj.user.userid;
                 this.handleFetch(url,(obj)=>{
                    //console.log("cars:",obj);
                    this.setState({cars:obj.cars},()=>{
                        let car=obj.cars[0]||{};
                        this.carNo.value=car.carno||"";
                        this.carColor.value=car.color||"";
                        this.carBrand.value=car.brand||"";
                        this.selectCar.value=0;
                        this.setState({carId:car.carid});
                    });
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
     ensure(){
        let phoneno=this.phone.value.trim();
        if(!this.validValue(phoneno,/^1[0-9]{10}$/,["手机号不能为空！","手机号不合法！"])) return 0;
        let realname=this.username.value.trim();
        if(!this.validValue(realname,null,["姓名不能为空！"])) return 0;
        let gender=this.gender.value;
        let carid=this.state.carId;
        let carno=this.carNo.value.trim();
        let carNoReg=/^[\u4E00-\u9FA5][A-Z][\da-zA-Z]{5,6}$/;
        if(!this.validValue(carno,carNoReg,["车牌号不能为空！","车牌号不合法！"])) return 0;
        let carbrand=this.carBrand.value.trim();
        let carcolor=this.carColor.value.trim();
        let terminalid=this.terminal.value;
        if(!this.validValue(terminalid,null,["航站楼不能为空！"])) return 0;
        let bookingtime=this.bookingtime;
        if(!this.validValue(bookingtime,null,["预约时间不能为空！"])) return 0;
        let url="/admin/api/orders/neworder?";
        url+=queryStr.stringify({phoneno,realname,gender,carid,carno,carbrand,carcolor,terminalid,bookingtime});
        if(!this.state.submitLock){
            this.setState({submitLock:true});
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
                        this.props.updateList();
                        this.cancel();
                    }else {
                        this.showWarnTip(obj.msg);
                    }
                }catch(e){
                    console.error("json数据异常：",e);
                    console.log("异常数据为：",str);
                }
                this.setState({submitLock:false});
            }).catch((e)=>{
                this.setState({submitLock:false});
                console.trace('请求错误:', e);
            });
        }

     },
     handleSelectCarNo(e){
         let index=e.target.value;
         let cars=this.state.cars||[];
         let car=cars[index]||{};
         this.carNo.value=car.carno||"";
         this.carColor.value=car.color||"";
         this.carBrand.value=car.brand||"";
         this.selectCar.value=index;
         this.setState({carId:car.carid});
     },
     render(){
         /**
          * 车牌选项
          */
         let cars=this.state.cars||[];
         let carnos=cars.map((item,index)=>{
             return ( <option key={index} value={index}>{item.carno}</option>);
         });
         /**
          *城市列表
          */
         let cities=this.state.cities||{};
         let properties=Object.getOwnPropertyNames(cities);
         /**
          *接车城市选项
          */
         let cityOptions=properties.map((item,index)=>{
             let obj=cities[item];
             return (<option key={index} value={obj.cityname}>{obj.cityname}</option>);
         });
         /**
          *航站楼选项
          */
         let ctName=this.state.city_name||"";
         let terminals=(cities[ctName]||{}).terminals||[];
         let terminalOptions=terminals.map((item,index)=>{
             return (<option key={index} value={item.id}> {item.name}</option>);
         });

         return(
            <div className="dialog">
                <h2 className="title">客服下单<i onClick={this.cancel}/></h2>
                <div className="dialog-place-order">
                    <p><em>用户手机：</em><input type="text" placeholder="请输入手机号"
                                            ref={(c)=>this.phone=c} onChange={this.handlePhoneChange}/></p>
                    <p><em>用户姓名：</em><input type="text" placeholder="请输入姓名"
                                            className="username" ref={(c)=>this.username=c}/>
                        <select className="user-gender" ref={(c)=>this.gender=c} >
                            <option value="1" >男</option>
                            <option value="0" >女</option>
                        </select><i className="select-arrow"/>
                    </p>
                    <p className="car-no">
                        <em>车牌号码：</em>
                        <input type="text" placeholder="车牌号" ref={(c)=>this.carNo=c}/>
                        <select className="user-gender"  ref={(c)=>this.selectCar=c}
                                onChange={this.handleSelectCarNo}>
                            {carnos}
                        </select><i className="select-arrow"/>
                        <input type="text" placeholder="颜色（选填）"  ref={(c)=>this.carColor=c}
                               className="username" style={{marginLeft:"-13px"}}/>
                        <input type="text" placeholder="车型（选填）"  ref={(c)=>this.carBrand=c}
                               className="username"/>
                    </p>
                    <p><em>接车地点：</em>
                        <select style={{marginRight:"10px",width:"100px"}}
                               onChange={(e)=>this.setState({city_name:e.target.value})}>
                            <option value="">请选择城市</option>
                            {cityOptions}
                        </select><i className="select-arrow"/>

                        <select style={{marginLeft:"-12px",marginRight:"10px",width:"210px"}} ref={(c)=>this.terminal=c}>
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
