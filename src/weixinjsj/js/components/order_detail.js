import React from 'react';

export default React.createClass({

    componentWillMount(){
        document.title="订单信息";
        /**
         * 车型数据
         */
        let cartype=sessionStorage.getItem('selectedCarType');
        if(cartype){
            cartype=JSON.parse(cartype);
            this.setState({carTypeInfo:cartype});
        }

        /**
         * 目的地数据
         */
        let dest=sessionStorage.getItem("UserDest");
        if(dest){
            dest=JSON.parse(dest);
            this.setState({destName:dest.name});
        }
        /**
         * 联系人数据
         */
        let contact=sessionStorage.getItem("contactPerson");
        if(contact){
            /*联系人已存在*/
            contact=JSON.parse(contact);
            this.setState({contactPerson:contact});
        }else {
            /*联系人不存在，后台获取*/
            let url="http://192.168.1.234:8080/txj-jsj/jsj/jsjorder/queryuser";
            console.log("查询航班：",url);
            fetch(url,{
                method: 'GET',
                mode: 'cors'
            }).then(function(res) {
                console.log(res.status);
                return res.text();
            }).then((str)=>{
                console.log(str);
                this.setState({contactPerson:JSON.parse(str).record});
            }).catch(function(e) {
                console.warn('parsing failed', e)
            });
        }
        /**
         * 用户备注数据
         */
        let remark=sessionStorage.getItem('userRemark');
        if(remark) this.setState({remark});
    },
    /**
     * 处理用户备注更改
     */
    handleRemarkChange(e){
        let remark=e.target.value;
        this.setState({remark});
        sessionStorage.setItem("userRemark",remark);
    },
    /**
     * 处理联系人更改
     */
    handleModifyContact(){
        sessionStorage.setItem("contactPerson",JSON.stringify(this.state.contactPerson));
        location.href="#/contact_person";
    },
    /**
     * 处理下单请求
     */
    handlePay(){
        let c=this.state.carTypeInfo;
        let flight=sessionStorage.getItem("FlightInfo");
        flight=JSON.parse(flight);

        let p=this.state.contactPerson;
        let ordertype=sessionStorage.getItem("OrderType");
        let actualname=p.name;
        let actualphone=p.phonenumber;
        let cartype=c.id;
        let pricemark=sessionStorage.getItem('pricemark');
        let totalfee=c.totalfee;
        let userremark=this.state.remark;
        let paramsObj={ordertype,actualname,actualphone,cartype,pricemark,totalfee,userremark};
        console.log(paramsObj);
        let url="http://192.168.1.234:8080/txj-jsj/jsj//jsjorder/new";
        url+="?"+queryStr.stringify(paramsObj,null,null,{encodeURIComponent: encodeURI});
        console.info("下单：",url);
        fetch(url,{
            method: 'GET',
            mode: 'cors'
        }).then(function(res) {
            console.log(res.status);
            return res.text();
        }).then((str)=>{
            let obj=JSON.parse(str);
            console.log(obj);
            if(obj.code==0){
                location.href="#/travel_detail/1";
            }else {

            }
        }).catch(function(e) {
            console.warn('parsing failed', e);
        });
    },
    render(){
        let orderType=sessionStorage.getItem("OrderType"),detail=[];
        let flight=sessionStorage.getItem("FlightInfo");
        let f=JSON.parse(flight);
        let useCarTime=sessionStorage.getItem("UserUseCarTime");
        let c=this.state.carTypeInfo;
        let d=this.state.destName;
        let p=this.state.contactPerson;

        if(+orderType==1){
            detail[0]=(<li key={0}>
                        <p>出发机场</p><p>{f?f.tocity+f.toairport+"机场"+f.toterminal:''}</p>
                    </li>);
            detail[1]=(<li key={1}><p>送达地址</p><p>{d?d:""}</p></li>);
        }else {
            detail[0]=(<li key={0}>
                <p>出发地址</p><p>{d?d:""}</p>
            </li>);
            detail[1]=(<li key={1}><p>送达机场</p><p>{f?f.fromcity+f.fromairport+"机场"+f.fromterminal:''}</p></li>);
        }

        return(
            <div className="order-detail">
                <ul className="order-car-info">
                    <li>
                        <img src={c.imgUrl}/>
                    </li>
                    <li>
                        <p><em>{c?c.cartype:''}</em>
                            <img src="/weixinjsj/img/people.png"/> &le;{c?c.passengernumber:0}人
                            <img src="/weixinjsj/img/trunk.png"/> &le;{c?c.luggagenumber:0}件</p>
                        <p>{c?c.cardescription:''}</p>
                    </li>
                </ul>
                <ul className="order-flight-info">
                    <li>接机</li>
                    <li><p>航班号</p><p>{f?f.flightnumber:''}</p></li>
                    <li>
                        <p>用车时间</p><p>{useCarTime||''}</p>
                    </li>
                    {detail}
                    <li>
                        <p>行程备注</p>
                        <p><textarea placeholder="提前告知司机途径地点，方便司机规划行程(选填)"
                                     defaultValue={this.state.remark||''} onChange={this.handleRemarkChange} /></p>
                    </li>
                </ul>

                <ul className="order-contact" onClick={this.handleModifyContact}>
                    <li>联系人</li>
                    <li>{p?p.name:''}&ensp;{p?p.phonenumber:''}<i className="arrow" /></li>
                </ul>
                <p className="notice"><a href="#">《预定须知&退订须知》</a></p>
                <ul className="bottom-pay">
                    <li>需支付:<em>&yen;{c?c.totalfee:0}.00</em></li>
                    <li onClick={this.handlePay}>进行支付</li>
                </ul>
            </div>
        );
    }
});
