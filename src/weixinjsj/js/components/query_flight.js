import React from 'react';
export default React.createClass({
    flightInfo:{},
    handleDateChange(e){
        let dt=e.target.value;
        this.refs.dateInput.value=dt;
        this.flightInfo.flightdate=new Date(dt+" 00:00:00").getTime();
    },
    handleNoChange(e){
        this.flightInfo.flightnumber=e.target.value;
    },
    handleQuery(){
        let url="http://192.168.1.234:8080/txj-jsj/jsj/jsjorder/queryflight";
        url+="?"+queryStr.stringify(this.flightInfo);
        console.log("查询航班：",url);
        fetch(url,{
            method: 'GET',
            mode: 'cors'
        }).then(function(res) {
            console.log(res.status);
            return res.text();
        }).then((str)=>{
            sessionStorage.setItem("flightData",str);
            location.href="#/flight_list";
        }).catch(function(e) {
            console.log('parsing failed', e)
        });
    },
    componentWillMount(){
        document.title="接机航班";
    },
    render(){
        return(
            <div className="jieji-query">
                <section className="songji-input">
                    <img src="/weixinjsj/img/04.png" />
                    <input type="text" placeholder="请填写起飞航班日期" ref="dateInput" />
                    <input type="date" onChange={this.handleDateChange} className="date-select"/>
                </section>
                <section className="songji-input">
                    <img src="/weixinjsj/img/05.png" />
                    <input type="text" placeholder="起飞航班号" onChange={this.handleNoChange}/>
                </section>
                <button className="query-btn" onClick={this.handleQuery}>查询</button>
            </div>
        );
    }
});
