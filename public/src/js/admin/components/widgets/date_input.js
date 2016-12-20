import React from 'react';
let TextInput=React.createClass({
    render(){
        "use strict";
        return(
            <p className="input-item">
                <label>{this.props.title}</label>
                <input type="date" onChange={this.props.change} id={this.props.name} placeholder={this.props.holdText}/>
            </p>
        );
    }
});

export default TextInput;