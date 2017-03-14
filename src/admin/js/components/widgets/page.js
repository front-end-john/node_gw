import React from "react"

export default React.createClass({
    getInitialState(){
        return {currIndex:1}
    },
    handlePage(pgIndex){
        let {pageCount,pageSize,paging}=this.props;
        if(pgIndex>=1 && pgIndex<=pageCount){
            paging(pgIndex,pageSize);
            this.setState({currIndex:pgIndex});
        }
    },
    render(){
        let {page,pageCount}=this.props;
        let pages=[];
        if(pageCount<=6){
            for(let i=0;i<pageCount;i++){
                pages[i]=i+1;
            }
        }else if(page<4 && pageCount>6){
            pages=[1,2,3,4,5,"···",pageCount];
        }else if(page>=4 && pageCount>6 && pageCount-page>3){
            pages=[page-2,page-1,page,page+1,page+2,"···",pageCount];
        }else if(page>=4 && pageCount>6 && pageCount-page<=3){
            pages=[pageCount-6,pageCount-5,pageCount-4,pageCount-3,pageCount-2,pageCount-1,pageCount];
        }
        let list=pages.map((item,index)=> {
            return (
                <em key={index} onClick={()=>{
                        if(item!="···") this.handlePage(item);}}
                    className={page==item?"curr-page":''}>{item}</em>
            );
        });
        let currIndex=this.state.currIndex;
        return(
            <p className="paging">
                <em className="start-end" onClick={()=>this.handlePage(1)}>首页</em>
                <em className="start-end" onClick={()=>this.handlePage(currIndex-1)}>上一页</em>
                {list}
                <em className="start-end" onClick={()=>this.handlePage(currIndex+1)}>下一页</em>
                <em className="start-end" onClick={()=>this.handlePage(pageCount)}>尾页</em>
                <label>共{pageCount}页</label>
            </p>
        );
    }
});
