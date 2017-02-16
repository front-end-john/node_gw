import React from 'react';
import ReactDOM from 'react-dom';
import WarnTip from '../dialog/warn_tip';
let Ensure=React.createClass({
    getInitialState(){
        return {selectedDriver:"王五"}
    },
    componentWillMount(){
        let mask=document.getElementById("dialogContainer");
        mask.style.display="block";
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
        let name=this.driverData[this.dataIndex].name;
        let update=this.props.updateName;
        update && update(name);
        this.cancel();
    },
    render(){
        let theDriver=this.state.selectedDriver;
        this.driverData=[{name:"张三",status:"15分钟后出发接车",color:"urgent",pos:"梧桐岛"},
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
                        {name:"赵六2",status:"空闲",color:"",pos:"梧桐岛"},];
        let list=this.driverData.map((item,index)=>{
            return(<li key={index} className={item.name==theDriver?"selected":""}
                       onClick={()=>{
                           this.setState({selectedDriver:item.name});
                           this.dataIndex=index;
                       }}>
                <p>{item.name}</p><p className={item.color}>{item.status}</p><p>{item.pos}</p></li>)
        });
        return(
            <div className="dialog">
                <h2 className="title">分配司机<i onClick={this.cancel}/></h2>
                <div className="dialog-assign-driver" >
                    <ul>
                        {list}
                    </ul>
                </div>
                <section className="btn">
                    <button onClick={this.cancel}>取消</button>
                    <button onClick={this.ensure}>确认</button>
                </section>
            </div>
        );
    }
});

export default Ensure;
