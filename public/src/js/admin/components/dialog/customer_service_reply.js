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
    handleRadio(e){
        "use strict";
        console.log(e.target.value);
    },
    render(){
        "use strict";
        return(
            <div className="dialog">
                <h2 className="title">客服回复<i onClick={this.cancel}/></h2>
                <div className="dialog-service-reply">
                    <textarea placeholder="请输入回复内容"/>
                    <p>
                        <span> <input onClick={this.handleRadio} type="radio" value="all" name="visibility" defaultChecked />允许所有用户看到该评论及回复</span>
                        <span> <input onClick={this.handleRadio} type="radio" value="only" name="visibility" />仅此用户可以看到该评论及回复</span>
                    </p>
                </div>
                <section className="btn">
                    <button onClick={this.cancel}>取消</button>
                    <button onClick={this.ensure}>确认</button>
                </section>
            </div>
        );
    }
});
