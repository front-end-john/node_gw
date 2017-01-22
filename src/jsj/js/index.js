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
global.jsj_static_path="/mobile/jsj";
global.jsj_api_path="/jsj";
import JsjQuery from "./components/jsj_query";
import QueryFlight from "./components/query_flight";
import FlightList from './components/flight_list';
import Destination from './components/destination';
import SelectCarType from './components/select_car_type';

let App=React.createClass({
    componentWillMount(){
        document.body.addEventListener("touchstart",()=>{});
        console.log();
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
    <IndexRoute  component={JsjQuery} />
    <Route path="jsj_query" component={JsjQuery}/>
    <Route path="query_flight" component={QueryFlight}/>
    <Route path="flight_list" component={FlightList}/>
    <Route path="destination" component={Destination}/>
    <Route path="select_car_type" component={SelectCarType}/>
</Route>);

ReactDOM.render( <Router history={hashHistory}  routes={routes} />, document.getElementById("appContainer"));

