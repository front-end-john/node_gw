import React from 'react';
import Dialog from "../widgets/warning_dialog";
import ReactDOM from 'react-dom';
export default React.createClass({

    componentWillMount(){
        document.title="联系人";
        let contact=sessionStorage.getItem("contactPerson");
        if(contact){
            contact=JSON.parse(contact);
            this.setState({contact});
        }
    },
    handleClear(){
        this.nameInput.value="";
        this.telInput.value="";
    },
    handleSave(){
        let name=this.nameInput.value.trim();
        let tel=this.telInput.value.trim();
        if(name && tel){
            //console.log(name,tel);
            sessionStorage.setItem("contactPerson",JSON.stringify({name,phonenumber:tel}));
            location.href="#/order_detail";
        }else {
            let dom=document.getElementById("dialog");
            ReactDOM.render(<Dialog warn="姓名或手机号不能为空" />,dom);
            dom.style.display="block";
        }
    },
    render(){
        let c=this.state.contact;
        return(
            <div className="jieji-contact-person">
                <ul>
                    <li><input type="text" placeholder="姓名" ref={(c)=>this.nameInput=c}
                               defaultValue={c?c.name:""} />
                        <em className="clear-input" onClick={this.handleClear}/></li>
                    <li><label>+86</label>
                        <input type="text" placeholder="手机号" defaultValue={c?c.phonenumber:""}
                                                 ref={(c)=>this.telInput=c}  /></li>
                </ul>
                <button className="query-btn" onClick={this.handleSave}>保存</button>
            </div>
        );
    }
});
