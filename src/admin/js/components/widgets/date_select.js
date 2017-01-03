import React from 'react';
import 'react-date-picker/index.css'
import { DateField } from 'react-date-picker'

export default React.createClass({
    getInitialState(){
        "use strict";
        console.log(this.props.holdText);
        return{};
    },

    render(){
        "use strict";
        return(
            <div className="input-item">
                <label>{this.props.title}</label>
                <DateField
                    onChange={this.props.change }
                    defaultValue={this.props.holdText}
                    dateFormat="YYYY-MM-DD HH:mm"
                />
            </div>
        );
    }
});

