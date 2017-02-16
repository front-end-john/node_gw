import React from 'react';
import ImgScroll from '../widgets/img_scroll';
let TakeCar=React.createClass({
    getInitialState(){
        return{
            status:0
        };
    },
    render(){
        let imgData=["/admin/img/carimg.png","/admin/img/carimg.png","/admin/img/carimg.png"];
        return (<div className="move-car">
                    <ImgScroll imgs={imgData} />
                    <section className="move-car-msg">
                        <p><label>挪车司机：</label><span>一只熊</span></p>
                        <p><label>开始时间：</label><span>2016-11-25 18:54</span></p>
                        <p><label>结束时间：</label><span>2016-11-25 18:54</span></p>
                        <p><label>备注：</label><span>停放在某某地方</span></p>
                    </section>
                </div>);
    }
});

export default TakeCar;
