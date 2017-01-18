import React from 'react';
import ReactDOM from 'react-dom';
import Loading from '../widgets/loading';
import PulldownTip from '../widgets/pulldown_tip';
import {decDatetime,getLocalTimestamp} from '../util';
export default React.createClass({
    getInitialState(){
        let type=this.props.location.query.type;
        return{
            orderType:type||"1",
            showInfo:false,
            queryLocation:{}
        };
    },
    handleWarning(){
        let flight=sessionStorage.getItem("FlightInfo");
        let dom=document.getElementById("dialog");
        if(flight){
            ReactDOM.render(<PulldownTip msg="已与航班号对应，无法修改！" />,dom);
        }else {
            ReactDOM.render(<PulldownTip msg="请先选择航班号！" />,dom);
        }
    },
    handleDateChange(e){
        let timeStr=e.target.value;
        let localTimestamp=getLocalTimestamp(timeStr);
        this.refs.useTime.value=timeStr.replace('T',' ');
        /**
         * 更新用车/预约时间
         */
        this.state.queryLocation.bookingtime=localTimestamp;
        sessionStorage.setItem("UserUseCarTime",timeStr);
    },
    handleQuery(){
        let dom=document.getElementById("dialog");
        let numberIn=this.refs.number,addressIn=this.refs.address,
            useTimeIn=this.refs.useTime;
        if(!numberIn.value){
            ReactDOM.render(<PulldownTip msg="请输入航班号！" />,dom);
            return 0;
        }
        if(useTimeIn && !useTimeIn.value){
            ReactDOM.render(<PulldownTip msg="请输入用车时间！" />,dom);
            return 0;
        }
        if(!addressIn.value){
            ReactDOM.render(<PulldownTip msg={this.state.orderType=="1"?"请输入目的地！":"请输入出发地！"} />,dom);
            return 0;
        }
        /**
         * 显示加载中
         */
        ReactDOM.render(<Loading />,dom);
        dom.style.display="block";

        let paramsObj=this.state.queryLocation;
        console.log(paramsObj);
        let url=jsj_api_path+"/user/querycartype";
        url+="?"+queryStr.stringify(paramsObj);
        console.log("查询车型url：",url);
        fetch(url).then(function(res){
            console.log("查询车型响应状态："+res.status);
            dom.style.display="none";
            if(+res.status < 400){
                return res.text();
            }else {
                throw new Error("服务异常");
            }
        }).then((str)=>{
            let obj=JSON.parse(str);
            console.log(obj);
            if(obj.code==0){
                sessionStorage.setItem("CarTypeList",str);
                location.href="#/select_car_type";
            }else {
                ReactDOM.render(<PulldownTip msg={obj.message} />,dom);
            }
        }).catch(function(e){
            ReactDOM.render(<PulldownTip msg="查询失败！" />,dom);
            console.trace('错误:', e);
        });
    },
    componentWillMount(){
        document.title="接送机";
        /**
         * 接机订单
         */
        let OT=this.state.orderType;
        sessionStorage.setItem("OrderType",OT);
        let flight=sessionStorage.getItem("FlightInfo");
        let jjData=null,sjData=null;
        if(flight){
            this.setState({ showInfo:true});
            flight=JSON.parse(flight);
            /**
             * 航班的降落时间
             */
            let {year,month,day,hour,minute,week} =decDatetime(flight.landingtime);
            this.state.queryLocation.ordertype=OT;
            this.state.queryLocation.bookingtime=flight.landingtime;
            this.state.queryLocation.flightid=flight.id;
            sessionStorage.setItem("FlightNumber",flight.flightnumber);
            /**
             * 航班的起飞时间前三小时作为默认用车时间
             */
            let {year:year1,month:month1,day:day1,hour:hour1,minute:minute1} = decDatetime(flight.takingofftime- 3600*3);
            /**
             * 航班的起飞时间
             */
            let {year:year2,month:month2,day:day2,hour:hour2,minute:minute2} = decDatetime(flight.takingofftime);

            if(OT=="1"){
                sessionStorage.setItem("UserUseCarTime",year+'-'+month+'-'+day+' '+hour+':'+minute);
                jjData={number:flight.flightnumber,
                    useTime:month+'-'+day+' '+weekday[week]+' '+hour+':'+minute+' 用车',
                    terminal:flight.tocity+flight.toairport+"机场"+flight.toterminal+"航站楼",
                    startTime:month2+'-'+day2+' '+hour2+':'+minute2,
                    startTerminal:flight.fromcity+flight.fromairport+"机场"+flight.fromterminal,
                    endTime:month+'-'+day+' '+hour+':'+minute,
                    endTerminal:flight.tocity+flight.toairport+"机场"+flight.toterminal,
                    city:flight.tocity
                };
                sessionStorage.setItem("JJData",JSON.stringify(jjData));
            }else{
                if(!sessionStorage.getItem("UserUseCarTime")){
                    sessionStorage.setItem("UserUseCarTime",year1+'-'+month1+'-'+day1+' '+hour1+':'+minute1);
                }
                sjData={number:flight.flightnumber,
                    useTime:sessionStorage.getItem("UserUseCarTime"),
                    terminal:flight.fromcity+flight.fromairport+"机场"+flight.fromterminal+"航站楼",
                    takeoffTime:year2+'-'+month2+'-'+day2+' '+hour2+':'+minute2,
                    startTime:month2+'-'+day2+' '+hour2+':'+minute2,
                    startTerminal:flight.fromcity+flight.fromairport+"机场"+flight.fromterminal,
                    endTime:month+'-'+day+' '+hour+':'+minute,
                    endTerminal:flight.tocity+flight.toairport+"机场"+flight.toterminal,
                    city:flight.fromcity
                };
                sessionStorage.setItem("SJData",JSON.stringify(sjData));
            }

            /**
             * 获取降落机场航站楼的经纬度
             */
            let address=flight.tocity+flight.toairport+"机场"+flight.toterminal+"航站楼";
            if(OT=="2"){
                /**
                 * 获取起飞机场航站楼的经纬度
                 */
               address=flight.fromcity+flight.fromairport+"机场"+flight.fromterminal+"航站楼";
            }
            let ak="CE6cd9406d95e0f351bc98a8898b9abf";
            let url="http://api.map.baidu.com/geocoder/v2/?address="+address+
                "&output=json&ak="+ak;
            fetchJsonp(encodeURI(url)).then((res)=>{
                return res.json();
            }).then((json)=>{
                if(OT=="2"){
                    console.info("**起飞**航站楼的经纬度",json);
                    this.state.queryLocation.endaddress=address;
                    this.state.queryLocation.endlng=json.result.location.lng;
                    this.state.queryLocation.endlat=json.result.location.lat;
                }else {
                    console.log("**降落**航站楼的经纬度",json);
                    this.state.queryLocation.startaddress=address;
                    this.state.queryLocation.startlng=json.result.location.lng;
                    this.state.queryLocation.startlat=json.result.location.lat;
                }
            }).catch(function(e){
                console.warn('错误', e);
            });
        }
        /**
         * 用户的目的地/出发地数据
         */
        let userAddress=OT=="1"?sessionStorage.getItem("UserJJAddress"):sessionStorage.getItem("UserSJAddress");

        if(userAddress){
            userAddress=JSON.parse(userAddress);
            if(OT=="2"){
                /**
                 * 送机出发地址
                 */
                this.state.queryLocation.startaddress=userAddress.name;
                this.state.queryLocation.startlng=userAddress.location.lng;
                this.state.queryLocation.startlat=userAddress.location.lat;
            }else {
                /**
                 * 接机目的地址
                 */
                this.state.queryLocation.endaddress=userAddress.name;
                this.state.queryLocation.endlng=userAddress.location.lng;
                this.state.queryLocation.endlat=userAddress.location.lat;
            }
        }
    },
    render(){
        let t=this.state.orderType,showData;
        let userAddress=t=="1"?sessionStorage.getItem("UserJJAddress"):sessionStorage.getItem("UserSJAddress");
        userAddress=userAddress?JSON.parse(userAddress):{};
        let address=userAddress.name||"";
        if(t=="1"){
            showData=JSON.parse(sessionStorage.getItem("JJData"));
        }else {
            showData=JSON.parse(sessionStorage.getItem("SJData"));
        }

        return(
            <div className="jieji-query">
                <figure>
                    <div className={this.state.showInfo&&showData?"show-flight":(t=="1"?"jj-flight":"sj-flight")}/>
                    <ul className={this.state.showInfo&&showData?"flight-info show":"flight-info"}>
                        <li><p>起飞地</p><p>{showData?showData.startTime:''}</p>
                            <p>{showData?showData.startTerminal:''}</p></li>
                        <li><p>目的地</p><p>{showData?showData.endTime:''}</p>
                            <p>{showData?showData.endTerminal:''}</p></li>
                    </ul>
                </figure>
                <hgroup>
                    <h2 className={t=="1"?"current":""}
                        onClick={()=>{
                            this.setState({orderType:"1"});
                            sessionStorage.setItem("OrderType","1");}}>接机</h2> <i/>
                    <h2 className={t=="2"?"current":""}
                        onClick={()=>{
                            this.setState({orderType:"2"});
                            sessionStorage.setItem("OrderType","2");}} >送机</h2>
                </hgroup>
             {t=="1"?(<div>
                <section className="jieji-flight" >
                    <img src={jsj_static_path+"/img/02.png"} />
                    <div onClick={()=>location.href="#/query_flight"}>
                        <input type="text" placeholder="请输入航班号" readOnly ref="number"
                        defaultValue={showData?showData.number.toUpperCase()+" "+showData.endTime:''}/>
                        <p>{showData?showData.useTime:"航班延误，免费等待"}</p>
                    </div>
                </section>
                <section className="from-to">
                    <ul><li/><li/><li/><li/><li/><li/></ul>
                    <div>
                        <p onClick={this.handleWarning}>
                            <input  placeholder="航站楼" readOnly
                            defaultValue={showData?showData.terminal:''}/>
                        </p>
                        <p onClick={()=>location.href="#/destination?city="+(showData?showData.city:"深圳")}>
                            <input placeholder="请输入目的地" readOnly defaultValue={address} ref="address"/>
                        </p>
                    </div>
                </section>
                </div>):(<div>
                        <section className="songji-input" >
                            <img src={jsj_static_path+"/img/02.png"} />
                            <input type="text" placeholder="请输入航班号" readOnly ref="number"
                                   defaultValue={showData?showData.number.toUpperCase()+" "+showData.startTime:''}
                                   onClick={()=>{location.href="#/query_flight"}}  />
                        </section>
                        <section className="songji-input">
                            <img src={jsj_static_path+"/img/order-time.png"} />
                            <input type="text" placeholder="用车时间" ref="useTime" readOnly
                                   defaultValue={showData?showData.useTime:''}  />
                            <input type="datetime-local" onChange={this.handleDateChange} className="date-select"/>
                        </section>
                        <section className="from-to">
                            <ul><li/><li/><li/><li/><li/><li/></ul>
                            <div>
                                <p onClick={()=>location.href="#/destination?city="+(showData?showData.city:"深圳")}>
                                    <input placeholder="请输入出发地" readOnly ref="address"
                                           defaultValue={address} />
                                </p>
                                <p onClick={this.handleWarning}>
                                    <input  placeholder="航站楼" readOnly
                                            defaultValue={showData?showData.terminal:''}/>
                                </p>
                            </div>
                        </section>
                    </div>)}
                <button className="query-btn" onClick={this.handleQuery}>查询</button>
            </div>
        );
    },
    componentWillUnmount(){
        let dom=document.getElementById("dialog");
        dom.style.display="none";
    }
});
