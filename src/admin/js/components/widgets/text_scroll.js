import React from 'react';


let TextScroll=React.createClass({
    getInitialState(){
        return {rushOrder:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}
    },
    componentDidMount(){
        let wh=getComputedStyle(this.wrap).width;
        let th=getComputedStyle(this.text).width;
        let start=0;
        this.timer=setInterval(()=>{
            this.text.style.left=-start+"px";
            start+=1;
            if(start>=parseFloat(th)){
                start=0;
            }
        },30);
    },
    render(){
        let list=this.state.rushOrder.map((item,index)=>{
            return (<span key={index} style={{color:'#35BAFF'}}>订单&ensp;(154454654651)&ensp;20分钟后接车;</span>)
        });
        return(
            <div className="scroll-text">
                <label>紧急订单:</label>
                <section ref={(c)=> this.wrap=c}>
                    <p ref={(c)=> this.text=c}>{list}</p>
                </section>
            </div>
        );
    },
    componentWillUnmount(){
        clearInterval(this.timer);
    }
});

export default TextScroll;