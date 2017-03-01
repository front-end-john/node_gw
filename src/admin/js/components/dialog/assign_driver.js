import React from 'react';
import ReactDOM from 'react-dom';
import WarnTip from '../dialog/warn_tip';
export default React.createClass({
    getInitialState(){
        return {driverId:this.props.driver_id,driverData:[]}
    },
    componentWillMount(){
        let mask=document.getElementById("dialogContainer");
        mask.style.display="block";

        let url="/admin/api/drivers/list_by_airport?airportid="+(this.props.aid||1);
        fetch(url,{credentials: 'include'}).then((res)=>{
            console.log("请求司机列表响应："+res.status);
            if(+res.status < 400){
                return res.text();
            }else {
                throw new Error("服务异常");
            }
        }).then((str)=>{
            let obj=JSON.parse(str);
            //console.log(obj);
            this.setState({driverData:obj.drivers||[]});
        }).catch((e)=>{
            this.showWarnTip("请求异常！");
            console.trace('错误:', e);
        });
    },
    showWarnTip(msg){
        let mask=document.getElementById("dialogContainer");
        if(msg===null){
            ReactDOM.render(<i/>, mask);
            mask.style.display="none";
        }else {
            ReactDOM.render(<WarnTip msg={msg}/>, mask);
        }
    },
    cancel(){
        let mask=document.getElementById("dialogContainer");
        ReactDOM.render(<i/>, mask);
        mask.style.display="none";
    },
    ensure(){
        let driver=this.state.driverData[this.dataIndex]||{};
        //console.log("driver:",driver);

        let order_id=this.props.order_id;
        let assign_type=this.props.type;
        let driver_id=driver.driverid||this.state.driverId;
        let url="/admin/api/orders/assign_parking_driver?";
        url+=queryStr.stringify({order_id,assign_type,driver_id});
        fetch(url,{credentials: 'include'}).then((res)=>{
            console.log("分配司机响应："+res.status);
            if(+res.status < 400){
                return res.text();
            }else {
                throw new Error("服务异常");
            }
        }).then((str)=>{
            try {
                let obj=JSON.parse(str);
                if(obj.code==0){
                    this.props.reload && this.props.reload();
                    let update=this.props.updateName;
                    update && update(driver.name);
                    this.cancel();
                }else {
                    this.showWarnTip(obj.msg);
                }
            }catch(e){
                this.showWarnTip("数据异常");
            }
        }).catch((e)=>{
            this.showWarnTip("请求异常！");
            console.trace('错误:', e);
        });
    },
    render(){
        let did=this.state.driverId;
        //color:"sending" color:"taking"
        let list=this.state.driverData.map((item,index)=>{
            return(<li key={index} className={item.id==did?"selected":""}
                       onClick={()=>{
                           this.setState({driverId:item.id});
                           this.dataIndex=index;
                       }}>
                <p>{item.realname}</p><p className={"taking"}>{item.statusdesc}</p><p>{item.location}</p></li>)
        });
        return(
            <div className="dialog">
                <h2 className="title">分配司机<i onClick={this.cancel}/></h2>
                <div className="dialog-assign-driver" >
                    <ul>{list}</ul>
                </div>
                <section className="btn">
                    <button onClick={this.cancel}>取消</button>
                    <button onClick={this.ensure}>确认</button>
                </section>
            </div>
        );
    }
});

