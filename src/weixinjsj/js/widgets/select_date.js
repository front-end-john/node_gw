import React from "react";

export default React.createClass({
    getInitialState(){
        let list=[],ts=new Date().getTime();
        for(let i=0;i<30;i++){
            list[i]=new Date(ts+24*3600*1000*i);
        }
        return{
            selectDate: 0,
            selectHour: 0,
            selectMinute:0,
            dateList:list,
            dateObj:{date:new Date(),hour:0,minute:0}
        };
    },
    handleCancel(){
        let dom=document.getElementById("dialog");
        dom.style.display="none";
    },

    handleScroll(e){
        let id=e.target.id;
        let top=e.target.scrollTop;
        let mod=top%80;
        let incre=mod>=40?Math.floor(top/80)+1:Math.floor(top/80);
        if(id=="s1" && incre!=this.state.selectDate){
            this.setState({selectDate: incre}, ()=>{
                this.smoothScroll(top,incre*80,this.sc1);
            });
        }else if(id=="s2" && incre!=this.state.selectHour){
            this.setState({selectHour: incre},()=>{
                this.smoothScroll(top,incre*80,this.sc2);
            });
        }else if(id=="s3" && incre!=this.state.selectMinute){
            this.setState({selectMinute: incre},()=>{
                this.smoothScroll(top,incre*80,this.sc3);
            });
        }
        this.smoothScroll(top,incre*80,e.target);

    },
    allowScroll:true,
    smoothScroll(currPos,destPos,target){
        let i=0,n=20,amount=n*(n+1)/2;
        let diff=destPos-currPos;
        this.allowScroll=false;
        let timer=setInterval(function (){
            target.scrollTop=currPos+diff*(n-i)/amount;
            i++;
            if(i>=n) {
                clearInterval(timer);
                this.allowScroll=true;
            }
        },10);
    },
    render(){
        let list=[],hList=[],mList=[],cur=new Date();
        let d=this.state.selectDate;
        let h=this.state.selectHour;
        let m=this.state.selectMinute;
        let sdt=this.state.dateObj.date;
        let curStr=cur.getFullYear()+"-"+cur.getMonth()+"-"+cur.getDate();
        let sdtStr=sdt.getFullYear()+"-"+sdt.getMonth()+"-"+sdt.getDate();
        let dates=this.state.dateList,len=dates.length;
        let startH=curStr==sdtStr?cur.getHours():0;

        for(let i=0;i<len;i++){
            let dt=dates[i],dateStr=dt.getFullYear()+"年"+(dt.getMonth()+1)+"月"+dt.getDate()+"日";
            if(d==i){
                this.state.dateObj.date=dt;
                list[i]=(<li key={i} className="selected">{dateStr}</li>);
            }else if(d == 0 && d+1 == i) {
                list[i] = (<li key={i} className="around">{dateStr}</li>);
            }else if(d == list.length-1 && d-1 == i) {
                list[i] = (<li key={i} className="around">{dateStr}</li>);
            }else {
                if(d+1 == i || d-1 == i){
                    list[i]=(<li key={i} className="around">{dateStr}</li>);
                }else {
                    list[i]=(<li key={i} >{dateStr}</li>);
                }
            }
        }
        for(let i=startH;i<24;i++){

            let j=i-startH;
            if(h==j){
                this.state.dateObj.hour=i;
                hList[j]=(<li key={j} className="selected">{i<10?"0"+i:i}点</li>);
            }else if(h==0 && h+1==j){
                hList[j]=(<li key={j} className="around">{i<10?"0"+i:i}点</li>);
            }else if(h==hList.length-1 && h-1 == j){
                hList[j]=(<li key={j} className="around">{i<10?"0"+i:i}点</li>);
            }else{
                if(h+1 == j || h-1 == j){
                    hList[j]=(<li key={j} className="around">{i<10?"0"+i:i}点</li>);
                }else{
                    hList[j]=(<li key={j}>{i<10?"0"+i:i}点</li>);
                }
            }
        }
        for(let i=0;i<60;i++){
            if(m==i){
                this.state.dateObj.minute=i;
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
        return(
            <section className="select-date" >
                <em onClick={this.handleCancel} >取消</em>
                <p>用车时间均为当地时间</p>
                <em onClick={this.props.ensure} >确认</em>
                <div className="datetime-section">
                    <div id="s1" ref={(c)=>this.sc1=c} onScroll={this.handleScroll}>
                        <ul>
                            <li/>
                            <li/>
                            {list}
                            <li/>
                            <li/>
                        </ul>
                    </div>
                    <div id="s2" ref={(c)=>this.sc2=c} onScroll={this.handleScroll}>
                        <ul>
                            <li/>
                            <li/>
                            {hList}
                            <li/>
                            <li/>
                        </ul>
                    </div>
                    <div id="s3" ref={(c)=>this.sc3=c } onScroll={this.handleScroll}>
                        <ul>
                            <li/>
                            <li/>
                            {mList}
                            <li/>
                            <li/>
                        </ul>
                    </div>
                </div>
            </section>
        );
    }
});

