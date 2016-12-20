import React from 'react';
let TableHead=React.createClass({
    render(){
        "use strict";

        let list=this.props.data.map(function (item,index) {
            return(
                <li key={index} style={{width:item.width}}>{item.name}</li>
            );
        });
        return(
            <ul className="table-head">
                {list}
            </ul>
        );
    }
});

export default TableHead;
