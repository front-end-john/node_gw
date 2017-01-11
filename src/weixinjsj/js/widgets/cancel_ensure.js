import React from "react";

export default React.createClass({
    componentWillMount(){
        let dom=document.getElementById("dialog");
        dom.style.backgroundColor="rgba(10,10,10,.4)";
    },
    render(){
        return(
            <section className="cancel-ensure">
                <p>确认取消订单吗?</p>
                <p>
                    <em onClick={()=>{
                        let dom=document.getElementById("dialog");
                        dom.style.display="none";
                    }}>取消</em>
                    <em onClick={()=>{
                        let dom=document.getElementById("dialog");
                        dom.style.display="none";
                        this.props.ensure();
                    }}>确认</em>
                </p>
            </section>
        );
    },
    componentWillUnmount(){
        let dom=document.getElementById("dialog");
        dom.style.backgroundColor="auto";
    }
});
