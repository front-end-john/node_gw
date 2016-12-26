 import React from 'react';

 export default React.createClass({
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
            <div className="dialog">
                <h2 className="title">修改车辆信息<i onClick={this.cancel}/></h2>
                <div className="dialog-modify-car">
                    <p><em>车牌号码：</em><input  defaultValue={this.props.car_no}/></p>
                    <p><em>车辆颜色：</em><input  defaultValue={this.props.car_color}/></p>
                    <p><em>车辆品牌：</em><input  defaultValue={this.props.car_brand}/></p>
                </div>
                <section className="btn">
                    <button onClick={this.cancel}>取消</button>
                    <button onClick={this.ensure}>确认</button>
                </section>
            </div>
        );
    }
});
