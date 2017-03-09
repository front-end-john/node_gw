import React from 'react';
import ReactDOM from 'react-dom';
export default React.createClass({
    componentWillMount(){
        let dialogContainer=this.props.dc||"dialogContainer";
        let mask=document.getElementById(dialogContainer);
        mask.style.display="block";
    },
    componentDidMount(){
        let dialogContainer=this.props.dc||"dialogContainer";
        let mask=document.getElementById(dialogContainer);
        setTimeout(()=>{
            ReactDOM.render(<i/>,mask);
            mask.style.display="none";
        },1500);
    },
    render(){
        return(
            <div className="warning-tip">
                <p>{this.props.msg}</p>
            </div>
        );
    }
});

