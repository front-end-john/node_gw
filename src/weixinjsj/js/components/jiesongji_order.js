import React from 'react';

export default React.createClass({
    getInitialState(){
        return{
            isFinish:true
        };
    },
    componentWillMount(){
        document.title="接送机订单";
    },
    handleShift(e){
        let id=e.target.id;
        let clazz=e.target.className;
        if(clazz!="current"){
            this.setState({isFinish:!this.state.isFinish});
        }
        if(id=='finished'){
            console.log("finished");
        }else {
            console.log("other");
        }
    },
    render(){
        return(
            <div className="jiesongji-order">
                <hgroup>
                    <h2 id="" onClick={this.handleShift} className={this.state.isFinish?"":"current"}>进行中</h2>
                    <i/>
                    <h2 id="finished" onClick={this.handleShift} className={this.state.isFinish?"current":""} >已完成</h2>
                </hgroup>
                <ul>
                    <li><p>接车</p><p>已取消<i className="arrow"/></p></li>
                    <li><img src="/weixinjsj/img/clock.png"/><em>时间 :</em>2016-12-14  19:54</li>
                    <li><em>起点 :</em>深圳宝安机场T3航站楼</li>
                    <li><em>终点 :</em>宝安区西乡海城路白金公寓</li>
                </ul>
                <ul>
                    <li><p>接车</p><p>已取消<i className="arrow"/></p></li>
                    <li><img src="/weixinjsj/img/clock.png"/><em>时间 :</em>2016-12-14  19:54</li>
                    <li><em>起点 :</em>深圳宝安机场T3航站楼</li>
                    <li><em>终点 :</em>宝安区西乡海城路白金公寓</li>
                </ul>
                <ul>
                    <li><p>接车</p><p>已取消<i className="arrow"/></p></li>
                    <li><img src="/weixinjsj/img/clock.png"/><em>时间 :</em>2016-12-14  19:54</li>
                    <li><em>起点 :</em>深圳宝安机场T3航站楼</li>
                    <li><em>终点 :</em>宝安区西乡海城路白金公寓</li>
                </ul>

            </div>
        );
    }
});
