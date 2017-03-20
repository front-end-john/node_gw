import React from 'react';
import ImgScroll from '../widgets/img_scroll';
export default React.createClass({
    getInitialState(){
        return{ status:0};
    },
    componentWillMount(){
        if(this.props.data){
            this.setState({status:1});
        }
    },
    render(){
        let status=this.state.status,html=null;
        if(status==0){
            html=(<p className="none-msg">暂无车辆信息</p>);
        }else {
            let {parkingspot,keyspot,mileage,inTime,pictures}=this.props.data;
            html=(<div className="move-car">
                <ImgScroll imgs={pictures} />
                <section className="in-garage">
                    <p><label>车位：</label><span>{parkingspot}</span></p>
                    <p><label>钥匙位：</label><span>{keyspot}</span></p>
                    <p><label>里程数：</label><span>{mileage}</span></p>
                    <p><label>入库时间：</label><br/><span>{inTime}</span></p>
                </section>
            </div>);
        }
        return html;
    }
});

