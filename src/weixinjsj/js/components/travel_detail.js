import React from 'react';

import Star from '../widgets/star'

export default React.createClass({
    /**
     * 1：行程正安排,2：行程已安排,3：行程服务中，4：行程待评价,5:评价完成,6:行程支付取消
     * @returns {{status: number}}
     */
    getInitialState(){
        return{ status:1 };
    },
    componentWillMount(){
        document.title="行程详情";
        document.getElementById("appContainer").style.backgroundColor="#fff";
        let serialNumber = sessionStorage.getItem("OrderSerialNumber");
        this.setState({serialNumber});
        let cartype=sessionStorage.getItem('selectedCarType');
        this.carType=JSON.parse(cartype);
        let d = sessionStorage.getItem("TravelDetailInfo");
        if(d){
            d=JSON.parse(d);
            this.setState({driver:d.driverinfo[0].record});
        }else {
            this.setState({driver:{}});
        }
        /**
         * 获取上一步的评价星数
         */
        let score=this.props.location.query.score;
        if(score) this.setState({score});
        /**
         *通过设置状态来改变呈现
         */
        let flag=this.props.location.query.flag;
        if(flag) this.setState({status:+flag});
    },
    incre(){let i=0;return () => i++},
    handleCheckDetail(){
        let url="/jsj/jsjorder/detail";
        url+="?serialnumber="+this.state.serialNumber;
        fetch(url).then(function(res){
            console.log("查询订单详情响应状态：",res.status);
            if(+res.status < 400){
                return res.text();
            }else {
                throw new Error("服务异常");
            }
        }).then((str)=>{
            let obj=JSON.parse(str);
            console.log(obj);
            if(obj.code==0){
                sessionStorage.setItem("TravelDetailInfo",JSON.stringify(obj.record));
                location.href="#/check_travel_detail";
            }
        }).catch(function(e) {
            console.warn('错误', e);
        });
    },
    handleOrderCancel(){
        let url="/jsj/jsjorder/cancel";
        url+="?serialnumber="+this.state.serialNumber;
        fetch(url).then(function(res){
            console.log("取消订单响应状态：",res.status);
            if(+res.status < 400){
                return res.text();
            }else {
                throw new Error("服务异常");
            }
        }).then((str)=>{
            let obj=JSON.parse(str);
            console.log(obj);
            if(obj.code==0){
                this.setState({status:6});
            }
        }).catch(function(e) {
            console.warn('错误', e);
        });
    },
    render(){
        let status=+this.state.status;
        let seq=this.incre();
        let list=[];
        let commonPart=[<li key={seq()}>成功支付</li>,<li key={seq()}><em>&yen;</em>{this.carType.totalfee||'0.00'}</li>,
            <li key={seq()} onClick={this.handleCheckDetail}>查看详情<i className="arrow"/></li>];
        if(status==1){
            list[0]=(<li key={seq()}>待服务</li>);
            list[1]=(<li key={seq()}><img src="/weixinjsj/img/sandglass.png"/></li>);
            list[2]=(<li key={seq()}>已经预定成功，等待安排司机</li>);
            list[3]=(<li key={seq()}>客服会尽快帮您确认订单,将以短信通知您</li>);
            list[4]=(<li key={seq()}><a href="javascript:void(0)"
                                        onClick={this.handleOrderCancel}>取消订单</a></li>);
        }else if(status==2){
            list[0]=(<li key={seq()}>待服务</li>);
            list[1]=(<li key={seq()}><img src="/weixinjsj/img/success.png"/></li>);
            list[2]=(<li key={seq()}>司机已就位</li>);
            list[3]=(<li key={seq()}>请同司机确认具体的行程</li>);
            list[4]=(<li key={seq()}><a href="javascript:void(0)">取消订单</a></li>);
        }else if(status==3){
            list[0]=(<li key={seq()}>服务中</li>);
            list[1]=(<li key={seq()}><img src="/weixinjsj/img/hourglass.png"/></li>);
            list[2]=(<li key={seq()}>车辆服务中</li>);
            list[3]=(<li key={seq()}>祝您旅途愉快</li>);
        }else if(status==4){
            list[0]=(<li key={seq()}>已完成</li>);
            list[1]=(<li key={seq()} className="space"/>);
            list[2]=(<li key={seq()} onClick={()=>location.href="#/comments"}>去评价 <i className="arrow"/></li>);
            list[3]=(<li key={seq()}>您的评价对我们至关重要</li>);
        }else if(status==5){
            list[0]=(<li key={seq()}>已完成</li>);
            list[1]=(<li key={seq()}><Star starCount={this.state.score}
                                           starOnUrl="/weixinjsj/img/bigStar-on.png"
                                           starOffUrl="/weixinjsj/img/bigStar-off.png" /></li>);
            list[2]=(<li key={seq()} />);
            list[3]=(<li key={seq()}>服务很好，旅途愉快，下次还会再用服务很好，旅途愉快，下次还会再用</li>);
        }else if(status==6){
            commonPart=[];
            list[0]=(<li key={seq()} className="side-line">已取消</li>);
            list[1]=(<li key={seq()}><img src="/weixinjsj/img/sigh-tip.png" /></li>);
            list[2]=(<li key={seq()}>订单已取消</li>);
            list[3]=(<li key={seq()}>如有退款将原路退回您的支付账户中</li>);
            list[4]=(<li key={seq()}>退款金额:<em>&yen;{this.carType.totalfee}.00 已退款</em></li>);
            list[5]=(<li key={seq()}>取消扣费:&ensp;&yen;0.00
                    <em onClick={()=>location.href="#/cancel_rule"}>取消规则</em><i className="arrow"/></li>);
            list[6]=(<li key={seq()} className="side-line">扣费原因</li>);
        }
        return(
            <div className="travel-detail">
                {
                    this.state.status==1?(<ul className="order-car-info">
                            <li><img src={this.carType.imgUrl}/></li>
                            <li>
                                <p><em>{this.carType.cartype}</em>
                                    <img src="/weixinjsj/img/people.png"/> &le;{this.carType.passengernumber}人
                                    <img src="/weixinjsj/img/trunk.png"/> &le;{this.carType.luggagenumber}件</p>
                                <p>{this.carType.cardescription}</p>
                            </li>
                        </ul>):(<ul className="driver-info">
                            <li><img src={this.state.driver.avatar||"/weixinjsj/img/11.png"}/></li>
                            <li>
                                <h2>{this.state.driver.realname ||"司机名"}&ensp;
                                    {this.state.driver.carno || "车牌号"}</h2>
                                <Star starCount={5}  starOnUrl="/weixinjsj/img/star-on.png"
                                      starOffUrl="/weixinjsj/img/star-off.png" />
                                <p>{this.state.driver.carbrand || "车品牌"}</p>
                            </li>
                            <li><img src="/weixinjsj/img/12.png"/></li>
                        </ul>)
                }
                <ul className={status==6?"pay-cancel":"other-relative"}>
                    {commonPart}
                    {list}
                </ul>
            </div>
        );
    }
});
