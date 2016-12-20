import React from 'react';


let TableLine=React.createClass({
    getInitialState(){
        "use strict";
        return{

        };
    },

    render(){
        "use strict";
        let widths=this.props.widths;
        let list=this.props.data.map((item,index) =>{
            if(item.fieldName=='PhoneNo') {
                return (
                    <li key={index} style={{width: widths[index]} }>
                        <p>{item.phone_no}</p>
                    </li>
                );
            }else if(item.fieldName=='FullName'){
                return (
                    <li key={index} style={{width: widths[index]} }>
                        <p>{item.full_name}</p>
                    </li>
                );
            }else if(item.fieldName=='Gender'){
                return (
                    <li key={index} style={{width: widths[index]} }>
                        <p>{item.gender}</p>
                    </li>
                );
            }else if(item.fieldName=='ImportantLevel'){
                let list=[];
                for(let i=0;i<item.level;i++){
                    list[i]=(<span>&#9733;&ensp;</span>);
                }
                return (
                    <li key={index} style={{width: widths[index]} }>
                        <p style={{color:"red"}}>{list}</p>
                    </li>
                );
            }else if(item.fieldName=='Mark'){
                return (
                    <li key={index} style={{width: widths[index]} }>
                        <p>{item.mark}</p>
                    </li>
                );
            }else if(item.fieldName=='MarkStarTime'){
                return (
                    <li key={index} style={{width: widths[index]} }>
                        <p>{item.mark_star_time}</p>
                    </li>
                );
            }else if(item.fieldName=='LogonTime'){
                return (
                    <li key={index} style={{width: widths[index]} }>
                        <p>{item.logon_time}</p>
                    </li>
                );
            }else if(item.fieldName=='Operation'){
                let list=item.op_items.map(function(ele,i) {
                    return (
                        <em key={i}>&ensp;{ele}</em>
                    );
                });
                return (
                    <li key={index} style={{width: widths[index]} } className="list-end" >
                        <p style={{color:"#1AA0E5"}}>{list}</p>
                    </li>
                );
            }
        });


        return(
            <ul className="table-line">
                {list}
                <li />
            </ul>
        );
    }
});

export default TableLine;
