import React from 'react';
import ImgScroll from '../widgets/img_scroll';
let InGarage=React.createClass({
    getInitialState(){
        "use strict";
        return{
            status:0
        };
    },
    render(){
        "use strict";
        let imgData=["/img/admin/carimg.png","/img/admin/carimg.png","/img/admin/carimg.png"];
        return (<div className="move-car">
                   <ImgScroll imgs={imgData} />
                    <section className="in-garage">
                        <p><label>车位:&ensp;</label><span>233</span></p>
                        <p><label>钥匙位:&ensp;</label><span>A243</span></p>
                        <p><label>里程数:&ensp;</label><span>2345</span></p>
                        <p><label>入库时间:&ensp;</label><span>2016-12-12 17:45</span></p>
                    </section>
                </div>);
    }
});

export default InGarage;
