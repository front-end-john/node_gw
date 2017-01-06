import React from 'react';
import Dialog from "../widgets/warning_dialog";
import ReactDOM from 'react-dom';
export default React.createClass({
    handleDateChange(e){
        this.refs.dateInput.value=e.target.value;
    },
    handleQuery(){
        let date=this.refs.dateInput.value,number=this.refs.noInput.value.trim();
        let flightdate,flightnumber;
        if(date){
            flightdate=new Date(date+" 00:00:00").getTime();
        }else {
            let dom=document.getElementById("dialog");
            ReactDOM.render(<Dialog warn="未输入航班日期!" />,dom);
            dom.style.display="block";
            return 0;
        }
        if(number){
            flightnumber=number;
        }else {
            let dom=document.getElementById("dialog");
            ReactDOM.render(<Dialog warn="未输入航班号!" />,dom);
            dom.style.display="block";
            return 0;
        }
        let url="/jsj/jsjorder/queryflight";
        url+="?"+queryStr.stringify({flightdate,flightnumber});
        console.log("接机查询航班url：",url);
        fetch(url).then(function(res) {
            console.log("查询航班响应状态：",res.status);
            if(+res.status < 400){
                return res.text();
            }else {
                throw new Error("服务异常");
            }
        }).then((str)=>{
            sessionStorage.setItem("flightData",str);
            location.href="#/flight_list";
        }).catch(function(e) {
            console.log('错误：', e)
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
                    <input type="text" placeholder="起飞航班号" ref="noInput"/>
                </section>
                <button className="query-btn" onClick={this.handleQuery}>查询</button>
            </div>
        );
    }
});
