import React from "react";
import {decDatetime} from '../util';
export default React.createClass({
    getInitialState(){
        let list=[],ts=new Date().getTime();
        for(let i=0;i<30;i++){
            list[i]=new Date(ts+24*3600*1000*i);
        }
        return{
            currTop:0,
            selectDay: 0,
            selectHour: 0,
            selectMinute:0,
            dateList:list,
            date:new Date(),
            startHour:new Date().getHours(),
            hour:0,
            minute:0,
            dateLen:30,
            hourLen:24,
            minuteLen:60
        };
    },
    handleCancel(){
        let dom=document.getElementById("dialog");
        dom.style.display="none";
    },
    smoothMove(start,end,node){
        let i=0,n=30,amount=n*(n+1)/2;
        let diff=start-end;
        let timer=setInterval(()=>{
            start -= diff*(n-i)/amount;
            node.style.top=start+'px';
            i++;
            if(i>=n){
                node.style.top=end+'px';
                clearInterval(timer);
            }
        },20);
    },
    standoutSelect(end,node){
        let selectItem=Math.abs(end)/100;
        let id=node.id;
        switch(id){
            case "s1":
                this.setState({selectDay: selectItem});
                if(selectItem>0) {
                    this.setState({startHour:0});
                }else {
                    this.setState({startHour:new Date().getHours()});
                }
                /*let hourUl=this.refs.hourUl,minuteUl=this.refs.minuteUl;
                if(hourUl) this.smoothMove(hourUl.style.top.replace("px",''),0,hourUl);
                if(minuteUl) this.smoothMove(minuteUl.style.top.replace("px",''),0,minuteUl);*/
                break;
            case "s2":this.setState({selectHour: selectItem});break;
            case "s3":this.setState({selectMinute: selectItem});break;
        }
    },
    handleTouchStart(e){
        let p=e.touches[0];
        /**
         *记录触点的开始Y坐标和时间戳
         */
        this.startY=p.clientY||p.pageY;
        this.startTime=new Date().getTime();
        this.prevY=this.startY;
        document.addEventListener("touchmove",function (e) {
            e.preventDefault();
        },false);
    },
    handleTouchMove(e){
        /**
         * 随滑动而移动
         */
        let p=e.touches[0];
        let currentY=p.clientY||p.pageY;
        this.state.currTop+=currentY-this.prevY;
        this.prevY=currentY;
    },
    handleTouchEnd(e){
        let node=e.target;
        /**
         * 速度系数和减速度,end为滑动结束的停靠位置
         */
        let factor=10,decel=1,end;
        let p=e.changedTouches[0];
        let endY=p.clientY||p.pageY;
        let endTime=new Date().getTime();
        let speed=factor*(endY-this.startY)/(endTime-this.startTime);
        let downSide=-2900;
        if(node.id=="s1") downSide=-100*(this.state.dateLen-1);
        if(node.id=="s2") downSide=-100*(this.state.hourLen-1);
        if(node.id=="s3") downSide=-100*(this.state.minuteLen-1);
        let timer=setInterval(()=>{
            this.state.currTop+=speed;

            let top=this.state.currTop;
            if(top < 0 && top > downSide){
                node.style.top=top+"px";
            }
            /**
             * 限制滑动可以抵达的上下边界
             */
            if(top>0) top=50;
            if(top<downSide) top=downSide-50;
            if(speed>0){
                speed-=decel;
                if(speed<=0){
                    clearInterval(timer);
                    let topY=Math.floor(Math.abs(top));
                    let mod=topY%100;
                    if(mod<=50){

                        /**
                         * 限定向上移动的上边界
                         */
                        end=mod==topY||top>=0?0:mod-topY;
                        console.log("<= end",end);
                        this.setState({currTop:end});
                        this.smoothMove(top,end,node);
                        this.standoutSelect(end,node);
                    }else {
                        /**
                         * 限定向下移动的上边界
                         */
                        end=mod!=topY&&top<0?mod-topY-100:-100;
                        if(top>=0) end=0;
                        console.log("> end",end);
                        this.setState({currTop:end});
                        this.smoothMove(top,end,node);
                        this.standoutSelect(end,node);
                    }
                }
            }else if(speed<0){
                speed+=decel;
                if(speed>=0){
                    clearInterval(timer);
                    let topY=Math.floor(Math.abs(top));
                    let mod=topY%100;
                    console.log(mod);
                    if(mod<=50){
                        /**
                         * 限定向上移动的下边界
                         */
                        end=mod-topY<downSide?downSide:mod-topY;
                        this.setState({currTop:end});
                        this.smoothMove(top,end,node);
                        this.standoutSelect(end,node);
                    }else{
                        /**
                         * 限定向下移动的下边界
                         */
                        end=mod-topY-100<downSide?downSide:mod-topY-100;
                        this.setState({currTop:end});
                        this.smoothMove(top,end,node);
                        this.standoutSelect(end,node);
                    }
                }
            }
        },20);
    },
    render(){
        let list=[],hList=[],mList=[];
        let d=this.state.selectDay;
        let h=this.state.selectHour;
        let m=this.state.selectMinute;
        let dates=this.state.dateList,len=dates.length;


        let daySec='';
        if(this.props.day!="off"){
            for(let i=0;i<len;i++){
                let dt=dates[i];
                let {year,month,day} =decDatetime(dt.getTime());
                let dateStr=year+"-"+month+"-"+day;
                if(d==i){
                    this.state.date=dt;
                    list[i]=(<li key={i} className="selected">{dateStr}</li>);
                }else if(d == 0 && d+1 == i) {
                    list[i] = (<li key={i} className="around">{dateStr}</li>);
                }else if(d == list.length-1 && d-1 == i) {
                    list[i] = (<li key={i} className="around">{dateStr}</li>);
                }else {
                    if(d+1 == i || d-1 == i){
                        list[i]=(<li key={i} className="around">{dateStr}</li>);
                    }else{
                        list[i]=(<li key={i} >{dateStr}</li>);
                    }
                }
            }
            daySec=(<div onScroll={this.handleScroll} >
                <ul id="s1" onTouchStart={this.handleTouchStart}
                    onTouchMove={this.handleTouchMove} onTouchEnd={this.handleTouchEnd} >
                    <li/><li/>{list}<li/><li/></ul>
            </div>);
        }
        let startH=this.state.startHour;
        this.state.hourLen=24-startH;
        let hourSec='';
        if(this.props.hour!="off") {
            for (let i = startH; i < 24; i++) {
                let j = i - startH;
                if (h == j) {
                    this.state.hour = i;
                    hList[j] = (<li key={j} className="selected">{i < 10 ? "0" + i : i}点</li>);
                } else if (h == 0 && h + 1 == j) {
                    hList[j] = (<li key={j} className="around">{i < 10 ? "0" + i : i}点</li>);
                } else if (h == hList.length - 1 && h - 1 == j) {
                    hList[j] = (<li key={j} className="around">{i < 10 ? "0" + i : i}点</li>);
                } else {
                    if (h + 1 == j || h - 1 == j) {
                        hList[j] = (<li key={j} className="around">{i < 10 ? "0" + i : i}点</li>);
                    } else {
                        hList[j] = (<li key={j}>{i < 10 ? "0" + i : i}点</li>);
                    }
                }
            }
            hourSec = (<div onScroll={this.handleScroll}>
                            <ul id="s2" ref="hourUl" onTouchStart={this.handleTouchStart}
                                       onTouchMove={this.handleTouchMove} onTouchEnd={this.handleTouchEnd}>
                                <li/><li/>{hList}<li/><li/></ul>
                        </div>);
        }
        let minuteSec='';
        if(this.props.minute!="off"){
            for(let i=0;i<60;i++){
                if(m==i){
                    this.state.minute=i;
                    mList[i]=(<li key={i} className="selected">{i<10?"0"+i:i}分</li>);
                }else if(m==0 && m+1 == i){
                    mList[i]=(<li key={i} className="around">{i<10?"0"+i:i}分</li>);
                }else if(m==mList.length-1 && m-1 == i){
                    mList[i]=(<li key={i} className="around">{i<10?"0"+i:i}分</li>);
                }else{
                    if(m+1 == i || m-1 == i){
                        mList[i]=(<li key={i} className="around">{i<10?"0"+i:i}分</li>);
                    }else{
                        mList[i]=(<li key={i}>{i<10?"0"+i:i}分</li>);
                    }
                }
            }
            minuteSec=(<div>
                <ul id="s3" ref="minuteUl" onTouchStart={this.handleTouchStart}
                    onTouchMove={this.handleTouchMove} onTouchEnd={this.handleTouchEnd}>
                    <li/><li/>{mList}<li/><li/></ul>
            </div>);
        }
        return(
            <section className="select-date" >
                <em onClick={this.handleCancel} >取消</em>
                <p>用车时间均为当地时间</p>
                <em onClick={()=>this.props.ensure(this.state.date,this.state.hour,this.state.minute)} >确认</em>
                <div className="datetime-section">
                    {daySec}
                    {hourSec}
                    {minuteSec}
                </div>
            </section>
        );
    }
});

