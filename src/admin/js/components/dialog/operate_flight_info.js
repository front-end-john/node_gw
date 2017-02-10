 import React from 'react';

 export default React.createClass({
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
                <div className="dialog-flight-info">
                    <p><em>返程航班：</em><input placeholder="请输入返程航班" defaultValue={this.props.flight_no}/></p>
                    <p><em>返程时间：</em><input type="date" placeholder="请输入返程时间" defaultValue={this.props.flight_date}/></p>
                </div>
                <section className="btn">
                    <button onClick={this.cancel}>取消</button>
                    <button onClick={this.ensure}>确认</button>
                </section>
            </div>
        );
    }
});
