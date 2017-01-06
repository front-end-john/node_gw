import React from 'react';
import ReactDOM from 'react-dom';
import Dialog from "../widgets/warning_dialog";
import {decDatetime} from '../util';
export default React.createClass({
    getInitialState(){
        return{
            showInfo:false,
            queryLocation:{}
        };
    },
    handleWarning(){
        let dom=document.getElementById("dialog");
        ReactDOM.render(<Dialog warn="已与航班号对应，无法修改"/>,dom);
        dom.style.display="block";
        this.setState({ showInfo:true});
    },
    handleQuery(){
        let paramsObj=this.state.queryLocation;
        console.log(paramsObj);
        let url="/jsj/jsjorder/querycartype";
        url+="?"+queryStr.stringify(paramsObj);
        console.log("查询车型url：",url);
        fetch(url).then(function(res){
            console.log("查询车型响应状态："+res.status);
            if(+res.status < 400){
                return res.text();
            }else {
                throw new Error("服务异常");
            }
        }).then((str)=>{
            console.log(JSON.parse(str));
            sessionStorage.setItem("carTypeList",str);
            location.href="#/select_car_type";
        }).catch(function(e) {
            console.trace('错误:', e);
        });
    },
    componentWillMount(){
        document.title="接送机";
        /**
         * 接机订单
         */
        sessionStorage.setItem("OrderType",1);
        let flight=sessionStorage.getItem("FlightInfo");
        if(flight){
            flight=JSON.parse(flight);
            /**
             * 航班的降落数据
             */

            let {year,month,day,hour,minute,week} =decDatetime(flight.landingtime);
            this.setState({flightInfo:{number:flight.flightnumber,year,month,day,
                hour,minute,weekday:weekday[week],
                city:flight.tocity,airport:flight.toairport,
                terminal:flight.toterminal}});
            this.state.queryLocation.ordertype=1;
            this.state.queryLocation.bookingtime=flight.landingtime;
            this.state.queryLocation.flightid=flight.id;
            sessionStorage.setItem("UserUseCarTime",year+'-'+month+'-'+day+' '+hour+':'+minute);
            /**
             * 航班的起飞数据
             */
            let {month:month1,day:day1,hour:hour1,minute:minute1} =decDatetime(flight.takingofftime);
            this.setState({takeoffFlight:{month:month1,day:day1,hour:hour1,minute:minute1,
                city:flight.fromcity,airport:flight.fromairport, terminal:flight.fromterminal}});
            /**
             * 获取降落机场航站楼的经纬度
             */
            let address=flight.tocity+flight.toairport+"机场"+flight.toterminal+"航站楼";
            let ak="CE6cd9406d95e0f351bc98a8898b9abf";
            let url="http://api.map.baidu.com/geocoder/v2/?address="+address+
                "&output=json&ak="+ak;
            fetchJsonp(encodeURI(url)).then((res)=>{
                return res.json();
            }).then((json)=>{
                console.log("**降落**航站楼的经纬度",json);
                this.state.queryLocation.startaddress=address;
                this.state.queryLocation.startlng=json.result.location.lng;
                this.state.queryLocation.startlat=json.result.location.lat;
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
            this.state.queryLocation.endaddress=dest.name;
            this.state.queryLocation.endlng=dest.location.lng;
            this.state.queryLocation.endlat=dest.location.lat;
        }
    },
    render(){
        let f=this.state.flightInfo;
        let tf=this.state.takeoffFlight;
        let dest=this.state.dest;
        return(
            <div className="jieji-query">
                <figure>
                   <img src={this.state.showInfo?"/weixinjsj/img/03.png":"/weixinjsj/img/01.jpg"} />
                    <ul className={this.state.showInfo?"flight-info show":"flight-info"}>
                        <li><p>起飞地</p><p>{tf?tf.month+'-'+tf.day+' '+tf.hour+':'+tf.minute:''}</p>
                            <p>{tf?tf.city+tf.airport+"机场"+tf.terminal:''}</p></li>
                        <li><p>目的地</p><p>{f?f.month+'-'+f.day+' '+f.hour+':'+f.minute:''}</p>
                            <p>{f?(f.city+f.airport+"机场"+f.terminal):''}</p></li>
                    </ul>
                </figure>
                <hgroup>
                    <h2 className="current">接机</h2>
                    <i/>
                    <h2 onClick={()=>location.href="#/songji_query"} >送机</h2>
                </hgroup>
                <section className="jieji-flight" >
                    <img src="/weixinjsj/img/02.png" />
                    <div onClick={()=>location.href="#/query_flight"}>
                        <input type="text" placeholder="请输入航班号"  onFocus={(e)=>{e.target.blur()}}
                        defaultValue={f?f.number+" "+f.year+'-'+f.month+'-'+f.day:''}/>
                        <p>{f?(f.month+'-'+f.day+' '+f.weekday+' '+f.hour+':'+f.minute+' 用车'):"航班延误，免费等待"}</p>
                    </div>
                </section>
                <section className="from-to">
                    <ul><li/><li/><li/><li/><li/><li/></ul>
                    <div>
                        <p onClick={this.handleWarning}>
                            <input  placeholder="航站楼" onFocus={(e)=>{e.target.blur()}}
                            defaultValue={f?f.city+f.airport+"机场"+f.terminal+"航站楼":''}/></p>
                        <p onClick={()=>location.href="#/destination?city="+f.city}>
                            <input placeholder="请输入目的地" defaultValue={dest?dest.name:''}/></p>
                    </div>
                </section>
                <button className="query-btn" onClick={this.handleQuery}>查询</button>
            </div>
        );
    }
});
