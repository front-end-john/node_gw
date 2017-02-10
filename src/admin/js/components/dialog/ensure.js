import React from 'react';
let Ensure=React.createClass({
    cancel(){
        let mask=document.getElementById("dialogContainer");
        mask.style.display="none";
    },
    ensure(){
        let mask=document.getElementById("dialogContainer");
        mask.style.display="none";

    },
    render(){
        return(
            <div className="dialog">
                <h2 className="title">{this.props.title}<i onClick={this.cancel}/></h2>
                <p className="dialog-ensure">{this.props.ensureContent}</p>
                <section className="btn">
                    <button onClick={this.cancel}>取消</button>
                    <button onClick={this.ensure}>确认</button>
                </section>
            </div>
        );
    }
});

export default Ensure;
