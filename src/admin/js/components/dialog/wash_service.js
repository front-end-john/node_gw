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
                <h2 className="title">洗车服务<i onClick={this.cancel}/></h2>
                <div className="dialog-important-user">
                    <p><em>洗车服务：</em>
                        <select >
                            <option value="">请选择服务类型</option>
                            <option value="1" >返程若下雨不洗车</option>
                            <option value="2" >返程下雨也需洗车</option>
                        </select><i className="select-arrow"/>
                    </p>
                    <p><em>备&emsp;&emsp;注：</em><textarea placeholder="填写备注"  /></p>
                </div>
                <section className="btn">
                    <button onClick={this.cancel}>取消</button>
                    <button onClick={this.ensure}>确认</button>
                </section>
            </div>
        );
    }
});
