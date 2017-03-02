import React from 'react';
import { DateField } from 'react-date-picker'

export default React.createClass({
    reset(){ this.dateSelect.onFieldChange("");},
    render(){
        return(
            <div className="date-select">
                <label>{this.props.title}</label>
                <DateField onChange={this.props.change } ref={(c)=>this.dateSelect=c}
                           dateFormat="YYYY-MM-DD HH:mm"
                           style={{borderColor:"#ddd",width:"170px",height:"36px"}}
                />
            </div>
        );
    }
});

