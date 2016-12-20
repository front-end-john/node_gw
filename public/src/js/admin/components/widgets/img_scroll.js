import React from "react"

let ImgScroll=React.createClass({
    getInitialState(){
        "use strict";
        return{
            startX:0,
            currImg:1,
            imgCount:this.props.imgs.length
        };
    },
    handleMouseDown(e){
        "use strict";
        e.stopPropagation();
        e.preventDefault();
        let x=e.pageX||e.clientX;
        this.setState({startX:x});
    },
    handleMouseUp(e){
        "use strict";
        e.stopPropagation();
        e.preventDefault();
        let x=e.pageX||e.clientX;
        let disX=x-this.state.startX;
        if(disX>50 && this.state.currImg > 1){
            let prev=this.state.currImg-1;
            this.refs.imgScroll.className="img-scroll offset_"+prev;
            this.setState({currImg:prev});
        }else if(disX<-50 && this.state.currImg < this.state.imgCount){
            let next=this.state.currImg+1;
            this.refs.imgScroll.className="img-scroll offset_"+next;
            this.setState({currImg:next});
        }
    },
    handleMouseMove(e){
        "use strict";
        e.stopPropagation();
        e.preventDefault();
    },
    render(){
        "use strict";
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
            <div className="scroll-container" onMouseDown={this.handleMouseDown}
                 onMouseMove={this.handleMouseMove} onMouseUp={this.handleMouseUp}>
                <ul className="img-scroll"  ref="imgScroll">
                    {list}
                </ul>
                <p className="dot">{dots}</p>
            </div>
        );
    }
});
export default ImgScroll;