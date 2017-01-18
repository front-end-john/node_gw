import React from 'react';
import ReactDOM from 'react-dom';
//import ReactDOM from 'react-dom';
//import Loading from '../widgets/loading';

//import PulldownTip from '../widgets/pulldown_tip';
//import {decDatetime} from '../util';
global.jsj_static_path="/mobile/jsj";
global.jsj_api_path="/jsj";
let Index=React.createClass({
    componentWillMount(){
        console.log();
    },

    componentDidMount(){

    },
    render(){
        return(
            <div className="jsj-index">
                    <section className="head-banner">
                        <img src={jsj_static_path+"/img/Banner.png"} />
                    </section>
                    <section className="middle-state">
                        <p><em />粤B98566 黑色奥迪A8</p>
                        <div>
                            <p>
                                <em>预约成功</em><br/>
                                <span>预约接车时间：2017-01-05  16:23</span>
                            </p>
                            <i className="arrow"/>
                        </div>
                        <p><em />深圳宝安国际机场T3航站楼</p>
                    </section>
                    <section className="service-list">
                        <ul className="start-end">
                            <li><em className="jj" />
                                <h3>接机</h3><p>待分配司机</p><i className="arrow"/></li>
                            <li><label>出发地：</label>北京国际机场T3航站楼</li>
                            <li><label>目的地：</label>五道口</li>
                        </ul>
                        <div className="oil-item">
                            <em />
                            <p><em>加油<span>100元起</span></em><br/>接车前可预约</p>
                            <button>加油</button>
                        </div>
                        <div className="wash-item">
                            <em />
                            <p><em>洗车<span>30元</span></em><br/>送车三小时前洗车</p>
                            <button>洗车</button>
                        </div>
                        <div className="jj-item">
                            <em />
                            <p><em>接机<span>128元起</span></em><br/>
                                <i>飞泊通黄标保障&emsp;</i>报销无忧，航班延误免费等</p>
                            <button>预订</button>
                        </div>
                        <div className="sj-item">
                            <em />
                            <p><em>送机<span>128元起</span></em><br/>
                                <i>飞泊通黄标保障&emsp;</i>报销无忧，航班延误免费等</p>
                            <button disabled>预订</button>
                        </div>
                    </section>
            </div>
        );
    },
    componentWillUnmount(){
        let dom=document.getElementById("dialog");
        dom.style.display="none";
    }
});

ReactDOM.render(<Index /> , document.getElementById("appContainer"));