import React from 'react';

export default React.createClass({

    componentWillMount(){
        document.title="行程详情";
        document.getElementById("appContainer").style.backgroundColor="#fff";
    },
    render(){
        return(
            <div className="travel-detail">
                <ul className="travel-order-detail">
                    <li>成功支付</li>
                    <li>&yen;122.00</li>
                    <li>
                        <p>费用总计</p>
                        <p>&yen;122</p>
                    </li>
                    <li>订单信息</li>
                    <li>接机</li>
                    <li>
                        <p>航班号</p>
                        <p>MU4587</p>
                    </li>
                    <li>
                        <p>用车时间</p>
                        <p>2016-12-14 21：50</p>
                    </li>
                    <li>
                        <p>出发机场</p>
                        <p>上海虹桥机场T2航站楼</p>
                    </li>
                    <li>
                        <p>送达地址</p>
                        <p>上海迪士尼乐园</p>
                    </li>
                    <li>
                        <p>行程备注</p>
                        <p>请提前到达指定地点请提前到达指定地点</p>
                    </li>
                    <li>
                        <p>联系人</p>
                        <p>郑阳平 18667656668</p>
                    </li>
                    <li>
                        <p>下单时间</p>
                        <p>2016-12-14 19:55</p>
                    </li>
                </ul>
            </div>
        );
    }
});
