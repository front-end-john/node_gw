import React from 'react';
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
            html=(<p className="none-msg">暂无支付信息</p>);
        }else {
            let {takeTime,sendTime,parkLong,totalfee,description,money,payTime,type,status,
                timeout,comefrom,offlinemoney,timeouttotalfee}=this.props.data;
            let padTop=25,display="none";
            //console.log("comefrom",comefrom);
            if(comefrom == "携程" || comefrom =="同程"){
                padTop=0; display="block";
            }
            let payState=<span style={{color:"#f00"}}>未支付</span>;
            if(status==10){
                payState=<span style={{color:"#f00"}}>已支付</span>;
            }
            html=(<div className="take-car">
                <section className="up-part">
                    <p><label>接车时间：</label><span>{takeTime}</span></p>
                    <p><label>送车时间：</label><span>{sendTime}</span></p>
                    <p><label>停车时长：</label><span>{parkLong}</span></p>
                </section>
                <section className="down-part" style={{display:display}}>
                    <p><label>超时时长：</label><span>{timeout}</span></p>
                    <p><label>超时费用：</label><span>{timeouttotalfee||0}元</span></p>
                    <p><label>实收费用：</label><span>{offlinemoney}元</span></p>
                    <p><label>收取方式：</label><span>---</span></p>
                </section>
                <section className="service-fee" style={{paddingTop:padTop}}>
                    <p><label>费用总计：</label><span>{totalfee}元({description})</span></p>
                    <p><label>实际支付：</label><span>{money}元</span></p>
                    <p><label>支付方式：</label><span>{type}</span></p>
                    <p><label>支付状态：</label>{payState}</p>
                    <p><label>支付时间：</label><span>{payTime}</span></p>
                </section>
            </div>);
        }
        return html;
    }
});

