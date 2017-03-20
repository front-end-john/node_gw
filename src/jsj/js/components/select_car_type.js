import React from 'react';
import ReactDOM from 'react-dom';
import Loading from '../widgets/loading';
import PulldownTip from '../widgets/pulldown_tip';
export default React.createClass({
    componentWillMount(){
        document.title="选择车型";
        let carData=sessionStorage.getItem("CarTypeList");
        carData=JSON.parse(carData)||{};
        /**
         * 保存查询标识
         */
        sessionStorage.setItem("pricemark",carData.pricemark);
        this.setState({cars:carData.records||[]});
        /**
         *初始化车图片列表
         */
        this.carImgList=[jsj_static_path+"/img/07.png",jsj_static_path+"/img/08.png",
            jsj_static_path+"/img/09.png",jsj_static_path+"/img/10.png"];

        /**
         * 联系人数据
         */
        let contact=sessionStorage.getItem("ContactPerson");
        if(!contact){
            /**
             * 联系人不存在，后台获取
             */
            let url=jsj_api_path+"/user/queryuser";
            console.log("查询航班url：",url);
            fetch(url,{credentials:'include'}).then(function(res) {
                console.log("查询航班响应状态：",res.status);
                if(+res.status < 400){
                    return res.text();
                }else {
                    throw new Error("服务异常");
                }
            }).then((str)=>{
                let obj=JSON.parse(str);
                console.log("后台获取的联系人：",obj);
                sessionStorage.setItem("ContactPerson",JSON.stringify(obj.record));
            }).catch(function(e) {
                console.warn('错误', e)
            });
        }
    },
    handleClickSelect(e){
        let id=e.target.id;
        let selectedCarType=this.state.cars[id]||{};
        selectedCarType.imgUrl=this.carImgList[+selectedCarType.id-1];
        sessionStorage.setItem("SelectedCarType",JSON.stringify(selectedCarType));
        let flight=sessionStorage.getItem("FlightInfo");
        flight=JSON.parse(flight);
        let cp=sessionStorage.getItem("ContactPerson");
        cp=cp?JSON.parse(cp):{};
        let ordertype=sessionStorage.getItem("OrderType");
        let actualname=cp.name||"";
        let actualphone=cp.phonenumber||"";
        let pricemark=sessionStorage.getItem('pricemark');
        let totalfee=selectedCarType.totalfee;
        let cartype=selectedCarType.id;
        let userremark="";
        let paramsObj={ordertype,actualname,actualphone,cartype,pricemark,totalfee,userremark};
        /**
         * 显示加载中
         */
        let dom=document.getElementById("dialog");
        ReactDOM.render(<Loading />,dom);
        dom.style.display="block";

        console.log("创建订的参数：",paramsObj);
        let url=jsj_api_path+"/user/new";
        url+="?"+queryStr.stringify(paramsObj);

        console.info("创建订单url：",url);
        fetch(url,{credentials:'include'}).then(function(res){
            console.log("创建订单响应状态：",res.status);
            if(+res.status < 400){
                return res.text();
            }else {
                throw new Error("服务异常");
            }
        }).then((str)=>{
            let obj=JSON.parse(str);
            console.log(obj);
            if(obj.code == 0){
                let serialnumber=obj.record.serialnumber;
                sessionStorage.setItem("OrderSerialNumber",serialnumber);
                location.href="http://m.feiche51.com/pages/weixin_code?redirect_url=http://dev.feibotong.com/mobile/jsj/order_pay?serialnumber="+serialnumber;
            }else {
                dom.style.display="none";
                ReactDOM.render(<PulldownTip msg={obj.message} />,dom);
            }
        }).catch(function(e){
            dom.style.display="none";
            ReactDOM.render(<PulldownTip msg="订单创建请求失败,请稍后再试!" />,dom);
            console.warn('错误', e);
        });
    },
    render(){
        let list=this.state.cars.map((item,index)=>{
            return(<section className="type-item" key={index} >
                <ul>
                    <li>
                        <p><em>{item.cartype}</em>&ensp;{item.cardescription}</p>
                        <p><img src={jsj_static_path+"/img/people.png"}/> &le;{item.passengernumber}人&ensp;
                            <img src={jsj_static_path+"/img/trunk.png"}/> &le;{item.luggagenumber}件</p>
                    </li>
                    <li>
                        <p><img src={this.carImgList[+item.id-1]}/></p>
                        <p>一口价<em>{item.totalfee}</em>元
                            <button onClick={this.handleClickSelect} id={index}>选择</button></p>
                    </li>
                </ul>
            </section>);
        });
        return(
            <div className="car-type-list">
                <p><img src={jsj_static_path+"/img/auction.png"} />
                    <span>&ensp;一口价:&ensp;</span>起点到终点的所有费用(包括高速费，停车费等)</p>
                {list}
            </div>
        );
    },
    componentWillUnmount(){
        let dom=document.getElementById("dialog");
        dom.style.display="none";
    }
});
