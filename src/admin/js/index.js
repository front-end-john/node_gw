import React from 'react';
import ReactDOM from 'react-dom';
import es6 from "es6-promise";
es6.polyfill();
import 'whatwg-fetch';
import queryStr from 'querystring';
import fetchJsonp from 'fetch-jsonp';
global.queryStr=queryStr;
global.fetchJsonp=fetchJsonp;

import 'react-date-picker/index.css';

import Login from "./login";

ReactDOM.render(<Login />, document.getElementById("appContainer"));