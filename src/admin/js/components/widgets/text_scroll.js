import React from 'react';


export default React.createClass({
    getInitialState(){
        return {rushOrder:[]}
    },
    flashRushOrder(){
        let url="/admin/api/orders/check_new";
        fetch(url,{credentials: 'include'}).then((res)=>{
            if(+res.status < 400){
                return res.text();
            }else {
                throw new Error("服务异常");
            }
        }).then((str)=>{
            try{
                let obj=JSON.parse(str);
                if(obj.code==0){
                    this.setState({rushOrder:obj.parkings});
                }else {
                    console.log(obj);
                }
            }catch(e){
                console.error("数据异常：",e);
                console.log("异常数据：",str);
            }
        }).catch((e)=>{
            console.trace('错误:', e);
        });
    },
    componentWillMount(){
        this.flashRushOrder();
        this.flashTimer=setInterval(this.flashRushOrder,60000);
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
        this.scroll.addEventListener("hover",()=>{
            frame && cancelAnimationFrame(frame);
        },false);
        this.scroll.addEventListener("leave",()=>{
            if(tw > ww) scroll();
        },false);
    },
    componentDidMount(){
        setTimeout(this.handleScrollOrder,1000);
    },
    render(){
        let list=this.state.rushOrder.map((item,index)=>{
            let clr=item.indexOf("送车")==-1?'#DB8800':'#35BAFF';
            return (<span key={index} style={{color:clr}}>{item}&emsp;&emsp;</span>);
        });
        return(
            <div className="scroll-text">
                <em/>
                <label>紧急订单:</label>
                <section ref={(c)=> this.wrap=c}>
                    <p ref={(c)=>this.scroll=c}>{list}</p>
                </section>
            </div>
        );
    }
});
