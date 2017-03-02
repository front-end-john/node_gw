import React from 'react';
import ReactDOM from 'react-dom';
import AssignDriver from "../dialog/assign_driver";
import {optState} from '../../util';
let SendCar=React.createClass({
    getInitialState(){
        return{status:0};
    },
    componentWillMount(){
        if(this.props.data){ this.setState({status:1});}
    },
    assignDriver(){
        let mask=document.getElementById("dialogContainer");
        let {driverName}=this.props.data||{driverName:null};
        ReactDOM.render(<AssignDriver order_id={this.props.order_id} type="returning"
                                      driver_name={driverName} reload={this.props.reload}/>, mask);
    },

    render(){
        let status=this.state.status,html=null;
        let s=this.props.order_status;
        let traceUrl="http://weixin.feibotong.com/trace.html?order_id="+this.props.order_id+"&trace_type=picking";
        if(status==0){
            html=(<p className={optState(7,s)?"pre-send-car":"cancel-take-car"}
                     onClick={()=>this.assignDriver()}>分配送车司机</p>);
        }else{
            let {driverName,assignTime,startTime,finishTime,totalfee,description,paymentmoney}=this.props.data;
            html=(<div className="take-car">
                    <section className="up-part">
                        <p><label>接车司机：</label><span>{driverName}&emsp;</span>
                            <em style={optState(7,s)?{color:"#1A9FE5"}:{color:"#c9c9c9",pointerEvents:"none"}}
                                onClick={()=>this.assignDriver()}>重新分配</em></p>
                        <p><label>分配时间：</label><span>{assignTime}</span></p>
                    </section>
                    <section className="down-part">
                        <p><label>开始时间：</label><span>{startTime}&emsp;</span>
                            <em style={{color:"#1A9FE5"}} onClick={()=>window.open(traceUrl)}>接车轨迹</em></p>
                        <p><label>结束时间：</label><span>{finishTime}</span></p>
                    </section>
                    <div className="service-fee">
                        <p><label>费用总计预估：</label><span>{totalfee}元({description})</span></p>
                        <p><label>优惠金额：</label><span>{paymentmoney}元</span></p>
                        <p><label>支付金额预估：</label><span>{paymentmoney}元</span></p>
                    </div>
                </div>);
        }

        return html;
    }
});

export default SendCar;
