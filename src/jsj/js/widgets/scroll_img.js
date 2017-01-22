import React from "react";

export default React.createClass({
    getInitialState(){
        "use strict";
        return{currImg:1, direction:"left",imgCount:this.props.imgs.length};
    },
    componentDidMount(){
        let curr=this.state.currImg,count=this.state.imgCount,direction=this.state.direction;
        setInterval(()=>{
            if(direction=="left"){
                if(curr<count){
                    curr++
                }else if(curr==count){
                    direction="right";
                    curr--
                }
            }else if(direction=="right"){
                if(curr>1){
                    curr--
                }else if(curr==1){
                    direction="left";
                    curr++
                }
            }
            this.setState({currImg:curr});
        },2000);
    },
    render(){
        let list=this.props.imgs.map(function (item,index) {
            return (
                <li key={index}><img src={item}/></li>
            );
        });
        let dots=this.props.imgs.map((item,index)=>{
            return (
                <em key={index} className={this.state.currImg==(index+1)?"dot_red":""}/>
            );
        });
        return(
            <div className="scroll-container">
                <ul className={"img-scroll offsetX-"+this.state.currImg }  ref="imgScroll">
                    {list}
                </ul>
                <p className="dot">{dots}</p>
            </div>
        );
    }
});

