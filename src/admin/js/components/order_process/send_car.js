import React from 'react';
import ReactDOM from 'react-dom';
import AssignDriver from "../dialog/assign_driver";
let SendCar=React.createClass({
    getInitialState(){
        return{status:1,driverName:"王五"};
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
        let status=this.state.status,driverName=this.state.driverName;
        let html=null;
        if(status==0){
            html=(<p className="pre-send-car">分配送车司机</p>);
        }else if(status==-1){
            html=(<p className="cancel-take-car">分配送车司机</p>);
        }else{
            html=(<div className="take-car">
                    <section className="up-part">
                        <p><label>接车司机：</label><span>{driverName}&emsp;</span>
                            <em style={{color:"#1A9FE5"}} onClick={this.assignDriver}>重新分配</em></p>
                        <p><label>分配时间：</label><span>2016-11-25 18:54</span></p>
                    </section>
                    <section className="down-part">
                        <p><label>开始时间：</label><span>2016-11-25 18:54&emsp;</span>
                            <em style={{color:"#1A9FE5"}}>接车轨迹</em></p>
                        <p><label>结束时间：</label><span>2016-11-25 18:54</span></p>
                    </section>
                    <div className="service-fee" style={{}}>
                        <p><label>费用总计预估：</label><span>189元(停车费59元+洗车费30元+加邮费100元)</span></p>
                        <p><label>优惠金额：</label><span>100元</span></p>
                        <p><label>支付金额预估：</label><span>100元</span></p>
                    </div>
                </div>);
        }

        return html;
    }
});

export default SendCar;
