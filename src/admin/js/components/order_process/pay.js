import React from 'react';
export default React.createClass({
    getInitialState(){
        return{ status:0};
    },
    componentWillMount(){
        if(this.props.data){
            this.setState({status:1});
        }
    },
    render(){
        let status=this.state.status,html=null;
        if(status==0){
            html=(<p className="cancel-take-car">暂无支付信息</p>);
        }else {
            let {takeTime,sendTime,parkLong,totalfee,description,paymentmoney,payTime}=this.props.data;
            html=(<div className="take-car">
                <section className="up-part">
                    <p><label>接车时间：</label><span>{takeTime}</span></p>
                    <p><label>送车时间：</label><span>{sendTime}</span></p>
                    <p><label>停车时长：</label><span>{parkLong}</span></p>
                </section>
                <section className="service-fee" style={{paddingTop:25}}>
                    <p><label>费用总计：</label><span>{totalfee}元({description})</span></p>
                    <p><label>优惠金额：</label><span>{paymentmoney}元</span></p>
                    <p><label>优惠金额：</label><span>{paymentmoney}元</span></p>
                    <p><label>支付状态：</label><span style={{color:"#f00"}}>未支付</span></p>
                    <p><label>支付时间：</label><span>{payTime}</span></p>
                </section>
            </div>);
        }
        return html;
    }
});

