import React from 'react';
export default React.createClass({
    getInitialState(){
        return{};
    },
    render(){
        return (<div className="take-car">
            <section className="up-part">
                <p><label>接车时间：</label><span>2016-11-16 18:24</span></p>
                <p><label>送车时间：</label><span>2016-11-25 18:54</span></p>
                <p><label>停车时长：</label><span>3天15小时</span></p>
            </section>
            <section className="service-fee" style={{paddingTop:25}}>
                <p><label>费用总计：</label><span>189元(停车费59元+洗车费30元+加油费100元)</span></p>
                <p><label>优惠金额：</label><span>100元</span></p>
                <p><label>优惠金额：</label><span>100元</span></p>
                <p><label>支付状态：</label><span style={{color:"#f00"}}>未支付</span></p>
                <p><label>支付时间：</label><span>2016-11-16 18:24</span></p>
            </section>
        </div>);
    }
});

