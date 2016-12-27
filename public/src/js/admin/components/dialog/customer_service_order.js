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
                <h2 className="title">客服下单<i onClick={this.cancel}/></h2>
                <div className="dialog-place-order">
                    <p><em>用户手机：</em><input type="text" placeholder="请输入手机号" /></p>
                    <p><em>用户姓名：</em><input type="text" placeholder="请输入姓名" className="username"/>
                        <select className="user-gender" >
                            <option value="">性别</option>
                            <option value="1" >男</option>
                            <option value="2" >女</option>
                        </select><i className="select-arrow"/>
                    </p>
                    <p>
                        <em>车牌号码：</em><select className="user-gender" >
                        <option value="">车牌号</option>
                        <option value="1" >男</option>
                        <option value="2" >女</option>
                    </select><i className="select-arrow"/>
                        <input type="text" placeholder="颜色（选填）" className="username" style={{marginLeft:"-13px"}}/>
                        <input type="text" placeholder="车型（选填）" className="username"/>
                    </p>
                    <p><em>接车地点：</em>
                        <select style={{marginRight:"10px",width:"120px"}} >
                            <option value="">请选择城市</option>
                            <option value="1" >男</option>
                            <option value="2" >女</option>
                        </select><i className="select-arrow"/>
                        <select style={{marginRight:"10px",width:"190px"}} >
                            <option value="">请选择航站楼</option>
                            <option value="1" >男</option>
                            <option value="2" >女</option>
                        </select><i className="select-arrow"/>
                    </p>
                    <p><em>预约时间：</em><input type="datetime-local" placeholder="请输入预约时间" /></p>
                </div>
                <section className="btn">
                    <button onClick={this.cancel}>取消</button>
                    <button onClick={this.ensure}>确认</button>
                </section>
            </div>
        );
    }
});
