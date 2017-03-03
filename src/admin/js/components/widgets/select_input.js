import React from 'react';

export default React.createClass({
    getInitialState(){
        return {list:[]}
    },
    componentWillMount(){
        let dataList=[];
        let type=this.props.name;
        if(type=="order_status"){
            dataList=[{name:"全部",value:'all'},{name:"已预约",value:"booking"},
                {name:"在库",value:"parkingparked"}, {name:" 已送还",value:"returningfinished"},
                {name:"待支付",value:"needtopay"},{name:"已取消",value:"canceled"}];
        }else if(type=="time_type"){
            dataList=[{name:"全部",value:''},{name:"预约接车时间",value:"bookingtime"},{name:"接车时间",value:"parkingstartedtime"},
                {name:"停车入库时间",value:"parkingfinishedtime"}, {name:"预约送车时间",value:"WUHANSHENGYI"},
                {name:"开始送车时间",value:"returningstartedtime"},{name:"完成送车时间",value:"returningfinishedtime"}];
        }else if(type=="service_star" || type=="parking_star" || type=="sending_star"){
            dataList=[{name:"全部",value:''},{name:"五星",value:"5"},{name:"四星及以上",value:"4"},
                {name:"三星及以下",value:"3"}, {name:"二星及以下",value:"2"}, {name:"一星",value:"0"}];
        }else if(type=="show_status"){
            dataList=[{name:"全部",value:''},{name:"未回复",value:"0"},{name:"已回复且全部用户可见",value:"11"},
                {name:"已回复且仅此用户可见",value:"10"}];
        }else if(type=="parking_driver" || type=="sending_driver"){
            dataList=[{name:"全部",value:''},{name:"梁飞",value:"5"},{name:"韩松岩",value:"8"},{name:"农万斌",value:"10"}];
        }
        this.setState({list:dataList});
    },
    componentDidMount(){
        if(this.props.name=="airport") {
            let url = "/admin/api/areas/airports";
            console.log("机场列表url",url);
            fetch(url).then(function (res) {
                console.log("机场列表响应：" + res.status);
                if (+res.status < 400) {
                    return res.text();
                }else{
                    throw new Error("服务异常");
                }
            }).then((str) => {
                let obj = JSON.parse(str);
                let dataList=obj.airports.map((item)=>{
                    return {name:item.cityname+item.name,value:item.airportid}
                });
                this.setState({list:[{name:"全部",value:''},...dataList]});
            }).catch(function (e) {
                console.trace('错误:', e);
            });
        }else if(this.props.name=="order_source") {
            let url = "/admin/api/orders/get_comefroms";
            console.log("订单来源列表url",url);
            fetch(url).then((res)=>{
                console.log("订单来源列表响应：" + res.status);
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
                    this.setState({list:[{name:"全部",value:''},...dataList]});
                }else {
                    console.log("订单来源列表获取失败！");
                }
            }).catch((e)=>{
                console.trace('错误:', e);
            });
        }
    },
    reset(){ this.select.value="";},
    render(){
        let list=this.state.list.map(function (item,index) {
            return(
                <option value={item.value} key={index}>{item.name}</option>
            );
        });
        return(
            <p className="input-item select-item">
                <label style={{paddingLeft:this.props.pdl||20}}>{this.props.title}</label>
                <select id={this.props.name} ref={(c)=>this.select=c}  onChange={this.props.change} >
                    {list}
                </select>
            </p>
        );
    }
});
