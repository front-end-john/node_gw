import React from 'react';
import ReactDOM from 'react-dom';
let Know=React.createClass({

    componentWillMount(){
        document.title="预订须知";
        document.getElementById("appContainer").style.backgroundColor="#fff";
    },
    render(){
        return(
            <div className="jieji-cancel-rule">
                <h2>接机/送机：预订须知</h2>
                <ul>
                    <li>费用包含：</li>
                    <li>根据您预订的上下车地址，您支付的总价包含<em>一次接机/送机</em>用车服务的全部费用。</li>
                </ul>
                <ul>
                    <li>费用不包含：</li>
                    <li>和用车无直接关联的费用，例如<em>景区门票</em>等。</li>
                </ul>
                <ul>
                    <li>车辆安排：</li>
                    <li>我们将在订单支付成功<em>30分钟内</em>安排车辆和司机。</li>
                </ul>
                <ul>
                    <li>服务标准：</li>
                    <li><strong>1、接机服务：</strong>若您接机提供了航班号，
                        司机将按照航班实际抵达时间提供服务，航班抵达后司机<em>最长免费等候1小时；</em></li>
                    <li><strong>2、送机服务：</strong>司机将会按约定时间<em>免费等待15分钟</em>。
                        超过免费等待时间您仍未到达或无法联系，司机将无法继续等待，订单费用无法退还。</li>
                </ul>
                <ul>
                    <li>用车须知：</li>
                    <li>1、接送机产品是点到点中途不停留的服务，不能临时改变路线。司机会根据路况合理安排行驶路线，不接受中途经停或绕路；
                        如您需要送达多个地址或在多个地址上车，请分开下单。</li>
                    <li>2、婴儿、儿童即使不占用座位也需计入乘车人数。</li>
                    <li>3、各车型的承载人数及行李都有所限制，请您仔细核对，由于您自身选择车型不符而影响您的用车，该损失由您自行承担。</li>
                    <li>4、若您选择的地址因交通因素无法送达，比如送达山脉、森林、岛屿、海上、沙漠、无人区等，会视情况送您到就近的地点。
                        如鼓浪屿，司机会送您至轮渡码头，请您自行乘船前往目的。</li>
                </ul>
                <h2>接机/送机：退订规则</h2>
                <ul>
                    <li>经济型、舒适型、商务型、豪华型：</li>
                    <li>1、用车前0.5小时（含）前取消，按订单金额的100%退款；</li>
                    <li>2、用车前0.5小时内取消，收取订单金额的100%作为违约金。</li>
                </ul>
            </div>
        );
    }
});
ReactDOM.render(<Know /> , document.getElementById("appContainer"));