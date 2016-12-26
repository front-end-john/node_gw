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
                <h2 className="title">{this.props.title}<i onClick={this.cancel}/></h2>
                <div className="dialog-important-user">
                    <p><em>用户手机：</em><input placeholder="请输入手机号" defaultValue={this.props.tel}/></p>
                    <p><em>用户星级：</em>
                        <select defaultValue={this.props.star}>
                            <option value="">请选择</option>
                            <option value="1" >☆</option>
                            <option value="2" >☆☆</option>
                        </select><i className="select-arrow"/>
                    </p>
                    <p><em>备&emsp;&emsp;注：</em><textarea placeholder="填写备注" defaultValue={this.props.remark} /></p>
                </div>
                <section className="btn">
                    <button onClick={this.cancel}>取消</button>
                    <button onClick={this.ensure}>确认</button>
                </section>
            </div>
        );
    }
});
