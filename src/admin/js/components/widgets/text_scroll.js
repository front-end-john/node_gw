import React from 'react';


let TextScroll=React.createClass({

    render(){
        "use strict";
        return(
            <div className="scroll-text">
                <label>紧急订单:</label>
                <section className="scroll-wrap">
                    <p><span style={{color:'#35BAFF'}}>订单&ensp;(154454654651)&ensp;20分钟后接车;</span>订单&ensp;(154454654651)&ensp;20分钟后接车;</p>
                </section>
            </div>
        );
    }
});

export default TextScroll;