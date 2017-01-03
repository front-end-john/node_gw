import React from 'react';
let SendCar=React.createClass({
    getInitialState(){
        "use strict";
        return{
            status:0
        };
    },
    render(){
        "use strict";
        let html=null;
        if(this.state.status==1){
            html=(<div className="take-car"><p className="pre-send-car">分配送车司机</p></div>);
        }else{
            html=(<div className="take-car">
                    <section className="up-part">
                        <p><label>接车司机:&ensp;</label><span>一直想&ensp;</span><em>重新分配</em></p>
                        <p><label>分配时间:&ensp;</label><span>2016-11-25 18:54</span></p>
                    </section>
                    <section className="down-part">
                        <p><label>开始时间:&ensp;</label><span>2016-11-25 18:54&ensp;</span><em>接车轨迹</em></p>
                        <p><label>结束时间:&ensp;</label><span>2016-11-25 18:54</span></p>
                    </section>
                    <div className="service-fee">
                        <p><label>费用总计预估:&ensp;</label><span>189元(停车费59元+洗车费30元+加邮费100元)</span></p>
                        <p><label>优惠金额:&ensp;</label><span>100元</span></p>
                        <p><label>支付金额预估:&ensp;</label><span>100元</span></p>
                    </div>
                </div>);
        }

        return html;
    }
});

export default SendCar;
