import React from 'react';

import Star from '../widgets/star'

export default React.createClass({

    getInitialState(){
        return{starCount:5};
    },
    componentWillMount(){
        document.title="评价我们";
        document.getElementById("appContainer").style.backgroundColor="#fff";
        let d = sessionStorage.getItem("TravelDetailInfo");
        d=JSON.parse(d);
        this.setState({driver:d.driverinfo[0].record});
    },
    handleClickStar(e){
        let grade=e.target.id;
        this.refs.starTip.style.marginRight=(5-grade)*50+'px';
        this.setState({starCount:grade});
        if(grade==1){
            this.refs.starTip.innerHTML="糟糕";
        }else if(grade==2){
            this.refs.starTip.innerHTML="差";
            this.refs.starTip.style.marginRight=((5-grade)*50+12)+'px';
        }else if(grade==3){
            this.refs.starTip.innerHTML="一般";
        }else if(grade==4){
            this.refs.starTip.innerHTML="还行";
        }else if(grade==5){
            this.refs.starTip.innerHTML="满意";
        }
    },
    handleCommentCommit(){
        let content=this.refs.comment.value;
        let score=this.state.starCount;
        let serialnumber = sessionStorage.getItem("OrderSerialNumber");
        let url="/jsj/user/comment";
        url+="?"+queryStr.stringify({serialnumber,score,content});
        fetch(url).then(function(res){
            console.log("查询订单详情响应状态：",res.status);
            if(+res.status < 400){
                return res.text();
            }else {
                throw new Error("服务异常");
            }
        }).then((str)=>{
            let obj=JSON.parse(str);
            console.log(obj);
            if(obj.code==0){
                location.href="#/travel_detail?flag=5&score="+score;
            }
        }).catch(function(e) {
            console.warn('错误', e);
        });
    },
    render(){
        return(
            <div className="comments-us">
                <p>您的评价对我们改进服务至关重要</p>
                <ul className="driver-info">
                    <li><img src={this.state.driver.avatar||"/weixinjsj/img/11.png"}/></li>
                    <li>
                        <h2>{this.state.driver.realname}&ensp;{this.state.driver.carno}</h2>
                        <p>{this.state.driver.carbrand}</p>
                    </li>
                    <li><Star starCount={this.state.starCount}
                              starOnUrl="/weixinjsj/img/bigStar-on.png"
                              starOffUrl="/weixinjsj/img/bigStar-off.png"
                              commentStar={this.handleClickStar} /><p ref="starTip"/>
                    </li>
                </ul>
                <textarea placeholder="把您的体验或建议告诉我们吧!(匿名内容，可放心填写)" ref="comment"/>
                <button className="query-btn" onClick={this.handleCommentCommit}>提价评价</button>
            </div>
        );
    }
});
