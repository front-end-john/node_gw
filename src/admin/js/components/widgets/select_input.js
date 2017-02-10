import React from 'react';

let SelectInput=React.createClass({
    getInitialState(){
        return {
            list:[]
        }
    },
    componentWillMount(){
        let dataList=[];
        if(this.props.name=="order_status"){
            dataList=[{name:"已取消",value:-1},{name:"预约接车单生成",value:0}, {name:"客服已确认",value:1},
                {name:"调度司机中",value:3},{name:"司机已分配",value:5},{name:"司机已就位",value:8},
                {name:"已接车",value:10},{name:"已泊车",value:15},{name:"钥匙交出",value:16},
                {name:"立即送车单生成",value:20},{name:"调度司机中",value:23},{name:"司机已分配",value:25},
                {name:"已出发",value:30},{name:"已交车",value:35},{name:"用户确认已交车",value:36},
                {name:"已支付",value:38},{name:"订单完成",value:50}];
        }else if(this.props.name=="time_type"){
            dataList=[{name:":预约接车时间",value:"bookingtime"},{name:"接车时间",value:"parkingstartedtime"},
                {name:"停车入库时间",value:"parkingfinishedtime"}, {name:"预约送车时间",value:"WUHANSHENGYI"},
                {name:"开始送车时间",value:"returningstartedtime"},{name:"完成送车时间",value:"returningfinishedtime"}];
        }
        this.setState({list:dataList});
    },
    componentDidMount(){
        if(this.props.name=="airport") {
            let url = "/admin/api/areas/airports";
            fetch(url).then(function (res) {
                console.log("获取机场列表响应状态：" + res.status);
                if (+res.status < 400) {
                    return res.text();
                } else {
                    throw new Error("服务异常");
                }
            }).then((str) => {
                let obj = JSON.parse(str);
                let dataList=obj.airports.map((item)=>{
                    return {name:item.cityname+item.name,value:item.airportid}
                });
                this.setState({list:dataList});
            }).catch(function (e) {
                console.trace('错误:', e);
            });
        }else if(this.props.name=="order_source") {
            let url = "/admin/api/orders/get_comefroms";
            fetch(url).then(function (res) {
                //console.log("获取机场列表响应状态：" + res.status);
                if (+res.status < 400) {
                    return res.text();
                } else {
                    throw new Error("服务异常");
                }
            }).then((str) => {
                let obj = JSON.parse(str);
                if(obj.code==0){
                    let cf=obj.comefroms;
                    let keys=Object.getOwnPropertyNames(cf).sort();
                    let dataList=keys.map((item)=>{
                        return {name:cf[item],value:item}
                    });
                    this.setState({list:dataList});
                }else {
                    console.log("订单来源列表获取失败！");
                }
            }).catch(function (e) {
                console.trace('错误:', e);
            });
        }
    },
    render(){
        let list=this.state.list.map(function (item,index) {
            return(
                <option value={item.value} key={index}>{item.name}</option>
            );
        });
        return(
            <p className="input-item select-item">
                <label>{this.props.title}</label>
                <select id={this.props.name}  onChange={this.props.change} >
                    <option value="">{this.props.defaultName}</option>
                    {list}
                </select>
            </p>
        );
    }
});

export default SelectInput;