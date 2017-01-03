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
                <h2 className="title">修改密码<i onClick={this.cancel}/></h2>
                <div className="dialog-modify-password">
                    <p><em>旧密码：</em><input  placeholder="请输入旧密码"/></p>
                    <p><em>新密码：</em><input  placeholder="请输入新密码"/></p>
                    <p><em>重复密码：</em><input  placeholder="请重复新密码"/></p>
                </div>
                <section className="btn">
                    <button onClick={this.cancel}>取消</button>
                    <button onClick={this.ensure}>确认</button>
                </section>
            </div>
        );
    }
});
