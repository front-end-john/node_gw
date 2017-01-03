import React from "react";

export default React.createClass({
    handleTap(){
        let dom=document.getElementById("dialog");
        dom.style.display="none";
    },
    render(){
        return(
            <section className="flight-mod-tip" onClick={this.handleTap}>
                <img src="/weixinjsj/img/sigh-tip.png" />
                <p>{this.props.warn}</p>
            </section>
        );
    }
});

