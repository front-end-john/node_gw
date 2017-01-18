import React from 'react';
import ReactDOM from 'react-dom';
let Rule=React.createClass({

    componentWillMount(){
        document.title="取消规则";
        document.getElementById("appContainer").style.backgroundColor="#fff";
    },
    render(){
        return(
            <div className="jieji-cancel-rule">
                <h2>接送机（已填写航班号）</h2>
                <ul>
                    <li>取消扣费规则</li>
                    <li>1、司机接单后，乘客在航班实际起飞前均可免费取消，航班起飞后取消需<em>补偿给司机20元取消费</em>；</li>
                    <li>2、若司机迟到，乘客可<em>免费取消</em>；</li>
                </ul>
                <ul>
                    <li>取消补偿规则</li>
                    <li>1、乘客取消支付的取消费，将作为<em>空驶补偿</em>支付给司机；</li>
                </ul>
                <ul>
                    <li>如何判断迟到</li>
                    <li>1、司机迟到：司机接单后，在航班实际落地前未能到达约定上车地点，记为司机迟到。</li>
                    <li>2、乘客迟到：司机接单后，乘客在航班落地后<em>60分</em>钟内未能到达约定上车地点，记为乘客迟到。</li>
                </ul>
            </div>
        );
    }
});
ReactDOM.render(<Rule /> , document.getElementById("appContainer"));