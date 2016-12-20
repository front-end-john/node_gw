import React from 'react';
import ReactDOM from 'react-dom';
require('es6-promise').polyfill();
import 'whatwg-fetch';

import Login from "./login";

ReactDOM.render(<Login />, document.getElementById("appContainer"));