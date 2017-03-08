import React from 'react';
import ReactDOM from 'react-dom';
import AssignDriver from "../dialog/assign_driver";
import {optState} from '../../util';
export default React.createClass({
    getInitialState(){
        return{status:0};
    },
    componentWillMount(){
        if(this.props.data){
            this.setState({status:1});
        }
    },
    assignDriver(){
        let {driverName}=this.props.data||{driverName:null};
        let mask=document.getElementById("dialogContainer");
        ReactDOM.render(<AssignDriver order_id={this.props.order_id} type="parking"
                                      driver_name={driverName} aid={this.props.airport_id}
                                      reload={this.props.reload} />, mask);
    },
    render(){
        let status=this.state.status,html=null;
        let s=this.props.order_status;
        let traceUrl="http://weixin.feibotong.com/trace.html?order_id="+this.props.order_id+"&trace_type=parking";
        if(status==0){
            html=(<p className={optState(6,s)?"pre-take-car":"cancel-take-car"}
                     onClick={()=>this.assignDriver()}>分配接车司机</p>);
        }else {
            let {driverName,assignTime,startTime,finishTime}=this.props.data;
            html=(<div className="take-car">
                    <section className="up-part">
                        <p><label>接车司机：</label><span>{driverName}&emsp;</span>
                            <em className={optState(6,s)?"enable":"disabled"}
                                onClick={()=>this.assignDriver()}>重新分配</em></p>
                        <p><label>分配时间：</label><span>{assignTime}</span></p>
                    </section>
                    <section className="down-part">
                        <p><label>开始时间：</label><span>{startTime}&emsp;</span>
                            <em onClick={()=>window.open(traceUrl)}>接车轨迹</em></p>
                        <p><label>结束时间：</label><span>{finishTime}</span></p>
                    </section>
                </div>);
        }
        return html;
    }
});
