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
                <h2 className="title">发放优惠券<i onClick={this.cancel}/></h2>
                <div className="dialog-important-user">
                    <p><em>用户手机：</em><input placeholder="请输入手机号" /></p>
                    <p><em>用户来源：</em>
                        <select>
                            <option value="">客服</option>
                            <option value="1" >携程</option>
                            <option value="2" >去哪儿</option>
                        </select><i className="select-arrow"/>
                    </p>
                    <p><em>优惠类型：</em>
                        <select>
                            <option value="">按天数</option>
                            <option value="1" >按金额</option>
                            <option value="2" >按折扣</option>
                        </select><i className="select-arrow"/>
                    </p>
                    <p><em>优惠时长：</em><input placeholder="请输入天数" /></p>
                    <p><em>截止时间：</em><input type="date"  /></p>
                    <p><em>备&emsp;&emsp;注：</em><textarea placeholder="填写备注" /></p>
                </div>
                <section className="btn">
                    <button onClick={this.cancel}>取消</button>
                    <button onClick={this.ensure}>确认</button>
                </section>
            </div>
        );
    }
});
