import React from 'react';
import ReactDOM from 'react-dom';
import Loading from '../widgets/loading';
import PulldownTip from '../widgets/pulldown_tip';
import {decDatetime} from '../util';
export default React.createClass({
    getInitialState(){
        return{
            showInfo:false,
            queryLocation:{}
        };
    },
    handleWarning(){
        let fi=this.state.flightInfo;
        let dom=document.getElementById("dialog");
        if(fi){
            ReactDOM.render(<PulldownTip msg="已与航班号对应，无法修改!" />,dom);
            //this.setState({ showInfo:true});
        }else {
            ReactDOM.render(<PulldownTip msg="请先选择航班号!" />,dom);
        }
    },
    handleQuery(){
        let dom=document.getElementById("dialog");
        let numberIn=this.refs.number,destIn=this.refs.dest;
        if(!numberIn.value){
            ReactDOM.render(<PulldownTip msg="请输入航班号!" />,dom);
            return 0;
        }
        if(!destIn.value){
            ReactDOM.render(<PulldownTip msg="请输入目的地!" />,dom);
            return 0;
        }
        /**
         * 显示加载中
         */
        ReactDOM.render(<Loading />,dom);
        dom.style.display="block";

        let paramsObj=this.state.queryLocation;
        console.log(paramsObj);
        let url="/jsj/user/querycartype";
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
                sessionStorage.setItem("carTypeList",str);
                location.href="#/select_car_type";
            }else {
                ReactDOM.render(<PulldownTip msg="查询失败!" />,dom);
            }

        }).catch(function(e){
            ReactDOM.render(<PulldownTip msg="查询失败!" />,dom);
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
            this.setState({ showInfo:true});
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
            }).catch(function(e){
                console.warn('错误', e);
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
        //console.dir(wx);
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
                        <input type="text" placeholder="请输入航班号" readOnly ref="number"
                        defaultValue={f?f.number.toUpperCase()+" "+f.year+'-'+f.month+'-'+f.day:''}/>
                        <p>{f?(f.month+'-'+f.day+' '+f.weekday+' '+f.hour+':'+f.minute+' 用车'):"航班延误，免费等待"}</p>
                    </div>
                </section>
                <section className="from-to">
                    <ul><li/><li/><li/><li/><li/><li/></ul>
                    <div>
                        <p onClick={this.handleWarning}>
                            <input  placeholder="航站楼" readOnly
                            defaultValue={f?f.city+f.airport+"机场"+f.terminal+"航站楼":''}/>
                        </p>
                        <p onClick={()=>location.href="#/destination?city="+(f?f.city:"深圳")}>
                            <input placeholder="请输入目的地" readOnly defaultValue={dest?dest.name:''} ref="dest"/>
                        </p>
                    </div>
                </section>
                <button className="query-btn" onClick={this.handleQuery}>查询</button>
            </div>
        );
    },
    componentWillUnmount(){
        let dom=document.getElementById("dialog");
        dom.style.display="none";
    }
});
