import React from 'react';
import ReactDOM from 'react-dom';
import PulldownTip from '../widgets/pulldown_tip';
import Loading from '../widgets/loading';
import CancelEnsure from '../widgets/cancel_ensure';
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
        /**
         * 显示加载中
         */
        let dom=document.getElementById("dialog");
        ReactDOM.render(<Loading />,dom);
        dom.style.display="block";

        let url="/jsj/user/detail";
        url+="?serialnumber="+this.state.serialNumber;
        fetch(url).then(function(res){
            console.log("查询订单详情响应状态：",res.status);
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
                sessionStorage.setItem("TravelDetailInfo",JSON.stringify(obj.record));
                location.href="#/check_travel_detail";
            }else{
                ReactDOM.render(<PulldownTip msg={obj.message} />,dom);
            }
        }).catch(function(e) {
            ReactDOM.render(<PulldownTip msg="订单查询失败,请稍后再试!" />,dom);
            console.warn('错误', e);
        });
    },
    ensureCancel(){
        /**
         * 显示加载中
         */
        let dom=document.getElementById("dialog");
        ReactDOM.render(<Loading />,dom);
        dom.style.display="block";

        let url="/jsj/user/cancel";
        url+="?serialnumber="+this.state.serialNumber;
        fetch(url).then(function(res){
            console.log("取消订单响应状态：",res.status);
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
                this.setState({status:6});
            }else {
                ReactDOM.render(<PulldownTip msg={obj.message} />,dom);
            }
        }).catch(function(e) {
            ReactDOM.render(<PulldownTip msg="订单取消失败,请稍后重试！" />,dom);
            console.warn('错误', e);
        });
    },
    handleOrderCancel(){
        let dom=document.getElementById("dialog");
        ReactDOM.render(<CancelEnsure ensure={this.ensureCancel}/>,dom);
        dom.style.display="block";
    },
    render(){
        let status=+this.state.status;
        let serialnumber = sessionStorage.getItem("OrderSerialNumber");
        let ct=sessionStorage.getItem('SelectedCarType');
        ct=ct?JSON.parse(ct):{};

        let td = sessionStorage.getItem("TravelDetailInfo");
        td =td?JSON.parse(td):{};
        let driver=td.driverinfo?td.driverinfo[0].record:{};


        let seq=this.incre();
        let list=[];
        let commonPart=[<li key={seq()}>成功支付</li>,<li key={seq()}><em>&yen;</em>
            {ct?parseFloat(ct.totalfee).toFixed(2):'0.00'}</li>,
            <li key={seq()} onClick={this.handleCheckDetail}>查看详情<i className="arrow"/></li>];
        if(status==1){
            list[0]=(<li key={seq()}>待服务</li>);
            list[1]=(<li key={seq()}><img src={jsj_static_path+"/img/sandglass.png"}/></li>);
            list[2]=(<li key={seq()}>已经预定成功，等待安排司机</li>);
            list[3]=(<li key={seq()}>客服会尽快帮您确认订单,将以短信通知您</li>);
            list[4]=(<li key={seq()}>
                <a href="javascript:void(0)" onClick={this.handleOrderCancel}>取消订单</a></li>);
        }else if(status==2){
            list[0]=(<li key={seq()}>待服务</li>);
            list[1]=(<li key={seq()}><img src={jsj_static_path+"/img/success.png"} /></li>);
            list[2]=(<li key={seq()}>司机已就位</li>);
            list[3]=(<li key={seq()}>请同司机确认具体的行程</li>);
            list[4]=(<li key={seq()}><a href="javascript:void(0)">取消订单</a></li>);
        }else if(status==3){
            list[0]=(<li key={seq()}>服务中</li>);
            list[1]=(<li key={seq()}><img src={jsj_static_path+"/img/hourglass.png"} /></li>);
            list[2]=(<li key={seq()}>车辆服务中</li>);
            list[3]=(<li key={seq()}>祝您旅途愉快</li>);
        }else if(status==4){
            list[0]=(<li key={seq()}>已完成</li>);
            list[1]=(<li key={seq()} className="space"/>);
            list[2]=(<li key={seq()} onClick={()=>location.href="#/comments"}>去评价 <i className="arrow"/></li>);
            list[3]=(<li key={seq()}>您的评价对我们至关重要</li>);
        }else if(status==5){
            list[0]=(<li key={seq()}>已完成</li>);
            list[1]=(<li key={seq()}><Star starCount={this.state.score||0}
                                           starOnUrl={jsj_static_path+"/img/bigStar-on.png"}
                                           starOffUrl={jsj_static_path+"/img/bigStar-off.png"} /></li>);
            list[2]=(<li key={seq()} />);
            list[3]=(<li key={seq()}>服务很好，旅途愉快，下次还会再用服务很好，旅途愉快，下次还会再用</li>);
        }else if(status==6){
            commonPart=[];
            list[0]=(<li key={seq()} className="side-line">已取消</li>);
            list[1]=(<li key={seq()}><img src={jsj_static_path+"/img/sigh-tip.png"} /></li>);
            list[2]=(<li key={seq()}>订单已取消</li>);
            list[3]=(<li key={seq()}>如有退款将原路退回您的支付账户中</li>);
            list[4]=(<li key={seq()}>退款金额:<em>&yen;{ct?parseFloat(ct.totalfee).toFixed(2):'0.00'}&emsp;已退款</em></li>);
            list[5]=(<li key={seq()}>取消扣费:&ensp;&yen;0.00
                    <em onClick={()=>location.href="#/cancel_rule"}>取消规则</em><i className="arrow"/></li>);
            list[6]=(<li key={seq()} className="side-line">扣费原因</li>);
        }
        return(
            <div className="travel-detail">
                {status==1?(<ul className="order-car-info">
                            <li><img src={ct.imgUrl}/></li>
                            <li>
                                <p><em>{ct.cartype||""}</em>
                                    <img src={jsj_static_path+"/img/people.png"} /> &le;{ct.passengernumber||0}人
                                    <img src={jsj_static_path+"/img/trunk.png"} /> &le;{ct.luggagenumber||0}件</p>
                                <p>{ct.cardescription||""}</p>
                            </li>
                        </ul>):(<ul className="driver-info">
                            <li><img src={driver.avatar||jsj_static_path+"/img/11.png"}/></li>
                            <li>
                                <h2>{driver.realname ||"司机名"}&ensp;
                                    {driver.carno || "车牌号"}</h2>
                                <Star starCount={5}  starOnUrl={jsj_static_path+"/img/star-on.png"}
                                      starOffUrl={jsj_static_path+"/img/star-off.png"} />
                                <p>{driver.carbrand || "车品牌"}</p>
                            </li>
                            <li><img src={jsj_static_path+"/img/12.png"}/></li>
                        </ul>)
                }
                <ul className={status==6?"pay-cancel":"other-relative"}>
                    {commonPart}
                    {list}
                </ul>
            </div>
        );
    },
    componentWillUnmount(){
        let dom=document.getElementById("dialog");
        dom.style.display="none";
    },
    componentWillUpdate(){
        let dom=document.getElementById("dialog");
        dom.style.display="none";
    }
});