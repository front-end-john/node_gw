import React from "react";

export default React.createClass({
    render(){
        let len=this.props.starCount,list=[];
        for(let i=0;i<5;i++){
            if(i<len){
                list[i]=(<img key={i} id={i+1} onClick={this.props.commentStar} src={this.props.starOnUrl}/>);
            }else{
                list[i]=(<img key={i} id={i+1} onClick={this.props.commentStar} src={this.props.starOffUrl}/>)
            }
        }
        return(<p>
                {list} <em>{len+".0"}</em>
            </p>
        );
    }
});

