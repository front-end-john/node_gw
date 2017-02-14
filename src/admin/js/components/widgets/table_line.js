import React from 'react';
import ReactDOM from 'react-dom';
import Ensure from '../dialog/ensure';
import OrderDetail from './order_detail';
import JSJOrderDetail from './jsj_order_detail';
import Empty from './empty';

let TableLine=React.createClass({
    getInitialState(){
        return{isExpand:false};
    },
    handlePay(){
        let mask=document.getElementById("dialogContainer");
        mask.style.display="block";
        ReactDOM.render(<Ensure title="电话确认" ensureContent="亲！是否已电话和客户确认过订单信息？"/>, mask);
    },
    handleTelEnsure(){
        let mask=document.getElementById("dialogContainer");
        mask.style.display="block";
        ReactDOM.render(<Ensure title="电话确认" ensureContent="亲！是否已电话和客户确认过订单信息？"/>, mask);
    },
    showMoreTags(tags){
        let mask=document.getElementById("dialogContainer");
        mask.style.display="block";
        ReactDOM.render(<Ensure title="更多标签" ensureContent={tags.join(" ")}/>, mask);
    },
    expandDetail(orderNo){
        let sumWidth=this.props.widths.reduce((x,y)=>x+y);
        if(this.state.isExpand){
            ReactDOM.render(<Empty />,this.detailArea);
        }else {
            if(this.props.section=="jsj"){
                ReactDOM.render(<JSJOrderDetail width={sumWidth} type={this.props.type} number={orderNo}/>,this.detailArea);
            }else {
                ReactDOM.render(<OrderDetail width={sumWidth} number={orderNo}/>,this.detailArea);
            }
        }
        this.setState({isExpand:!this.state.isExpand});
    },
    componentWillReceiveProps(nextProps){
        let t1=this.props.type,t2=nextProps.type;
        if(t1 && t2 && t1!=t2){
            ReactDOM.render(<Empty />,this.detailArea);
            this.setState({isExpand:false});
        }
    },
    render(){
        let widths=this.props.widths;
        let list=this.props.data.map((item,index) =>{
            if(item.fieldName=='OrderNo'){
                return(
                    <li key={index} style={{width:widths[index]} }>
                        <p onClick={()=>this.expandDetail(item.order_no)}
                           style={{color:"#1A9FE5"}}>{item.order_no}</p>
                    </li>
                );
            }else if(item.fieldName=='User'){
                let content=(<p>{item.phone_no}</p>);
                if(item.username!="null"&&item.username){
                    content=(<p>{item.username}<br/>{item.phone_no}</p>);
                }
                return(
                    <li key={index} style={{width:widths[index]} }>
                        {content}
                    </li>
                );
            }else if(item.fieldName=='Label'){
                let arr=item.tags||[];
                return(
                    <li key={index} style={{width:widths[index]} }>
                        <p><span>{arr[0]}</span><br/><span>{arr[1]||""}</span>
                            {arr.length>2?(<span style={{color:"#1A9FE5"}}
                                                 onClick={()=>this.showMoreTags(arr)}>&ensp;更多</span>):""}</p>
                    </li>
                );
            }else if(item.fieldName=='OrderSource'){
                return(
                    <li key={index} style={{width:widths[index]} }>
                        <p>{item.order_source}</p>
                    </li>
                );
            }else if(item.fieldName=='OrderTime'){
                return(
                    <li key={index} style={{width:widths[index]} }>
                        <p>{item.order_time}</p>
                    </li>
                );
            }else if(item.fieldName=='EvaluateTime'){
                return(
                    <li key={index} style={{width:widths[index]} }>
                        <p>{item.evaluate_time}</p>
                    </li>
                );
            }else if(item.fieldName=='CreateOrderTime'){
                return(
                    <li key={index} style={{width:widths[index]} }>
                        <p>{item.create_order_time}</p>
                    </li>
                );
            }else if(item.fieldName=='EvaluateStarLevel'){
                return(
                    <li key={index} style={{width:widths[index]} }>
                        <p>客服打星:{item.evaluate_star_level}星</p>
                    </li>
                );
            }else if(item.fieldName=='CustomerServiceReply'){
                return(
                    <li key={index} style={{width:widths[index]} }>
                        <p>{item.service_reply}</p>
                    </li>
                );
            }else if(item.fieldName=='ShowStatus'){
                return(
                    <li key={index} style={{width:widths[index]} }>
                        <p>{item.status}</p>
                    </li>
                );
            }else if(item.fieldName=='Car'){
                return(
                    <li key={index} style={{width:widths[index]} }>
                        <p>{item.car_no}<br/>{item.car_color}{item.car_brand?(<span>&ensp;{item.car_brand}</span>):""}</p>
                    </li>
                );
            }else if(item.fieldName=='StartAddress'){
                let html=item.local?(<p>{item.local}<br/>{item.address}</p>):
                    <p style={{paddingRight:15}}>{item.address}</p>;
                return(
                    <li key={index} style={{width:widths[index]} }>
                        {html}
                    </li>
                );
            }else if(item.fieldName=='EndAddress'){
                return(
                    <li key={index} style={{width:widths[index]} }>
                        <p style={{paddingRight:15}}>{item.address}</p>
                    </li>
                );
            }else if(item.fieldName=='FlightNumber'){
                return(
                    <li key={index} style={{width:widths[index]} }>
                        <p>{item.number}<br/>{item.launch_time}</p>
                    </li>
                );
            }else if(item.fieldName=='BookingTime'){
                return(
                    <li key={index} style={{width:widths[index]} }>
                        <p>{item.booking_time}</p>
                    </li>
                );
            }else if(item.fieldName=='CarType'){
                return(
                    <li key={index} style={{width:widths[index]} }>
                        <p>{item.type}<br/>{item.car_brief}</p>
                    </li>
                );
            }else if(item.fieldName=='OrderStatus'){
                return(
                    <li key={index} style={{width:widths[index]} } className="list-end">
                        <p style={{color:item.color||"inherit"}}>
                            {item.status}</p>
                    </li>
                );
            }else if(item.fieldName=='Airport'){
                return(
                    <li key={index} style={{width:widths[index]} }>
                        <p>{item.airport}</p>
                    </li>
                );
            }else if(item.fieldName=='OnwardTerminal'){
                return(
                    <li key={index} style={{width:widths[index]} }>
                        <p>{item.city}<br/>{item.terminal}</p>
                    </li>
                );
            }else if(item.fieldName=='ReturnTerminal'){
                return(
                    <li key={index} style={{width:widths[index]} }>
                        <p>{item.terminal}</p>
                    </li>
                );
            }else if(item.fieldName=='Session'){
                return(
                    <li key={index} style={{width:widths[index]} }>
                        <p>{item.session}</p>
                    </li>
                );
            }else if(item.fieldName=='OrderFetchTime'){
                return(
                    <li key={index} style={{width:widths[index]} }>
                        <p>{item.order_fetch_time}</p>
                    </li>
                );
            }else if(item.fieldName=='InGarageTime'){
                return(
                    <li key={index} style={{width:widths[index]} }>
                        <p>{item.in_garage_time}</p>
                    </li>
                );
            }else if(item.fieldName=='ParkTimeLong'){
                return(
                    <li key={index} style={{width:widths[index]} }>
                        <p>{item.park_time_long}</p>
                    </li>
                );
            }else if(item.fieldName=='ReturnTicket'){
                return(
                    <li key={index} style={{width:widths[index]} }>
                        <p>{item.back_flight}<br/>{item.back_time}</p>
                    </li>
                );
            }else if(item.fieldName=='RemainTakeCarTime'){
                return(
                    <li key={index} style={{width:widths[index]} }>
                        <p>{item.remain_time}</p>
                    </li>
                );
            }else if(item.fieldName=='MoreService'){
                return(
                    <li key={index} style={{width:widths[index]} }>
                        <p>{item.wash}<br/>{item.oil}</p>
                    </li>
                );
            }else if(item.fieldName=='AdvanceTime'){
                return(
                    <li key={index} style={{width:widths[index]} }>
                        <p>{item.order_time}<br/>{item.back_time}</p>
                    </li>
                );
            }else if(item.fieldName=='TakeDriver'){
                return(
                    <li key={index} style={{width:widths[index]} }>
                        <p style={{color:item.color||"inherit"}}>{item.take_driver}</p>
                    </li>
                );
            }else if(item.fieldName=='MoveDriver'){
                return(
                    <li key={index} style={{width:widths[index]} }>
                        <p style={{color:item.color||"inherit"}}>{item.move_driver}</p>
                    </li>
                );
            }else if(item.fieldName=='AssignTime'){
                return(
                    <li key={index} style={{width:widths[index]} }>
                        <p>{item.assign_time}</p>
                    </li>
                );
            }else if(item.fieldName=='AirportParkTimeLong'){
                return(
                    <li key={index} style={{width:widths[index]} }>
                        <p>{item.airport_park_time_long}</p>
                    </li>
                );
            }else if(item.fieldName=='TakeCarStatus'){
                return(
                    <li key={index} style={{width:widths[index]} }>
                        <p>{item.take_car_at}<br/>{item.in_garage_at}</p>
                    </li>
                );
            }else if(item.fieldName=='SendDriver'){
                return(
                    <li key={index} style={{width:widths[index]} }>
                        <p style={{color:item.color||"inherit"}}>{item.send_driver}</p>
                    </li>
                );
            }else if(item.fieldName=='SendCarStatus'){
                return(
                    <li key={index} style={{width:widths[index]} }>
                        <p>{item.send_car_start}<br/>{item.send_car_end}</p>
                    </li>
                );
            }else if(item.fieldName=='PayStatus'){
                return(
                    <li key={index} style={{width:widths[index]} } className="list-end">
                        <p onClick={this.handlePay} style={{color:item.color}} >{item.pay_status}</p>
                    </li>
                );
            }else if(item.fieldName=='ReturnFlightStatus'){
                let html=null;
                if(item.start_time){
                    html=( <p><span style={{color:"red"}}>{item.status}</span><br/>{item.start_time}</p>);
                }else {
                    html=( <p style={{color:"red"}}>{item.status}</p>);
                }
                return(
                    <li key={index} style={{width:widths[index]} }>
                        {html}
                    </li>
                );
            }else if(item.fieldName=='ReturnFlightLandStatus'){
                let html=null;
                if(item.start_time){
                    html=( <p><span style={{color:"#1A9FE5"}}>{item.status}</span><br/>{item.start_time}</p>);
                }else {
                    html=( <p style={{color:"#1A9FE5"}}>{item.status}</p>);
                }
                return(
                    <li key={index} style={{width:widths[index]} }>
                        {html}
                    </li>
                );
            }else if(item.fieldName=='ReturnFlightLaunchStatus'){
                let html=null;
                if(item.start_time){
                    html=( <p><span style={{color:"red"}}>{item.status}</span><br/>{item.start_time}</p>);
                }else {
                    html=( <p style={{color:"red"}}>{item.status}</p>);
                }
                return(
                    <li key={index} style={{width:widths[index]} } className="list-end">
                        {html}
                    </li>
                );
            }else if(item.fieldName=='StartTakeTime'){
                return(
                    <li key={index} style={{width:widths[index]} } className="list-end">
                        <p>{item.start_take_time}</p>
                    </li>
                );
            }else if(item.fieldName=='StartSendTime'){
                return(
                    <li key={index} style={{width:widths[index]} } className="list-end">
                        <p>{item.start_send_time}</p>
                    </li>
                );
            }else if(item.fieldName=='StartMoveTime'){
                return(
                    <li key={index} style={{width:widths[index]} } className="list-end">
                        <p>{item.start_move_time}</p>
                    </li>
                );
            }else if(item.fieldName=='Operation'){
                let list=item.op_items.map((ele,i)=>{
                    return (
                        <em key={i}>&ensp;{ele}</em>
                    );
                });
                return(
                    <li key={index} style={{width:widths[index]}} className="list-end">
                        <p style={{color:item.color||"inherit"}}>{list}</p>
                    </li>
                );
            }else if(item.fieldName=='TelEnsureOperation'){
                let list=item.op_items.map((ele,i)=>{
                    return (
                        <em key={i} onClick={this.handleTelEnsure}>&ensp;{ele}</em>
                    );
                });
                return(
                    <li key={index} style={{width:widths[index]}} className="list-end">
                        <p style={{color:item.color||"inherit"}}>{list}</p>
                    </li>
                );
            }else if(item.fieldName=='AssignTakeDriverOperation'){
                let list=item.op_items.map((ele,i)=>{
                    return (
                        <em key={i}>&ensp;{ele}</em>
                    );
                });
                return(
                    <li key={index} style={{width:widths[index]}} className="list-end">
                        <p style={{color:item.color||"inherit"}}>{list}</p>
                    </li>
                );
            }
        });
        return(
            <ul className="table-line">
                {list}
                <li ref={(c)=>this.detailArea=c} style={{overflow: "hidden"}}/>
            </ul>
        );
    }
});

export default TableLine;
