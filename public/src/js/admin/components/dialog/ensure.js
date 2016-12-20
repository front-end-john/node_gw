import React from 'react';
let Ensure=React.createClass({
    cancel(){
        "use strict";
        let mask=document.getElementById("dialogContainer");
        mask.style.display="none";
    },
    ensure(){
        "use strict";
        let mask=document.getElementById("dialogContainer");
        mask.style.display="none";

    },
    render(){
        "use strict";
        return(
            <div className="dialog-ensure">
                <h2>{this.props.title}<i></i></h2>
                <p>{this.props.ensureContent}</p>
                <section>
                    <button onClick={this.cancel}>取消</button>
                    <button onClick={this.ensure}>确认</button>
                </section>
            </div>
        );
    }
});

export default Ensure;
