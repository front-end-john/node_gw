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

        let url="/admin/api/drivers/list?airportid="+(this.props.aid||1);
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
        let update=this.props.updateName;
        update && update(driver.name);

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
                    this.props.reload();
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
        /*this.driverData=[{name:"张三",status:"15分钟后出发接车",color:"urgent",pos:"梧桐岛"},
                        {name:"李四",status:"正在送车",color:"sending",pos:"梧桐岛"},
                        {name:"王五",status:"正在接车",color:"taking",pos:"梧桐岛"},
                        {name:"李阳",status:"空闲",color:"",pos:"梧桐岛"},
                        {name:"小虎",status:"正在接车",color:"taking",pos:"梧桐岛"},
                        {name:"赵六",status:"空闲",color:"",pos:"梧桐岛"},
                        {name:"李四1",status:"正在送车",color:"sending",pos:"梧桐岛"},
                        {name:"王五1",status:"正在接车",color:"taking",pos:"梧桐岛"},
                        {name:"李阳1",status:"空闲",color:"",pos:"梧桐岛"},
                        {name:"小虎1",status:"正在接车",color:"taking",pos:"梧桐岛"},
                        {name:"赵六1",status:"空闲",color:"",pos:"梧桐岛"},
                        {name:"李四2",status:"正在送车",color:"sending",pos:"梧桐岛"},
                        {name:"李阳2",status:"空闲",color:"",pos:"梧桐岛"},
                        {name:"小虎2",status:"正在接车",color:"taking",pos:"梧桐岛"},
                        {name:"赵六2",status:"空闲",color:"",pos:"梧桐岛"},];*/
        let list=this.state.driverData.map((item,index)=>{
            return(<li key={index} className={item.driverid==did?"selected":""}
                       onClick={()=>{
                           this.setState({driverId:item.driverid});
                           this.dataIndex=index;
                       }}>
                <p>{item.realname}</p><p className={"taking"}>{item.onlinestatus}</p><p>{"梧桐岛"}</p></li>)
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

