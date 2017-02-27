import React from 'react';
import ImgScroll from '../widgets/img_scroll';
export default React.createClass({
    getInitialState(){
        return{ status:0 };
    },
    componentWillMount(){
        if(this.props.data){
            this.setState({status:1});
        }
    },
    render(){
        let status=this.state.status,html=null;
        if(status==0){
            html=(<p className="cancel-take-car">暂无挪车信息</p>);
        }else {
            let {driverName,bufferTime,moveTime,moveRemark,pictures}=this.props.data;
            let list=(moveRemark||[]).map((item,index)=>{
                return (<span key={index} style={{lineHeight:"24px"}}><br/>{item.time}&emsp;{item.remark}</span>);
            });

            html=(<div className="move-car">
                <ImgScroll imgs={pictures} />
                <section className="move-car-msg">
                    <p><label>&emsp;&emsp;挪车司机：</label><span>{driverName}</span></p>
                    <p><label>停放开始时间：</label><span>{bufferTime}</span></p>
                    <p><label>挪车开始时间：</label><span>{moveTime}</span></p>
                    <p><label>备注：</label>{list}</p>
                </section>
            </div>);
        }
        return html;
    }
});

