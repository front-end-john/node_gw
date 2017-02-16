import React from 'react';
import ReactDOM from 'react-dom';
import Ensure from "../dialog/ensure";
import Reply from "../dialog/customer_service_reply";
let Evaluation=React.createClass({
    getInitialState(){
        return{isHide:false}
    },
    handleHideAndShow(){
        let mask=document.getElementById("dialogContainer");
        let is=this.state.isHide,title="",content="";
        if(is){
            title="展现评论及回复";
            content="确定要展现评论及回复吗？";
        }else {
            title="关闭评论及回复";
            content="确定要关闭评论及回复吗？";
        }
        ReactDOM.render(<Ensure url="/admin/api/orders/remark.js"
                                title={title} content={content}
                                change={this.switchHide}
                                number={this.props.number}/>, mask);
    },
    handleReply(){
        let mask=document.getElementById("dialogContainer");
        ReactDOM.render(<Reply url="/admin/api/orders/remark.js"
                                number={this.props.number}/>, mask);

    },
    switchHide(){
        let is=this.state.isHide;
        this.setState({isHide:!is});
    },
    render(){
        let list=[];
        let stars=[2,3,4],clr="#F9BE00";
        for(let i=0;i<3;i++){
            let listItem=[];
            for(let j=0;j<5;j++){
                if(j<stars[i]){
                    listItem[j]=(<span key={j} style={{color:clr}}>&#9733;&ensp;</span>);
                }else {
                    listItem[j]=(<span key={j}>&#9733;&ensp;</span>);
                }
            }
            list[i]=listItem;
        }
        return (<div className="evaluation">
                    <section>
                        <p><label>服务评价：</label> {list[0]}</p>
                        <p><label>接车评价：</label> {list[1]}</p>
                        <p><label>送车评价：</label> {list[2]}</p>
                    </section>
                    <section>
                        <p><label>评价内容：</label>
                            <em style={{color:"#c9c9c9"}} onClick={this.handleReply}>回复</em>&emsp;
                            <em style={{color:"#1AA0E5"}} onClick={this.handleHideAndShow}>
                                {this.state.isHide?"展现":"关闭"}</em></p>
                        <p>屁啊是你的</p>
                        <p><label>客服回复:</label></p>
                        <p>屁啊是你的</p>
                    </section>
                </div>);
    }
});

export default Evaluation;
