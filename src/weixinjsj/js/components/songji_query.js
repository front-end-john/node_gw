import React from 'react';
import ReactDOM from 'react-dom';
import SelectDate from '../widgets/select_date';
import Dialog from "../widgets/warning_dialog";
import {decDatetime} from '../util';
export default React.createClass({
    getInitialState(){
        return{
            showInfo:false,
            queryLocation:{}
        };
    },
    handleDateSelect(){
        let dom=document.getElementById("dialog");
        ReactDOM.render(<SelectDate ensure={this.handleEnsure} ref={(c)=> this.dateSelect=c} />,dom);
        dom.style.display="block";
    },
    handleEnsure(){
        let dom=document.getElementById("dialog");
        dom.style.display="none";
        let d=this.dateSelect.state.dateObj;
        let hourStr=d.hour<10?"0"+d.hour:d.hour;
        let minuteStr=d.minute<10?"0"+d.minute:d.minute;
        let month=d.date.getMonth()+1;month=month<10?'0'+month:month;
        let day=d.date.getDate();day=day<10?'0'+day:day;
        this.refs.useTime.value=d.date.getFullYear()+"-"+month+"-"+day+" "+hourStr+":"+minuteStr;
        this.state.queryLocation.bookingtime=d.date.getTime();
        /*更新用车时间*/
        sessionStorage.setItem("UserUseCarTime",this.refs.useTime.value);
    },
    handleWarning(){
        let dom=document.getElementById("dialog");
        ReactDOM.render(<Dialog warn="已与航班号对应，无法修改" />,dom);
        dom.style.display="block";
        this.setState({ showInfo:true});
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
                sessionStorage.setItem("UserUseCarTime",tyear+'-'+tmonth+'-'+tday+' '+thour+':'+tminute);
            }
            let {year:year2,month:month2,day:day2,hour:hour2,minute:minute2} = decDatetime(flight.takingofftime);
            this.setState({takeoffTime:year2+'-'+month2+'-'+day2+' '+hour2+':'+minute2});
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
        let paramsObj=this.state.queryLocation;
        console.log(paramsObj);
        let url="/jsj/jsjorder/querycartype";
        url+="?"+queryStr.stringify(paramsObj);
        console.log("查询车型：",url);
        fetch(url).then(function(res) {
            console.log(res.status);
            return res.text();
        }).then((str)=>{
            console.log(JSON.parse(str));
            sessionStorage.setItem("carTypeList",str);
            location.href="#/select_car_type";
        }).catch(function(e) {
            console.warn('parsing failed', e);
        });
    },
    render(){
        let f=this.state.flightInfo;
        let tf=this.state.takeoffFlight;
        let dest=this.state.dest;
        let useCarTime=sessionStorage.getItem("UserUseCarTime");
        return(
            <div className="jieji-query">
                <figure>
                   <img src={this.state.showInfo?"/weixinjsj/img/03.png":"/weixinjsj/img/send-flight.png"} />
                    <ul className={this.state.showInfo?"flight-info show":"flight-info"}>
                        <li><p>起飞地</p><p>{tf?tf.month+'-'+tf.day+' '+tf.hour+':'+tf.minute:''}</p>
                            <p>{tf?tf.city+tf.airport+"机场"+tf.terminal:''}</p></li>
                        <li><p>目的地</p><p>{f?f.month+'-'+f.day+' '+f.hour+':'+f.minute:''}</p>
                            <p>{f?(f.city+f.airport+"机场"+f.terminal):''}</p></li>
                    </ul>
                </figure>
                <hgroup>
                    <h2 onClick={()=>location.href="#/jieji_query"} >接机</h2>
                    <i/><h2 className="current">送机</h2>
                </hgroup>
                <section className="songji-input" onClick={()=>location.href="#/query_flight"}>
                    <img src="/weixinjsj/img/02.png" />
                   <input type="text" placeholder="请输入航班号" defaultValue={f?(f.number+'  '+this.state.takeoffTime):''}
                          onFocus={(e)=>e.target.blur()}/>
                </section>
                <section className="songji-input">
                    <img src="/weixinjsj/img/order-time.png" />
                    <input type="text" placeholder="用车时间" ref="useTime"
                           defaultValue={useCarTime||''}
                           onClick={this.handleDateSelect} />
                </section>
                <section className="from-to">
                    <ul><li/><li/><li/><li/><li/><li/></ul>
                    <div>
                        <p onClick={()=>location.href="#/destination"}>
                            <input placeholder="请输入出发地" defaultValue={dest?dest.name:''}
                                   onFocus={(e)=>e.target.blur()}/></p>
                        <p onClick={this.handleWarning}>
                            <input  placeholder="航站楼" onClick={(e)=>{e.target.blur()}}
                                    defaultValue={tf?tf.city+tf.airport+"机场"+tf.terminal+"航站楼":''}/></p>
                    </div>
                </section>
                <button className="query-btn" onClick={this.handleQuery}>查询</button>
            </div>
        );
    }
});
