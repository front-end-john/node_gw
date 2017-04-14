import React from 'react';
import ReactDOM from 'react-dom';
import Ensure from '../dialog/ensure';
import OrderDetail from './order_detail';
import JSJOrderDetail from './jsj_order_detail';
import Empty from './empty';
import AssignDriver from "../dialog/assign_driver";
import FlightStatus from "../dialog/show_flight_status";
import Reply from "../dialog/customer_service_reply";
import PredictTime from "../dialog/predict_getcar_time";
import EditBook from "../dialog/modify_bookingtime";
import EditFlightInfo from "../dialog/operate_flight_info";
import ServiceEnsure from "../dialog/more_service_ensure";
import TakeAfterDetail from "./take_after_detail";
import {optState} from '../../util';
export default React.createClass({
    getInitialState(){return {};},
    handleHideAndShow(id,show){
        let mask=document.getElementById("dialogContainer");
        let title="",content="";
        this.setState({show:show});
        if(show===0){
            title="展现评论及回复";
            content="确定要展现评论及回复吗？";
        }else {
            title="关闭评论及回复";
            content="确定要关闭评论及回复吗？";
        }
        ReactDOM.render(<Ensure url="/admin/api/orders/switchcommentshow"
                                title={title} content={content}
                                change={this.switchHide}
                                public_show={show===0?1:0}
                                order_id={id}/>, mask);
    },
    handleReply(id,show){
        let mask=document.getElementById("dialogContainer");
        ReactDOM.render(<Reply url="/admin/api/orders/responsecomment"
                               cancel={this.cancelReply}
                               public_show={show}
                               order_id={id} />, mask);

    },
    cancelReply(){
        this.setState({isReply:true});
    },
    switchHide(){
        let is=this.state.show;
        let show=is===0?1:0;
        this.setState({show});
    },
    handleTelEnsure(oid){
        let mask=document.getElementById("dialogContainer");
        mask.style.display="block";
        ReactDOM.render(<Ensure title="电话确认" serialnumber={oid} url="/admin/api/orders/confirmed"
                                reload={this.props.updateList} content="亲！是否已电话和客户确认过订单信息？"/>, mask);
    },
    handleAssignDriver(type,aid,oid,did){
        let mask=document.getElementById("dialogContainer");
        mask.style.display="block";
        ReactDOM.render(<AssignDriver reload={this.props.updateList} type={type}
                                      airport_id={aid}
                                      order_id={oid} driver_id={did} />, mask);
    },
    showMoreTags(tags){
        let mask=document.getElementById("dialogContainer");
        mask.style.display="block";
        ReactDOM.render(<Ensure title="更多标签" ensureContent={tags.join(" ")}/>, mask);
    },
    showFlightStatus(date,number){
        let mask=document.getElementById("dialogContainer");
        mask.style.display="block";
        ReactDOM.render(<FlightStatus  date={date} number={number}/>, mask);
    },
    expandDetail(orderNo){
        let sumWidth=this.props.widths.reduce((x,y)=>x+y);
        if(this.state.isExpand){
            ReactDOM.render(<Empty />,this.detailArea);
        }else {
            if(this.props.section==="jsj"){
                ReactDOM.render(<JSJOrderDetail width={sumWidth} type={this.props.type} number={orderNo}/>,this.detailArea);
            }else if(this.props.section==="take_after"){
                ReactDOM.render(<TakeAfterDetail width={sumWidth} number={orderNo} />,this.detailArea);
            }else {
                ReactDOM.render(<OrderDetail width={sumWidth} number={orderNo}/>,this.detailArea);
            }
        }
        this.setState({isExpand:!this.state.isExpand});
    },
    componentWillReceiveProps(nextProps){
        let t1=this.props.type,t2=nextProps.type;
        if(t1 && t2 && t1!==t2){
            ReactDOM.render(<Empty />,this.detailArea);
            this.setState({isExpand:false});
        }
        if(this.props.data[0].order_no !== nextProps.data[0].order_no){
            ReactDOM.render(<Empty />,this.detailArea);
            this.setState({isExpand:false});
        }
    },
    editPredictGetCarTime(type,time){
        let mask=document.getElementById("dialogContainer");
        ReactDOM.render(<PredictTime  type={type} url="/admin/api/orders/set_flight_landing_time"
                                      number={this.serialnumber} time={time}
                                      updateTime={this.updateFetchTime}  />, mask);
    },
    editBookingTime(id,time){
        let mask=document.getElementById("dialogContainer");
        ReactDOM.render(<EditBook oid={id} bookingtime={time}
                                  updateTime={this.updateBookTime} />, mask);
    },
    editFlightInfo(type,fno,fdate){
        let mask=document.getElementById("dialogContainer");
        ReactDOM.render(<EditFlightInfo  type={type} url="/admin/api/orders/edit_returning_info"
                                         number={this.serialnumber} fno={fno} fdate={fdate}
                                         updateFlight={this.updateReturnFlight}  />, mask);
    },
    ensureExtraService(type,name,tel,sid,intro){
        let mask=document.getElementById("dialogContainer");
        ReactDOM.render(<ServiceEnsure  type={type} reload={this.props.updateList}
                                        data={{name,tel,sid,intro}}/>, mask);
    },
    updateFetchTime(time){
        this.setState({fetchTime:time});
    },
    updateBookTime(time){
        this.setState({bookingTime:time});
    },
    updateReturnFlight(flight,time){
        this.setState({returnFlight:flight,returnTime:time});
    },
    render(){
        let widths=this.props.widths;
        let list=this.props.data.map((item,index) =>{

            if(item.fieldName==='User'){
                this.serialnumber=item.order_no;
                return(
                    <li key={index} style={{width:widths[index]} }>
                        <p style={{color:"#1A9FE5",cursor:"pointer"}}
                           onClick={()=>this.expandDetail(item.order_no)}
                        >{item.username}<br/>{item.phone_no}</p>
                    </li>
                );
            }else if(item.fieldName==='Label'){
                let arr=item.tags||[];
                return(
                    <li key={index} style={{width:widths[index]} }>
                        <p><span>{arr[0]}</span><br/><span>{arr[1]||""}</span></p>
                    </li>
                );
            }else if(item.fieldName==='OrderSource'){
                return(
                    <li key={index} style={{width:widths[index]} } className={item.is_end?"list-end":""}>
                        <p>{item.order_source}</p>
                    </li>
                );
            }else if(item.fieldName==='OrderTime'){
                return(
                    <li key={index} style={{width:widths[index]} }>
                        <p>{item.order_time}</p>
                    </li>
                );
            }else if(item.fieldName==='EvaluateTime'){
                return(
                    <li key={index} style={{width:widths[index]} }>
                        <p>{item.evaluate_time}</p>
                    </li>
                );
            }else if(item.fieldName==='CreateOrderTime'){
                return(
                    <li key={index} style={{width:widths[index]} }>
                        <p>{item.create_order_time}</p>
                    </li>
                );
            }else if(item.fieldName==='MaintainStatus'){
                return(
                    <li key={index} style={{width:widths[index]} }>
                        <p>{item.status}</p>
                    </li>
                );
            }else if(item.fieldName==='DriverRecommend'){
                return(
                    <li key={index} style={{width:widths[index]} }>
                        <p>{item.refer}</p>
                    </li>
                );
            }else if(item.fieldName==='CarMileage'){
                return(
                    <li key={index} style={{width:widths[index]} }>
                        <p>{item.miles}</p>
                    </li>
                );
            }else if(item.fieldName==='EvaluateStarLevel'){
                return(
                    <li key={index} style={{width:widths[index]} }>
                        <p>客服打星:{item.evaluate_star_level}星</p>
                    </li>
                );
            }else if(item.fieldName==='CustomerServiceReply'){
                return(
                    <li key={index} style={{width:widths[index]} }>
                        <p>{item.service_reply}</p>
                    </li>
                );
            }else if(item.fieldName==='ShowStatus'){
                let msg=item.status===1?"都可见":"仅此用户可见";
                return(
                    <li key={index} style={{width:widths[index]} }>
                        <p>{msg}</p>
                    </li>
                );
            }else if(item.fieldName==='Car'){
                return(
                    <li key={index} style={{width:widths[index]} }>
                        <p>{item.car_no}<br/>{item.car_color}{item.car_brand?(<span>&ensp;{item.car_brand}</span>):""}</p>
                    </li>
                );
            }else if(item.fieldName==='StartAddress'){
                let html=item.local?(<p>{item.local}<br/>{item.address}</p>):
                    <p style={{paddingRight:15}}>{item.address}</p>;
                return(
                    <li key={index} style={{width:widths[index]} }>
                        {html}
                    </li>
                );
            }else if(item.fieldName==='EndAddress'){
                return(
                    <li key={index} style={{width:widths[index]} }>
                        <p style={{paddingRight:15}}>{item.address}</p>
                    </li>
                );
            }else if(item.fieldName==='FlightNumber'){
                return(
                    <li key={index} style={{width:widths[index]} }>
                        <p>{item.number}<br/>{item.launch_time}</p>
                    </li>
                );
            }else if(item.fieldName==='BookingTime'){
                return(
                    <li key={index} style={{width:widths[index]} }>
                        <p>{item.booking_time}</p>
                    </li>
                );
            }else if(item.fieldName==='CarType'){
                return(
                    <li key={index} style={{width:widths[index]} }>
                        <p>{item.type}<br/>{item.car_brief}</p>
                    </li>
                );
            }else if(item.fieldName==='OrderStatus'){
                return(
                    <li key={index} style={{width:widths[index]}} className="list-end">
                        <p style={{color:item.color||"inherit",cursor:"default"}}>
                            {item.status}</p>
                    </li>
                );
            }else if(item.fieldName==='Airport'){
                return(
                    <li key={index} style={{width:widths[index],paddingRight:20}}>
                        <p>{item.airport}</p>
                    </li>
                );
            }else if(item.fieldName==='OnwardTerminal'){
                return(
                    <li key={index} style={{width:widths[index],paddingRight:20}}>
                        <p>{item.terminal}</p>
                    </li>
                );
            }else if(item.fieldName==='ReturnTerminal'){
                return(
                    <li key={index} style={{width:widths[index]}}>
                        <p>{item.terminal}</p>
                    </li>
                );
            }else if(item.fieldName==='Session'){
                let time=this.state.bookingTime||item.session;
                return(
                    <li key={index} style={{width:widths[index]}}>
                        <p className={optState(1,item.os)?"enable":"disabled"}
                           onClick={()=>this.editBookingTime(this.serialnumber,time)}>{time}</p>
                    </li>
                );
            }else if(item.fieldName==='OrderFetchTime'){
                return(
                    <li key={index} style={{width:widths[index]}}>
                        <p>{item.order_fetch_time}</p>
                    </li>
                );
            }else if(item.fieldName==='InGarageTime'){
                return(
                    <li key={index} style={{width:widths[index]}}>
                        <p>{item.in_garage_time}</p>
                    </li>
                );
            }else if(item.fieldName==='ParkTimeLong'){
                return(
                    <li key={index} style={{width:widths[index]}}>
                        <p>{item.park_time_long}</p>
                    </li>
                );
            }else if(item.fieldName==='ReturnTicket'){
                let flight=this.state.returnFlight||item.back_flight;
                let time=this.state.returnTime||item.back_time;
                return(
                    <li key={index} style={{width:widths[index]}}>
                        <p className={optState(2,item.os)?"enable":"disabled"}
                           onClick={()=>this.editFlightInfo("mod",flight,time)}>
                            {flight?<span>{flight}<br/></span>:""}{time}</p>
                    </li>
                );
            }else if(item.fieldName==='RemainTakeCarTime'){
                return(
                    <li key={index} style={{width:widths[index]}}>
                        <p>{item.remain_time}</p>
                    </li>
                );
            }else if(item.fieldName==='MoreService'){

                return(
                    <li key={index} style={{width:widths[index]}} className={item.is_end?"list-end":""}>
                        <p><span className={optState(7,item.os)?"enable":"disabled"}
                                 onClick={()=>this.ensureExtraService("wash",item.name,item.phone,item.ids[0],item.wash)}
                            style={{color:item.colors[0]}}>{item.wash}</span><br/>
                            <span style={{color:item.colors[1]}}
                                  className={optState(7,item.os)?"enable":"disabled"}
                                  onClick={()=>this.ensureExtraService("oil",item.name,item.phone,item.ids[1],item.oil)}
                            >{item.oil}</span></p>
                    </li>
                );
            }else if(item.fieldName==='AdvanceTime'){
                return(
                    <li key={index} style={{width:widths[index]}}>
                        <p>{item.order_time}<br/>{item.back_time}</p>
                    </li>
                );
            }else if(item.fieldName==='TakeDriver'){
                let s=item.os,driverName=item.take_driver;
                if(optState(6,s)) {
                    driverName=driverName||"分配接车司机";
                }else {
                    item.color=null;
                }
                return(
                    <li key={index} style={{width:widths[index]}}>
                        <p  className={optState(6,s)?"enable":"disabled"}
                            onClick={()=>this.handleAssignDriver("parking",item.aid,item.oid,item.did)}
                            style={{color:item.color||"inherit"}}>{driverName}</p>
                    </li>
                );
            }else if(item.fieldName==='MoveDriver'){
                return(
                    <li key={index} style={{width:widths[index]}} className="list-end">
                        <p style={{color:item.color||"inherit"}}>{item.move_driver}</p>
                    </li>
                );
            }else if(item.fieldName==='AssignTime'){
                return(
                    <li key={index} style={{width:widths[index]}}>
                        <p>{item.assign_time}</p>
                    </li>
                );
            }else if(item.fieldName==='AirportParkTimeLong'){
                return(
                    <li key={index} style={{width:widths[index]}}>
                        <p>{item.airport_park_time_long}</p>
                    </li>
                );
            }else if(item.fieldName==='TakeCarStatus'){
                return(
                    <li key={index} style={{width:widths[index]}}>
                        <p>{item.take_car_at}<br/>{item.in_garage_at}</p>
                    </li>
                );
            }else if(item.fieldName==='SendDriver'){
                let s=item.os,driverName=item.send_driver;
                if(optState(7,s)) {
                    driverName=driverName||"分配送车司机";
                }else {
                    item.color=null;
                }
                return(
                    <li key={index} style={{width:widths[index]}}>
                        <p  className={optState(7,s)?"enable":"disabled"}
                            onClick={()=>this.handleAssignDriver("returning",item.aid,item.oid,item.did)}
                            style={{color:item.color||"inherit"}}>{driverName}</p>
                    </li>
                );
            }else if(item.fieldName==='SendCarStatus'){
                return(
                    <li key={index} style={{width:widths[index]}} className="list-end">
                        <p>{item.send_car_start}<br/>{item.send_car_end}</p>
                    </li>
                );
            }else if(item.fieldName==='PayStatus'){
                return(
                    <li key={index} style={{width:widths[index]}} >
                        <p  style={{color:item.color}} >{item.pay_status}</p>
                    </li>
                );
            }else if(item.fieldName==='ReturnFlightStatus'){
                let time=this.state.fetchTime||item.fetch_time;
                return(
                    <li key={index} style={{width:widths[index]}}>
                        <p>{item.status?<span onClick={()=>this.showFlightStatus(item.date,item.number)}
                                             style={{color:"red",cursor:"pointer"}}>
                            {item.status}<br/></span>:""}
                            <span className={optState(3,item.os)?"enable":"disabled"}
                                  onClick={()=>this.editPredictGetCarTime("mod",time)}>{time}</span>
                        </p>
                    </li>
                );
            }else if(item.fieldName==='StartTakeTime'){
                return(
                    <li key={index} style={{width:widths[index]}} className="list-end">
                        <p>{item.start_take_time}</p>
                    </li>
                );
            }else if(item.fieldName==='StartSendTime'){
                return(
                    <li key={index} style={{width:widths[index]}} className="list-end">
                        <p>{item.start_send_time}</p>
                    </li>
                );
            }else if(item.fieldName==='StartMoveTime'){
                return(
                    <li key={index} style={{width:widths[index]}} >
                        <p>{item.start_move_time}</p>
                    </li>
                );
            }else if(item.fieldName==='CommentOperation'){
                let isReply=this.state.isReply===undefined?!!item.reply:this.state.isReply;
                let replyClr=isReply?"#323232":"#1AA0E5";
                let event=isReply?"none":"auto";
                let csr=isReply?"default":"pointer";
                let publicShow=this.state.show===undefined?item.show:this.state.show;
                return(
                    <li key={index} style={{width:widths[index]}} className="list-end">
                        <p>
                            <em style={{color:"#1AA0E5",cursor:"pointer"}}
                                onClick={()=>this.handleHideAndShow(item.order_id,publicShow)}>
                                {publicShow===0?"展现":"关闭"}</em>
                            <em style={{color:replyClr,pointerEvents:event,cursor:csr}}
                                onClick={()=>this.handleReply(item.order_id,publicShow)}>&ensp;回复</em>
                        </p>
                    </li>
                );
            }else if(item.fieldName==='TelEnsureOperation'){
                return(
                    <li key={index} style={{width:widths[index]}} className="list-end">
                        <p style={{color:"#DB8800",cursor:"pointer"}}>
                            <em onClick={()=>this.handleTelEnsure(item.oid)}>电话确认</em></p>
                    </li>
                );
            }else if(item.fieldName==='AssignTakeDriverOperation'){
                return(
                    <li key={index} style={{width:widths[index]}} className="list-end">
                        <p style={{color:"#DB8800",cursor:"pointer"}}>
                            <em  onClick={()=>this.handleAssignDriver("parking",item.aid,item.oid,null)}>分配接车司机</em></p>
                    </li>
                );
            }else if(item.fieldName==='AssignSendDriverOperation'){
                return(
                    <li key={index} style={{width:widths[index]}} className="list-end">
                        <p style={{color:"#1A9FE5",cursor:"pointer"}}>
                            <em  onClick={()=>this.handleAssignDriver("returning",item.aid,item.oid,null)}>分配送车司机</em></p>
                    </li>
                );
            }
        });
        return(
            <ul className="table-line" style={{backgroundColor:this.props.background||"#fff"}}>
                {list}
                <li ref={(c)=>this.detailArea=c} />
            </ul>
        );
    }
});

