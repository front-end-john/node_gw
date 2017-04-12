import React from "react";
import ReactDOM from 'react-dom';

export default React.createClass({
    getInitialState(){
        return {show:"0"}
    },
    componentDidMount(){
        let dom=document.getElementById("dialog");
        dom.style.height="80px";
        dom.style.bottom="auto";
        dom.style.display="block";
        setTimeout(()=>{
            this.setState({show:"1"});
        },100);
        setTimeout(()=>{
            this.setState({show:"0"});
            setTimeout(()=>{
                ReactDOM.render(<i/>,dom);
                dom.style.display="none";
                dom.style.height="auto";
                dom.style.bottom="0";
            },260)
        },2500);
    },
    render(){
        let show=this.state.show;
        return(
            <section className={+show===1?"pull-down-tip show-tip":"pull-down-tip"}>
               {this.props.msg}
            </section>
        );
    }
});

