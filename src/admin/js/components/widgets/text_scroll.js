import React from 'react';
import {genSeq} from "../../util";
export default React.createClass({
    getInitialState(){
        return {parkings:[],returnings:[]}
    },
    flashRushOrder(){
        let url="/admin/api/orders/check_new";
        fetch(url,{credentials:'include'}).then((res)=>{
            if(+res.status < 400){
                return res.json();
            }else {
                throw new Error("服务异常");
            }
        }).then((obj)=>{
            if(obj.code===0){
                this.setState({parkings:obj.parkings||[],returnings:obj.returnings||[]},()=>{
                    this.handleScrollOrder();
                });
            }else {
                console.log(obj);
            }
        }).catch((e)=>{
            console.trace('错误:', e);
        });
    },
    componentWillMount(){
        this.flashRushOrder();
        this.flashTimer=setInterval(this.flashRushOrder,60060);
    },
    componentWillUnmount(){
        clearInterval(this.flashTimer);
    },
    handleScrollOrder(){
        let ww=parseFloat(getComputedStyle(this.wrap).width);
        let tw=parseFloat(getComputedStyle(this.scroll).width);
        //console.log("ww="+ww,"tw="+tw);
        let start=-ww/2,frame;
        let scroll=()=>{
            start++;
            frame=requestAnimationFrame(scroll);
            this.scroll.style.left=-start+"px";
            if(start>=tw){
                start=-ww/2;
            }
        };
        if(tw > ww) scroll();
        this.scroll.addEventListener("mouseover",()=>{
            frame && cancelAnimationFrame(frame);
        },false);
        this.scroll.addEventListener("mouseleave",()=>{
            if(tw > ww) scroll();
        },false);
    },
    componentDidMount(){
        setTimeout(this.handleScrollOrder,1000);
    },
    render(){
        let seq=genSeq();
        let parkings=this.state.parkings.map((item)=>{
            return (<span key={seq()} style={{color:"#f00"}}>{item}&emsp;&emsp;</span>);
        });
        let returnings=this.state.returnings.map((item)=>{
            return (<span key={seq()} style={{color:'#281AE5'}}>{item}&emsp;&emsp;</span>);
        });
        return(
            <div className="scroll-text">
                <em/>
                <label>紧急订单:</label>
                <section ref={(c)=> this.wrap=c}>
                    <p ref={(c)=>this.scroll=c}>{parkings}{returnings}</p>
                </section>
            </div>
        );
    }
});
