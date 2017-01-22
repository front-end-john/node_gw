import React from 'react';
import ReactDOM from 'react-dom';
//import ReactDOM from 'react-dom';
//import Loading from '../widgets/loading';

//import PulldownTip from '../widgets/pulldown_tip';
//import {decDatetime} from '../util';
global.jsj_static_path="/mobile/jsj";
global.jsj_api_path="/jsj";
let Page=React.createClass({
    getInitialState(){
        return{oilType:2, oilNum:2, oilCash:3};
    },
    componentWillMount(){
        document.body.addEventListener("touchstart",()=>{});

    },
    componentDidMount(){

    },
    shiftItem(type,item){
        switch (type){
            case "t":this.setState({oilType:item});return 0;
            case "n":this.setState({oilNum:item});return 0;
            case "c":this.setState({oilCash:item});return 0;
        }
    },
    render(){
        let {oilType:t,oilNum:n,oilCash:c}=this.state;
        return(
            <div className="more-service">
                <ul>
                    <li><p><em className="oil-type"/>燃油类型</p>
                        <p> <button className={t==1?"selected":""} onClick={()=>this.shiftItem("t",1)}>汽油</button>
                            <button className={t==2?"selected":""} onClick={()=>this.shiftItem("t",2)}>柴油</button>
                        </p>
                    </li>
                    <li><p><em className="oil-num"/>燃油标号</p>
                        <p> <button className={n==1?"selected":""} onClick={()=>this.shiftItem("n",1)}>92#</button>
                            <button className={n==2?"selected":""} onClick={()=>this.shiftItem("n",2)}>95#</button>
                        </p>
                    </li>
                    <li><p><em className="oil-cash"/>加油金额</p>
                        <p> <button className={c==1?"selected":""}  onClick={()=>this.shiftItem("c",1)}>100元</button>
                            <button className={c==2?"selected":""} onClick={()=>this.shiftItem("c",2)}>200元</button>
                            <button className={c==3?"selected":""} onClick={()=>this.shiftItem("c",3)}>300元</button></p>
                    </li>
                </ul>
                <div className="tips">
                    <p>温馨提示：</p>
                    <p>1、加油收取10元服务费；</p>
                    <p>2、加油油费在接车时交给司机（现金支付）。</p>
                </div>
                <h2>补充说明</h2>
                <textarea placeholder="是否有其他要求，例如加油发票的抬头。"/>
                <button className="query-btn">确认</button>
            </div>
        );
    },
    componentWillUnmount(){
        let dom=document.getElementById("dialog");
        dom.style.display="none";
    }
});

ReactDOM.render(<Page /> , document.getElementById("appContainer"));