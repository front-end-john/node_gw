import React from 'react';
import ReactDOM from 'react-dom';
import AssignDriver from "../dialog/assign_driver";
let SendCar=React.createClass({
    getInitialState(){
        return{status:1};
    },
    componentWillMount(){
        if(this.props.data){
            this.setState({status:1});
        }
    },
    assignDriver(){
        let mask=document.getElementById("dialogContainer");
        ReactDOM.render(<AssignDriver url="/admin/api/orders/remark.js"
                                      updateName={this.updateDriverName} number={this.props.number}/>, mask);
    },
    updateDriverName(name){
        this.setState({driverName:name});
    },
    render(){
        let status=this.state.status,html=null;
        if(status==0){
            html=(<p className="pre-send-car">分配送车司机</p>);
        }else if(status==-1){
            html=(<p className="cancel-take-car">分配送车司机</p>);
        }else{
            let {driverName,assignTime,startTime,finishTime,totalfee,description,paymentmoney}=this.props.data;
            let name=this.state.driverName||driverName;

            html=(<div className="take-car">
                    <section className="up-part">
                        <p><label>接车司机：</label><span>{name}&emsp;</span>
                            <em style={{color:"#1A9FE5"}} onClick={this.assignDriver}>重新分配</em></p>
                        <p><label>分配时间：</label><span>{assignTime}</span></p>
                    </section>
                    <section className="down-part">
                        <p><label>开始时间：</label><span>{startTime}&emsp;</span>
                            <em style={{color:"#1A9FE5"}}>接车轨迹</em></p>
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
