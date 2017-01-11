import React from 'react';
import ReactDOM from 'react-dom';
import { Router,Route,IndexRoute,hashHistory } from 'react-router';
import es6 from "es6-promise";
es6.polyfill();
import 'whatwg-fetch';
import fetchJsonp from 'fetch-jsonp';
global.fetchJsonp=fetchJsonp;
global.weekday=['星期天','星期一','星期二','星期三','星期四','星期五','星期六'];
import queryStr from 'querystring';
global.queryStr=queryStr;
global.baseUrl=location.protocol+"//"+location.host;

import JiejiQuery from "./components/jieji_query";
import SongjiQuery from "./components/songji_query";
import QueryFlight from "./components/query_flight";
import FlightList from './components/flight_list';
import Destination from './components/destination';
import SelectCarType from './components/select_car_type';
import OrderDetail from './components/order_detail';
import ContactPerson from './components/contact_person';
import TravelDetail from './components/travel_detail';
import Comments from './components/comments';
import CheckTravelDetail from './components/check_travel_detail';
import CancelRule from './components/cancel_rule';
import JsjOrder from './components/jsj_order';

let App=React.createClass({
    componentWillMount(){
        document.body.addEventListener("touchstart",()=>{});
    },
    render(){
        return (
            <div className="app">
                {this.props.children}
                <div id="dialog"></div>
            </div>
        );
    }
});

let routes = (<Route path="/" component={App}>
    <IndexRoute component={JiejiQuery} />
    <Route path="jieji_query" component={JiejiQuery}/>
    <Route path="songji_query" component={SongjiQuery}/>
    <Route path="query_flight" component={QueryFlight}/>
    <Route path="flight_list" component={FlightList}/>
    <Route path="destination" component={Destination}/>
    <Route path="select_car_type" component={SelectCarType}/>
    <Route path="order_detail" component={OrderDetail}/>
    <Route path="contact_person" component={ContactPerson}/>
    <Route path="travel_detail" component={TravelDetail}/>
    <Route path="comments" component={Comments}/>
    <Route path="check_travel_detail" component={CheckTravelDetail}/>
    <Route path="cancel_rule" component={CancelRule}/>
    <Route path="jsj_order" component={JsjOrder}/>
</Route>);

ReactDOM.render( <Router history={hashHistory}  routes={routes} />, document.getElementById("appContainer"));

