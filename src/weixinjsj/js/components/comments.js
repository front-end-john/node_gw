import React from 'react';

import Star from '../widgets/star'

export default React.createClass({

    getInitialState(){
        return{
            starCount:5
        };
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
    componentWillMount(){
        document.title="评价我们";
        document.getElementById("appContainer").style.backgroundColor="#fff";
    },
    handleCommentCommit(){
        console.log(this.star.state.count);
    },
    render(){
        return(
            <div className="comments-us">
                <p>您的评价对我们改进服务至关重要</p>
                <ul className="driver-info">
                    <li><img src="/weixinjsj/img/11.png"/></li>
                    <li>
                        <h2>一致性&ensp;奥B45487</h2>
                        <p>本田雅阁</p>
                    </li>
                    <li><Star starCount={this.state.starCount} ref={(c)=>this.star=c}
                              starOnUrl="/weixinjsj/img/bigStar-on.png"
                              starOffUrl="/weixinjsj/img/bigStar-off.png"
                              commentStar={this.handleClickStar}
                    />
                        <p ref="starTip"/>
                    </li>
                </ul>
                <textarea placeholder="把您的体验或建议告诉我们吧!(匿名内容，可放心填写)"/>
                <button className="query-btn" onClick={this.handleCommentCommit}>提价评价</button>
            </div>
        );
    }
});
