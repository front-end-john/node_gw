import React from 'react';
import ReactDOM from 'react-dom';
import WarnTip from '../dialog/warn_tip';
export default React.createClass({
    getInitialState(){
        return {coupons:[]}
    },
    componentWillMount(){
        let mask=document.getElementById("dialogContainer");
        mask.style.display="block";
        let url="/admin/api/coupons/list_by_serialnumber?serialnumber="+this.props.number;
        console.log("分配司机url",url);
        fetch(url,{credentials: 'include'}).then((res)=>{
            console.log("请求司机列表响应："+res.status);
            if(+res.status < 400){
                return res.json();
            }else {
                throw new Error("服务异常");
            }
        }).then((obj)=>{
            console.log(obj);
            this.setState({coupons:obj.coupons||[]});
        }).catch((e)=>{
            this.showWarnTip("请求异常！");
            console.trace('错误:', e);
        });
    },
    showWarnTip(msg){
        let mask=document.getElementById("dialogContainer");
        if(msg===null){
            ReactDOM.render(<i/>, mask);
            mask.style.display="none";
        }else {
            ReactDOM.render(<WarnTip msg={msg}/>, mask);
        }
    },
    cancel(){
        let mask=document.getElementById("dialogContainer");
        ReactDOM.render(<i/>, mask);
        mask.style.display="none";
    },
    render(){
        let list=this.state.coupons.map((item,index)=>{
            let amount=item.money+"元";
            let ctype=parseInt(item.ctype);
            let color="#f00";
            if(ctype===3){
                amount=item.freedays+"天";
                color="#000";
            }else if(ctype===0){
                amount=item.discount+"折";
                color="#00f";
            }
            return(<li key={index} >
                <p>{item.couponid}</p><p style={{color}}>{amount}</p>
                <p>{item.endtime}</p><p>{item.comefrom}</p>
            </li>);
        });
        return(
            <div className="dialog">
                <h2 className="title">优惠券列表<i onClick={this.cancel}/></h2>
                <div className="dialog-show-coupon" >
                    <ul>
                        <li><p>ID</p><p>金额</p><p>到期时间</p><p>来源</p></li>
                        {list}
                    </ul>
                </div>
            </div>
        );
    }
});

