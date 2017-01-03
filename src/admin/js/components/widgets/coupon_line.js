import React from 'react';


export default React.createClass({
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
            }else if(item.fieldName=='MoneyAmount'){
                return (
                    <li key={index} style={{width: widths[index]} }>
                        <p>{item.amount}</p>
                    </li>
                );
            }else if(item.fieldName=='CouponID'){
                return (
                    <li key={index} style={{width: widths[index]} }>
                        <p>{item.id}</p>
                    </li>
                );
            }else if(item.fieldName=='CouponType'){
                return (
                    <li key={index} style={{width: widths[index]} }>
                        <p>{item.type_msg}</p>
                    </li>
                );
            }else if(item.fieldName=='CouponStatus'){
                return (
                    <li key={index} style={{width: widths[index]} }>
                        <p>{item.status}</p>
                    </li>
                );
            }else if(item.fieldName=='ReceiveCouponTime'){
                return (
                    <li key={index} style={{width: widths[index]} }>
                        <p>{item.receive_time}</p>
                    </li>
                );
            }else if(item.fieldName=='DeadlineTime'){
                return (
                    <li key={index} style={{width: widths[index]} }>
                        <p>{item.deadline_time}</p>
                    </li>
                );
            }else if(item.fieldName=='ActivitySource'){
                return (
                    <li key={index} style={{width: widths[index]} }>
                        <p>{item.source}</p>
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

