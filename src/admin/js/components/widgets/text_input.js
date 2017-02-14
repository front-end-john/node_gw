import React from 'react';
export default React.createClass({
    handleEnter(key){
        if(key==13) this.props.enter();
    },
    render(){
        return(
            <p className="input-item">
                <label>{this.props.title}</label>
                <input type="text" id={this.props.name} onChange={this.props.change}
                       ref={(c)=>this.textIn=c} placeholder={this.props.holdText}
                onKeyDown={(e)=>this.handleEnter(e.keyCode)}/>
            </p>
        );
    }
});
