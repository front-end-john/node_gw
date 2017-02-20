import React from 'react';
import { Router,Route,IndexRoute,hashHistory } from 'react-router';

import Aside from "../components/aside";
import OrderQuery from "../components/manager/order_query";
import RemainContactOrder from "../components/manager/remain_contact_order";
import RemainAssignTakeOrder from "../components/manager/remain_assign_take_order";
import RemainAssignSendOrder from "../components/manager/remain_assign_send_order";
import OngoingTakeOrder from "../components/manager/ongoing_take_order";
import AirportTempPark from "../components/manager/airport_temp_park";
import InGarageCar from "../components/manager/in_garage_car";
import OngoingSendOrder from "../components/manager/ongoing_send_order";
import UserManager from "../components/manager/user_manage";
import EvaluationManage from "../components/manager/evaluation_manage";
import CouponManage from "../components/manager/coupon_manage";
import JsjOrder from "../components/manager/jsj_order";
import TextScroll from '../components/widgets/text_scroll';


let App=React.createClass({
    render(){
        return (
            <div className="app"  >
                <Aside />
                <TextScroll />
                {this.props.children}
            </div>
        );
    }
});

let routes = (<Route path="/" component={App} >
    <IndexRoute component={OrderQuery} />
    <Route path="order_query" component={OrderQuery}/>
    <Route path="remain_contact_order" component={RemainContactOrder}/>
    <Route path="remain_assign_take_order" component={RemainAssignTakeOrder}/>
    <Route path="ongoing_take_order" component={OngoingTakeOrder}/>
    <Route path="airport_temp_park" component={AirportTempPark}/>
    <Route path="in_garage_car" component={InGarageCar}/>
    <Route path="remain_assign_send_order" component={RemainAssignSendOrder}/>
    <Route path="ongoing_send_order" component={OngoingSendOrder}/>
    <Route path="user_manager" component={UserManager}/>
    <Route path="evaluation_manage" component={EvaluationManage}/>
    <Route path="coupon_manage" component={CouponManage}/>
    <Route path="jsj_order" component={JsjOrder}/>
</Route>);

let AppRoute= <Router history={hashHistory}  routes={routes}  />;

export default AppRoute;