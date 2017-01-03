import React from 'react';
let TakeCar=React.createClass({
    getInitialState(){
        "use strict";
        return{
            status:1
        };
    },
    render(){
        "use strict";
        let html=null;
        if(this.state.status==0){
            html=(<div className="take-car"><p className="pre-take-car">分配接车司机</p></div>);
        }else{
            html=(<div className="take-car">
                    <section className="up-part">
                        <p><label>接车司机:&ensp;</label><span>一直想&ensp;</span><em>重新分配</em></p>
                        <p><label>分配时间:&ensp;</label><span>2016-11-25 18:54</span></p>
                    </section>
                    <section className="down-part">
                        <p><label>开始时间:&ensp;</label><span>2016-11-25 18:54&ensp;</span><em>接车轨迹</em></p>
                        <p><label>结束时间:&ensp;</label><span>2016-11-25 18:54</span></p>
                    </section>

                </div>);
        }

        return html;
    }
});

export default TakeCar;
