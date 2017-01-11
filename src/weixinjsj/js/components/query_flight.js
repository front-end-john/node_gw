import React from 'react';
import ReactDOM from 'react-dom';
import Loading from '../widgets/loading';
import SelectDate from '../widgets/select_date';
import PulldownTip from '../widgets/pulldown_tip';
import {decDatetime} from '../util';
export default React.createClass({
    getInitialState(){
        return {flightTime:'',flightnumber:''}
    },
    openDateSelect(){
        let dom=document.getElementById("dialog");
        ReactDOM.render(<SelectDate ensure={this.handleEnsure}  hour="off" minute="off" ref={(c)=> this.dateSelect=c} />,dom);
        dom.style.display="block";
    },
    handleEnsure(){
        let dom=document.getElementById("dialog");
        dom.style.display="none";
        let d=this.dateSelect.state.dateObj;
        let {year,month,day}=decDatetime(d.date.getTime());
        this.refs.dateInput.value=year+"-"+month+"-"+day
    },
    /*handleDateChange(e){
        this.refs.dateInput.value=e.target.value;
    },*/
    handleQuery(){
        let date=this.refs.dateInput.value,number=this.refs.noInput.value.trim();
        let flightdate,flightnumber;
        let dom=document.getElementById("dialog");
        if(number){
            flightnumber=number;
        }else {
            ReactDOM.render(<PulldownTip msg="未输入航班号!" />,dom);
            return 0;
        }
        if(date){
            let str=date.replace(/\-/g,'/')+" 00:00:00";
            console.log(str);
            let dt=new Date(str);
            flightdate=dt.getTime();
        }else {
            ReactDOM.render(<PulldownTip msg="未输入航班日期!" />,dom);
            return 0;
        }
        /**
         * 显示加载中
         */
        ReactDOM.render(<Loading />,dom);
        dom.style.display="block";

        let url="/jsj/user/queryflight";
        url+="?"+queryStr.stringify({flightdate,flightnumber});
        console.log("接机查询航班url：",url);
        fetch(url).then(function(res) {
            console.log("查询航班响应状态：",res.status);
            dom.style.display="none";
            if(+res.status < 400){
                return res.text();
            }else {
                throw new Error("服务异常");
            }
        }).then((str)=>{
            let obj=JSON.parse(str);
            if(obj.records.length>0){
                sessionStorage.setItem("flightData",str);
                location.href="#/flight_list";
            }else {
                ReactDOM.render(<PulldownTip msg="未查询到航班信息!" />,dom);
            }
        }).catch(function(e) {
            ReactDOM.render(<PulldownTip msg="查询失败!" />,dom);
            console.log('错误：', e)
        });
    },
    componentWillMount(){
        let flight=sessionStorage.getItem("FlightInfo");
        let orderType=sessionStorage.getItem("OrderType");
        orderType==1?document.title="接机航班":document.title="送机航班";
        if(flight){
            flight=JSON.parse(flight);
            this.setState({flightnumber:flight.flightnumber});
            /**
             * 航班的降落时间
             */
            let {year,month,day,hour,minute} =decDatetime(flight.landingtime);
            /**
             * 航班的起飞时间
             */
            let {year:year1,month:month1,day:day1,hour:hour1,minute:minute1} =decDatetime(flight.takingofftime);
            if(orderType==1){
                this.setState({flightTime:year+'-'+month+'-'+day});
            }else {
                this.setState({flightTime:year1+'-'+month1+'-'+day1});
            }
        }
    },
    render(){
        return(
            <div className="jieji-query">
                <section className="songji-input">
                    <img src="/weixinjsj/img/05.png" />
                    <input type="text" placeholder="航班号" ref="noInput" defaultValue={this.state.flightnumber}/>
                </section>
                <section className="songji-input">
                    <img src="/weixinjsj/img/04.png" />
                    <input type="text" placeholder="请选择航班起飞日期" ref="dateInput" readOnly
                           defaultValue={this.state.flightTime||""} onClick={this.openDateSelect}/>
                    {/*<input type="date" onChange={this.handleDateChange} className="date-select"/>*/}
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
