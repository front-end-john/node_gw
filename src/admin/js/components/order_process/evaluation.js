import React from 'react';
import ReactDOM from 'react-dom';
import Ensure from "../dialog/ensure";
import Reply from "../dialog/customer_service_reply";
export default React.createClass({
    getInitialState(){return{status:0}},
    componentWillMount(){
        if(this.props.data){
            this.setState({status:1});
        }
    },
    handleHideAndShow(show){
        let mask=document.getElementById("dialogContainer");
        let title="",content="";
        this.setState({show:show});
        if(show==0){
            title="展现评论及回复";
            content="确定要展现评论及回复吗？";
        }else {
            title="关闭评论及回复";
            content="确定要关闭评论及回复吗？";
        }

        ReactDOM.render(<Ensure url="/admin/api/orders/switchcommentshow"
                                title={title} content={content}
                                change={this.switchHide}
                                public_show={show==0?1:0}
                                order_id={this.props.order_id}/>, mask);
    },
    handleReply(show){
        let mask=document.getElementById("dialogContainer");
        ReactDOM.render(<Reply url="/admin/api/orders/responsecomment"
                               cancel={this.cancelReply}
                               public_show={show}
                               order_id={this.props.order_id} />, mask);

    },
    cancelReply(){
        this.setState({isReply:true});
    },
    switchHide(){
        let is=this.state.show;
        let show=is==0?1:0;
        this.setState({show});
    },
    render(){
        let status=this.state.status,html=null;
        if(status==0){
            html=(<p className="cancel-take-car">暂无评论信息</p>);
        }else {
            let {serviceSatr,parkingStar,retruningStar,commTime,commContent,showPublic,response}=this.props.data;
            let list=[];
            let stars=[serviceSatr,parkingStar,retruningStar],clr="#F9BE00";
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
            let isReply=this.state.isReply===undefined?!!response:this.state.isReply;
            let replyClr=isReply?"#323232":"#1AA0E5";
            let event=isReply?"none":"auto";

            let publicShow=this.state.show===undefined?showPublic:this.state.show;
            let resp=response||{};
            html=(<div className="evaluation">
                <section>
                    <p><label>服务评价：</label> {list[0]}</p>
                    <p><label>接车评价：</label> {list[1]}</p>
                    <p><label>送车评价：</label> {list[2]}</p>
                </section>
                <section>
                    <p><label>评价内容：</label>
                        <em style={{color:replyClr,pointerEvents:event}}
                            onClick={()=>this.handleReply(publicShow)}>回复</em>&emsp;
                        <em style={{color:"#1AA0E5"}} onClick={()=>this.handleHideAndShow(publicShow)}>
                            {publicShow==0?"展现":"关闭"}</em></p>
                    <p>{commTime}&emsp;{commContent}</p>
                    <p><label>客服回复:</label></p>
                    <p>{resp.createtime}&emsp;{resp.adminname}&emsp;{resp.content}</p>
                </section>
            </div>)
        }
        return html;
    }
});

