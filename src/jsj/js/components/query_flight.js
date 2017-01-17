import React from 'react';
import ReactDOM from 'react-dom';
import Loading from '../widgets/loading';
//import SelectDate from '../widgets/select_date';
import PulldownTip from '../widgets/pulldown_tip';
import {decDatetime} from '../util';
export default React.createClass({
    getInitialState(){
        return {flightTime:'',flightnumber:''}
    },
    handleDateChange(e){
        let timeStr=e.target.value;
        let currTimestamp=new Date(new Date().toLocaleDateString()).getTime();
        let selectTimestamp=new Date(new Date(timeStr).toLocaleDateString()).getTime();

        let dom=document.getElementById("dialog");
        if(selectTimestamp < currTimestamp){
            ReactDOM.render(<PulldownTip msg="只能选择今天或者今天之后的日期！" />,dom);
            return 0;
        }else if(selectTimestamp > currTimestamp+29*24*3600*1000){
            ReactDOM.render(<PulldownTip msg="只能选择30天以内的日期！" />,dom);
            return 0;
        }
        this.refs.dateIn.value=timeStr;
    },
    handleQuery(){
        let date=this.refs.dateIn.value,number=this.refs.noInput.value.trim();
        let flightdate,flightnumber;
        let dom=document.getElementById("dialog");
        if(number){
            flightnumber=number;
        }else {
            ReactDOM.render(<PulldownTip msg="请输入航班号！" />,dom);
            return 0;
        }
        if(date){
            flightdate=new Date(new Date(date).toLocaleDateString()).getTime();
        }else {
            ReactDOM.render(<PulldownTip msg="请选择航班起飞日期！" />,dom);
            return 0;
        }
        /**
         * 显示加载中
         */
        ReactDOM.render(<Loading />,dom);
        dom.style.display="block";

        let url=jsj_api_path+"/user/queryflight";
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
            //console.log(obj);
            if(obj.code==0){
                sessionStorage.setItem("FlightData",str);
                location.href="#/flight_list";
            }else {
                ReactDOM.render(<PulldownTip msg={obj.message} />,dom);
            }
        }).catch(function(e) {
            ReactDOM.render(<PulldownTip msg="查询失败！" />,dom);
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
                <div>
                    <section className="songji-input">
                        <img src={jsj_static_path+"/img/05.png"} />
                        <input type="text" placeholder="航班号" ref="noInput" defaultValue={this.state.flightnumber}/>
                    </section>
                    <section className="songji-input">
                        <img src={jsj_static_path+"/img/04.png"} />
                        <input type="text" placeholder="请选择航班起飞日期" ref="dateIn" readOnly
                               defaultValue={this.state.flightTime||""} onClick={this.openDateSelect}/>
                       <input type="date" onChange={this.handleDateChange} className="date-select"/>
                    </section>
                    <button className="query-btn" onClick={this.handleQuery}>查询</button>
                </div>
            </div>
        );
    },
    componentWillUnmount(){
        let dom=document.getElementById("dialog");
        dom.style.display="none";
    }
});
