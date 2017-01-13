import React from "react";

export default React.createClass({
    componentDidMount(){
        let dom = document.getElementById("dialog");
        dom.style.height = "auto";
        dom.style.bottom = "0";
        dom.style.display = "block";
    },
    render(){
        return(
            <section className="loading-sec">
                <div className="load-effect">
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                </div>
                <p>加载中···</p>
            </section>
        );
    }
});
