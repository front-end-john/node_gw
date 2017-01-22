import React from 'react';
let Ensure=React.createClass({
    componentWillMount(){
        let mask=document.getElementById("dialogContainer");
        mask.style.display="block";
    },
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
                <h2 className="title">异常错误<i onClick={this.cancel}/></h2>
                <p className="dialog-ensure"><a>{this.props.msg}<br/>请联系开发维护人员！</a></p>
                <section className="btn">
                    <button onClick={this.ensure}>确定</button>
                </section>
            </div>
        );
    }
});

export default Ensure;
