import React from "react"

export default React.createClass({
    getInitialState(){
        return {pageIndex:0}
    },
    render(){
        let {page,pageCount,pageSize,paging}=this.props;
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
                        if(item!="···") paging(item,pageSize);}}
                    className={page==item?"curr-page":''}>{item}</em>
            );
        });
        return(
            <p className="paging">
                <em className="start-end" onClick={()=>paging(1,pageSize)}>首页</em>
                {list}
                <em className="start-end" onClick={()=>paging(pageCount,pageSize)}>尾页</em>
                <label>共{pageCount}页</label>
            </p>
        );
    }
});
