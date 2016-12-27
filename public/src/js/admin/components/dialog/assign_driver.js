import React from 'react';
let Ensure=React.createClass({
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
                <h2 className="title">分配司机<i onClick={this.cancel}/></h2>
                <div className="dialog-assign-driver" >
                    <ul>
                        <li><p>周丹涛</p><p className="urgent">15分钟后出发接车</p><p>梧桐岛</p></li>
                        <li><p>周丹涛</p><p className="sending">正在送车</p><p>梧桐岛</p></li>
                        <li><p>周丹涛</p><p className="taking">正在接车</p><p>梧桐岛</p></li>
                        <li><p>周丹涛</p><p>空闲</p><p>梧桐岛</p></li>
                    </ul>
                </div>
                <section className="btn">
                    <button onClick={this.cancel}>取消</button>
                    <button onClick={this.ensure}>确认</button>
                </section>
            </div>
        );
    }
});

export default Ensure;
