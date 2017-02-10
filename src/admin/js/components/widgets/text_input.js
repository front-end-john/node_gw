import React from 'react';
let TextInput=React.createClass({
    render(){
        return(
            <p className="input-item">
                <label>{this.props.title}</label>
                <input type="text" id={this.props.name} onChange={this.props.change}
                       ref={(c)=>this.textIn=c} placeholder={this.props.holdText}/>
            </p>
        );
    }
});

export default TextInput;