import React from 'react';
import ReactDOM from 'react-dom';
import EditImportantUser from "../dialog/operate_important_user";
import Ensure from "../dialog/ensure";

export default React.createClass({
    handleCancelStar(uid,name,phone){
        let mask=document.getElementById("dialogContainer");
        ReactDOM.render(<Ensure title="取消用户星级"  content={"确定要取消“"+name+"（"+phone+"）”的星级吗？"}
                                url="/admin/api/users/clear_stars" user_id={uid}
                            reload={this.props.updateList} />, mask);
    },
    handleImportantUser(type,phone,stars,remark){
        let mask=document.getElementById("dialogContainer");
        ReactDOM.render(<EditImportantUser type={type} phone={phone} stars={stars} remark={remark}
                                url="/admin/api/users/edit"
                                reload={this.props.updateList} />, mask);
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
            }else if(item.fieldName=='FullName'){
                return (
                    <li key={index} style={{width: widths[index]} }>
                        <p>{item.full_name}</p>
                    </li>
                );
            }else if(item.fieldName=='Gender'){
                return (
                    <li key={index} style={{width: widths[index]} }>
                        <p>{item.gender==0?"女":"男"}</p>
                    </li>
                );
            }else if(item.fieldName=='ImportantLevel'){
                let list=[];
                this.stars=item.level;
                for(let i=0;i<item.level;i++){
                    list[i]=(<span key={i}>&#9733;&ensp;</span>);
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
                return (
                    <li key={index} style={{width: widths[index]} } className="list-end" >
                        <p style={{color:"#1AA0E5"}}>
                            <em onClick={()=>this.handleImportantUser("mod",item.phone,item.stars,item.remark)}>编辑</em>
                            {item.stars>0 && (<em onClick={()=>this.handleCancelStar(item.id,item.name,item.phone)}>&ensp;取消星级</em>)}
                        </p>
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

