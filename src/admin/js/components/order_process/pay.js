import React from 'react';
export default React.createClass({
    getInitialState(){
        return{};
    },
    render(){
        return (<div className="take-car">
            <section className="up-part">
                <p><label>接车时间：&ensp;</label><span>2016-11-16 18:24</span></p>
                <p><label>送车时间：&ensp;</label><span>2016-11-25 18:54</span></p>
                <p><label>停车时长：&ensp;</label><span>3天15小时</span></p>
            </section>
            <section className="service-fee">
                <p><label>费用总计：&ensp;</label><span>费用总计：189元(停车费59元+洗车费30元+加油费100元)</span></p>
                <p><label>优惠金额：&ensp;</label><span>100元</span></p>
                <p><label>优惠金额：&ensp;</label><span>100元</span></p>
                <p><label>支付状态：&ensp;</label><span style={{color:"#f00"}}>未支付</span></p>
                <p><label>支付时间：&ensp;</label><span>2016-11-16 18:24</span></p>
            </section>
        </div>);
    }
});

