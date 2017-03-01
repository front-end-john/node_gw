import React from 'react';
import ReactDOM from 'react-dom';
import AssignDriver from "../dialog/assign_driver";
export default React.createClass({
    getInitialState(){
        return{status:0};
    },
    componentWillMount(){
        if(this.props.data){
            this.setState({status:1});
        }
    },
    assignDriver(oid){
        let mask=document.getElementById("dialogContainer");
        ReactDOM.render(<AssignDriver url="/admin/api/orders/remark.js" order_id={oid} type="parking"
                                      updateName={this.updateDriverName} number={this.props.number}/>, mask);
    },
    updateDriverName(name){
        this.setState({driverName:name});
    },
    render(){
        let status=this.state.status,html=null;
        if(status==0){
            html=(<p className="pre-take-car">分配接车司机</p>);
        }else if(status==-1){
            html=(<p className="cancel-take-car">分配接车司机</p>);
        }else {
            let {driverName,assignTime,startTime,finishTime,orderId}=this.props.data;
            let name=this.state.driverName||driverName;
            html=(<div className="take-car">
                    <section className="up-part">
                        <p><label>接车司机：</label><span>{name}&emsp;</span><em onClick={()=>this.assignDriver(orderId)}>重新分配</em></p>
                        <p><label>分配时间：</label><span>{assignTime}</span></p>
                    </section>
                    <section className="down-part">
                        <p><label>开始时间：</label><span>{startTime}&emsp;</span><em>接车轨迹</em></p>
                        <p><label>结束时间：</label><span>{finishTime}</span></p>
                    </section>
                </div>);
        }
        return html;
    }
});
