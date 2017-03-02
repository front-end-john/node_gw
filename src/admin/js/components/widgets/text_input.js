import React from 'react';
export default React.createClass({
    handleEnter(key){
        let search=this.props.enter;
        if(key==13) search && search();
    },
    reset(){ this.textIn.value="";},
    render(){
        return(
            <p className="input-item">
                <label style={{paddingLeft:this.props.pdl||20}}>{this.props.title}</label>
                <input type="text" id={this.props.name} onChange={this.props.change}
                       ref={(c)=>this.textIn=c} placeholder={this.props.holdText}
                onKeyDown={(e)=>this.handleEnter(e.keyCode)}/>
            </p>
        );
    }
});
