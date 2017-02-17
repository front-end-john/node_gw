import React from 'react';
import ReactDOM from 'react-dom';
import Ensure from "../dialog/ensure";
export default React.createClass({
    getInitialState(){
        return{};
    },
    handleDelete(id){
        let mask=document.getElementById("dialogContainer");
        ReactDOM.render(<Ensure id={id} title="删除优惠券"  content={"确定删除优惠券吗？"}
                                url="/admin/api/users/marking"
                                reload={this.loadOrderDetail} />, mask);
    },
    render(){
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
                this.cid=item.id;
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
                return (
                    <li key={index} style={{width: widths[index]} } className="list-end" >
                        <p style={{color:"#1AA0E5"}} onClick={()=>this.handleDelete(this.cid)}><em>删除</em></p>
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

