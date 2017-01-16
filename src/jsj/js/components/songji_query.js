import React from 'react';
import ReactDOM from 'react-dom';
//import SelectDate from '../widgets/select_date';
import PulldownTip from '../widgets/pulldown_tip';
import Loading from '../widgets/loading';
import {decDatetime,getLocalTimestamp} from '../util';
export default React.createClass({
    getInitialState(){
        return{
            imgLoaded:true,
            showInfo:false,
            queryLocation:{}
        };
    },
    /*openDateSelect(){
        let dom=document.getElementById("dialog");
        ReactDOM.render(<SelectDate ensure={this.handleEnsureDate}  />,dom);
        dom.style.display="block";
    },
    handleEnsureDate(dt,hour,minute){
        let dom=document.getElementById("dialog");
        dom.style.display="none";
        hour=hour<10?"0"+hour:hour;
        minute=minute<10?"0"+minute:minute;
        let {year,month,day}=decDatetime(dt.getTime());
        this.refs.useTime.value=year+"-"+month+"-"+day+" "+hour+":"+minute;
        /!**
         * 更新用车/预约时间
         *!/
        this.state.queryLocation.bookingtime=new Date(year+"/"+month+"/"+day+" "+hour+":"+minute).getTime();
        sessionStorage.setItem("UserUseCarTime",this.refs.useTime.value);
    },*/
    handleDateChange(e){
        let timeStr=e.target.value;
        let localTimestamp=getLocalTimestamp(timeStr);
        //let {year,month,day,hour,minute}=decDatetime(localTimestamp);
        this.refs.useTime.value=timeStr.replace('T',' ');
        /**
         * 更新用车/预约时间
         */
        this.state.queryLocation.bookingtime=localTimestamp;
        sessionStorage.setItem("UserUseCarTime",timeStr);
    },
    handleWarning(){
        let fi=this.state.flightInfo;
        let dom=document.getElementById("dialog");
        if(fi){
            ReactDOM.render(<PulldownTip msg="已与航班号对应，无法修改!" />,dom);
        }else {
            ReactDOM.render(<PulldownTip msg="请先选择航班号!" />,dom);
        }

    },
    componentWillMount(){
        document.title="接送机";
        /**
         * 送机订单
         */
        sessionStorage.setItem("OrderType",2);
        let flight=sessionStorage.getItem("FlightInfo");
        if(flight){
            flight=JSON.parse(flight);
            console.log(flight);
            /**
             * 航班的降落数据
             */
            let {year,month,day,hour,minute,week} = decDatetime(flight.landingtime);
            this.setState({flightInfo:{number:flight.flightnumber,year,month,day,hour,minute,
                weekday:weekday[week], city:flight.tocity,airport:flight.toairport,
                terminal:flight.toterminal}});

            this.state.queryLocation.ordertype=2;
            this.state.queryLocation.bookingtime=flight.takingofftime - 3600*3;
            this.state.queryLocation.flightid=flight.id;

            /**
             * 航班的起飞数据
             */
            let {year:year1,month:month1,day:day1,hour:hour1,minute:minute1} = decDatetime(flight.takingofftime - 3600*3);
            this.setState({takeoffFlight:{year:year1,month:month1,day:day1,hour:hour1,minute:minute1,
                city:flight.fromcity,airport:flight.fromairport, terminal:flight.fromterminal}});

            /*保存默认用车时间,仅在第一次加载时*/
            if(!sessionStorage.getItem("UserUseCarTime")){
                sessionStorage.setItem("UserUseCarTime",year1+'-'+month1+'-'+day1+' '+hour1+':'+minute1);
            }
            let {year:year2,month:month2,day:day2,hour:hour2,minute:minute2} = decDatetime(flight.takingofftime);
            this.setState({takeoffTime:year2+'-'+month2+'-'+day2+' '+hour2+':'+minute2});
            this.setState({ showInfo:true});
            /**
             * 获取起飞机场航站楼的经纬度
             */
            let address=flight.fromcity+flight.fromairport+"机场"+flight.fromterminal+"航站楼";
            let ak="CE6cd9406d95e0f351bc98a8898b9abf";
            let url="http://api.map.baidu.com/geocoder/v2/?address="+address+
                "&output=json&ak="+ak;
            fetchJsonp(encodeURI(url)).then((res)=>{
                return res.json();
            }).then((json)=>{
                console.info("**起飞**航站楼的经纬度",json);
                this.state.queryLocation.endaddress=address;
                this.state.queryLocation.endlng=json.result.location.lng;
                this.state.queryLocation.endlat=json.result.location.lat;
            }).catch(function(e) {
                console.warn('parsing failed', e);
            });
        }
        /**
         * 目的地数据
         */
        let dest=sessionStorage.getItem("UserDest");
        if(dest){
            dest=JSON.parse(dest);
            this.setState({dest:{name:dest.name}});
            this.state.queryLocation.startaddress=dest.name;
            this.state.queryLocation.startlng=dest.location.lng;
            this.state.queryLocation.startlat=dest.location.lat;
        }
    },
    handleQuery(){
        let dom=document.getElementById("dialog");
        let numberIn=this.refs.number,destIn=this.refs.dest,
            useTimeIn=this.refs.useTime;
        if(!numberIn.value){
            ReactDOM.render(<PulldownTip msg="请输入航班号!" />,dom);
            return 0;
        }
        if(!useTimeIn.value){
            ReactDOM.render(<PulldownTip msg="请输入用车时间!" />,dom);
            return 0;
        }
        if(!destIn.value){
            ReactDOM.render(<PulldownTip msg="请输入出发地!" />,dom);
            return 0;
        }
        /**
         * 显示加载中
         */
        ReactDOM.render(<Loading />,dom);
        dom.style.display="block";

        let paramsObj=this.state.queryLocation;
        //console.log(paramsObj);
        let url="/jsj/user/querycartype";
        url+="?"+queryStr.stringify(paramsObj);
        console.log("送机查询车型url：",url);
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
            if(obj.code==0){
                sessionStorage.setItem("carTypeList",str);
                location.href="#/select_car_type";
            }else {
                ReactDOM.render(<PulldownTip msg="查询失败!" />,dom);
            }
        }).catch(function(e) {
            ReactDOM.render(<PulldownTip msg="查询失败!" />,dom);
            console.trace('错误:', e);
        });
    },
    handleImageLoaded(){this.setState({ imgLoaded: true });},
    handleImageErrored(){this.setState({ imgLoaded: true });},
    render(){
        let f=this.state.flightInfo;
        let tf=this.state.takeoffFlight;
        let dest=this.state.dest;
        let useCarTime=sessionStorage.getItem("UserUseCarTime");
        return(
            <div className="jieji-query">
                <figure>
                   <img src={this.state.showInfo?jsj_static_path+"/img/03.png":jsj_static_path+"/img/send-flight.png"}/>
                    <ul className={this.state.showInfo?"flight-info show":"flight-info"}>
                        <li><p>起飞地</p><p>{tf?tf.month+'-'+tf.day+' '+tf.hour+':'+tf.minute:''}</p>
                            <p>{tf?tf.city+tf.airport+"机场"+tf.terminal:''}</p></li>
                        <li><p>目的地</p><p>{f?f.month+'-'+f.day+' '+f.hour+':'+f.minute:''}</p>
                            <p>{f?(f.city+f.airport+"机场"+f.terminal):''}</p></li>
                    </ul>
                </figure>
                {this.state.imgLoaded?(<div>
                    <hgroup>
                        <h2 onClick={()=>location.href="#/jieji_query"} >接机</h2>
                        <i/><h2 className="current">送机</h2>
                    </hgroup>
                    <section className="songji-input" >
                        <img src={jsj_static_path+"/img/02.png"} />
                        <input type="text" placeholder="请输入航班号" readOnly ref="number"
                        defaultValue={f?(f.number.toUpperCase()+'  '+this.state.takeoffTime):''}
                              onClick={()=>{location.href="#/query_flight"}}  />
                    </section>
                    <section className="songji-input">
                        <img src={jsj_static_path+"/img/order-time.png"} />
                        <input type="text" placeholder="用车时间" ref="useTime" readOnly
                               defaultValue={useCarTime||''} onClick={this.openDateSelect} />
                        <input type="datetime-local" onChange={this.handleDateChange} className="date-select"/>
                    </section>
                    <section className="from-to">
                        <ul><li/><li/><li/><li/><li/><li/></ul>
                        <div>
                            <p onClick={()=>location.href="#/destination?city="+(tf?tf.city:"深圳")}>
                                <input placeholder="请输入出发地" readOnly ref="dest"
                                       defaultValue={dest?dest.name:''} />
                            </p>
                            <p onClick={this.handleWarning}>
                                <input  placeholder="航站楼" readOnly
                                        defaultValue={tf?tf.city+tf.airport+"机场"+tf.terminal+"航站楼":''}/>
                            </p>
                        </div>
                    </section>
                    <button className="query-btn" onClick={this.handleQuery}>查询</button>
                </div>):""}
            </div>
        );
    },
    componentWillUnmount(){
        let dom=document.getElementById("dialog");
        dom.style.display="none";
    }
});
