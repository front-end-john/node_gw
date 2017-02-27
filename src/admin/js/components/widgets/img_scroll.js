import React from "react"

export default React.createClass({
    getInitialState(){
        return{startX:0, currImg:1, imgList:[]};
    },
    componentWillMount(){
       let imgs =this.props.imgs||[];
       if(imgs.map){
           this.setState({imgList:imgs});
       }else {
           this.setState({imgList:[imgs]});
       }
    },
    handleMouseDown(e){
        e.stopPropagation();
        e.preventDefault();
        let x=e.pageX||e.clientX;
        this.setState({startX:x});
    },
    handleMouseUp(e){
        e.stopPropagation();
        e.preventDefault();
        let imgCount=this.state.imgList.length;
        let x=e.pageX||e.clientX;
        let disX=x-this.state.startX;
        if(disX>50 && this.state.currImg > 1){
            let prev=this.state.currImg-1;
            this.wrap.className="img-scroll offset_"+prev;
            this.setState({currImg:prev});
        }else if(disX<-50 && this.state.currImg < imgCount){
            let next=this.state.currImg+1;
            this.wrap.className="img-scroll offset_"+next;
            this.setState({currImg:next});
        }
    },
    handleMouseMove(e){
        e.stopPropagation();
        e.preventDefault();
    },
    render(){
        let arr =this.state.imgList;
        let list=arr.map(function (item,index) {
            return (
                <li key={index}><img src={item}/></li>
            );
        });
        let dots=arr.map((item,index)=>{
            return (
                <em key={index} className={this.state.currImg==(index+1)?"dot_red":""}/>
            );
        });
        return(
            <div className="scroll-container" onMouseDown={this.handleMouseDown}
                 onMouseMove={this.handleMouseMove} onMouseUp={this.handleMouseUp}>
                <ul className="img-scroll"  ref={(c)=>this.wrap=c}>
                    {list}
                </ul>
                <p className="dot">{dots}</p>
            </div>
        );
    }
});