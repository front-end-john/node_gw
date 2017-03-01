import React from "react";

export default React.createClass({
    componentWillMount(){
        let mask=document.getElementById("dialogContainer");
        mask.style.display="block";
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
