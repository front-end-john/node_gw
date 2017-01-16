import React from 'react';
import ReactDOM from 'react-dom';
import PulldownTip from '../widgets/pulldown_tip';
export default React.createClass({

    componentWillMount(){
        document.title="联系人";
    },

    handleSave(){
        let name=this.nameInput.value.trim();
        let tel=this.telInput.value.trim();
        let dom=document.getElementById("dialog");
        if(!name){
            ReactDOM.render(<PulldownTip msg="姓名不能为空" />,dom);
            return 0;
        }
        if(!tel){
            ReactDOM.render(<PulldownTip msg="手机号不能为空" />,dom);
            return 0;
        }
        sessionStorage.setItem("ChangedContactPerson",JSON.stringify({name,phonenumber:tel}));
        location.href="#/order_detail";
    },
    handleNumberChange(e){
        let val=e.target.value.trim();
        if(val.length>=11){
            e.target.value=val.substr(0,11);
        }
    },
    render(){
        let cp=sessionStorage.getItem("ContactPerson");
        cp=cp?JSON.parse(cp):{};
        return(
            <div className="jieji-contact-person">
                <ul>
                    <li><input type="text" placeholder="姓名" ref={(c)=>this.nameInput=c}
                               defaultValue={cp.name||""} />
                    </li>
                    <li><label>+86</label>
                        <input type="number"  placeholder="手机号" defaultValue={cp.phonenumber||""}
                               onChange={this.handleNumberChange} ref={(c)=>this.telInput=c}  /></li>
                </ul>
                <button className="query-btn" onClick={this.handleSave}>保存</button>
            </div>
        );
    }
});
