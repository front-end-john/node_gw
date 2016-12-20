import React from 'react';
let Evaluation=React.createClass({

    render(){
        "use strict";
        return (<div className="evaluation">
                    <section>
                        <p><label>服务评价:&ensp;</label>
                            <span>&#9733;&ensp;&#9733;&ensp;&#9733;&ensp;&#9733;&ensp;&#9733;</span></p>
                        <p><label>接车评价:&ensp;</label>
                            <span>&#9733;&ensp;&#9733;&ensp;&#9733;&ensp;&#9733;&ensp;&#9733;</span></p>
                        <p><label>送车评价:&ensp;</label>
                            <span>&#9733;&ensp;&#9733;&ensp;&#9733;&ensp;&#9733;&ensp;&#9733;</span></p>
                    </section>
                    <section>
                        <p><label>评价内容:&ensp;</label><em style={{color:"#c9c9c9"}}>回复</em>
                            &ensp;<em style={{color:"#1AA0E5"}}>关闭</em></p>
                        <p>屁啊是你的</p>
                        <p><label>客服回复:</label></p>
                        <p>屁啊是你的</p>
                    </section>

                </div>);
    }
});

export default Evaluation;
