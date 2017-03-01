 import React from 'react';
 import ReactDOM from 'react-dom';
 import WarnTip from '../dialog/warn_tip';
 export default React.createClass({
     getInitialState(){return {};},
     componentWillMount(){
         let mask=document.getElementById("dialogContainer");
         mask.style.display="block";
     },
     showWarnTip(msg){
         let mask=document.getElementById("dialogContainer");
         ReactDOM.render(<WarnTip msg={msg}/>, mask);
     },
     cancel(){
         let mask=document.getElementById("dialogContainer");
         ReactDOM.render(<i/>, mask);
         mask.style.display="none";
     },
    ensure(){
        let order_id=this.props.order_id;
        let showpublic=this.state.show===undefined?this.props.public_show:this.state.show;
        let content=this.reply.value;
        let url=this.props.url+"?order_id="+order_id+"&showpublic="+showpublic+"&content="+content;
        console.log("回复评论url",url);
        fetch(url,{credentials: 'include'}).then(function(res){
            console.log("客服回复响应状态："+res.status);
            if(+res.status < 400){
                return res.text();
            }else {
                throw new Error("服务异常");
            }
        }).then((str)=>{
            console.log(str);
            try {
                let obj=JSON.parse(str);
                if(obj.code==0){
                    this.props.cancel();
                    this.cancel();
                }else {
                    this.showWarnTip(obj.msg);
                }
            }catch(e){
                this.showWarnTip("数据异常");
            }
        }).catch(function(e) {
            this.showWarnTip("请求异常");
            console.trace('错误:', e);
        });
    },
    handleRadio(e){
        this.setState({show:e.target.value});
    },
    render(){
        let show=this.props.public_show;
        let optList=[];
        if(show==0){
            optList[0]=(<span key={0}><input onClick={this.handleRadio} type="radio" value="1" name="visibility"
                                      />允许所有用户看到该评论及回复</span>);
            optList[1]=(<span key={1}><input onClick={this.handleRadio} type="radio" value="0" name="visibility"
                                     defaultChecked />仅此用户可以看到该评论及回复</span>);
        }else {
            optList[0]=(<span key={0}><input onClick={this.handleRadio} type="radio" value="1" name="visibility"
                                             defaultChecked />允许所有用户看到该评论及回复</span>);
            optList[1]=(<span key={1}><input onClick={this.handleRadio} type="radio" value="0" name="visibility"
                                              />仅此用户可以看到该评论及回复</span>);
        }

        return(
            <div className="dialog">
                <h2 className="title">客服回复<i onClick={this.cancel}/></h2>
                <div className="dialog-service-reply">
                    <textarea placeholder="请输入回复内容" ref={(c)=>this.reply=c}/>
                    <p>
                        {optList}
                    </p>
                </div>
                <section className="btn">
                    <button onClick={this.cancel}>取消</button>
                    <button onClick={this.ensure}>确认</button>
                </section>
            </div>
        );
    }
});
