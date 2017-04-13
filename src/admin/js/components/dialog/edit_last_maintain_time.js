 import React from 'react';
 import ReactDOM from 'react-dom';
 import WarnTip from '../dialog/warn_tip';
 import DateSelect from '../widgets/date_select';
 export default React.createClass({
    componentWillMount(){
        let mask=document.getElementById("dialogContainer");
        mask.style.display="block";
    },
     showWarnTip(msg,floor=1){
         let dialogContainer="dialogContainer";
         if(floor===2) dialogContainer="secDialogContainer";
         let mask=document.getElementById(dialogContainer);
         if(msg===null){
             ReactDOM.render(<i/>, mask);
             mask.style.display="none";
         }else {
             ReactDOM.render(<WarnTip dc={dialogContainer} msg={msg}/>, mask);
         }
     },
    cancel(){
        let mask=document.getElementById("dialogContainer");
        ReactDOM.render(<i/>, mask);
        mask.style.display="none";
    },
    ensure(){

    },
    render(){

        return(
            <div className="dialog">
                <h2 className="title">编辑上次保养时间<i onClick={this.cancel}/></h2>
                <div className="dialog-flight-info">
                    <p><DateSelect title={<span>上次保养时间：</span>}
                                    change={(date)=>this.state.last_maintain_time=date}/></p>
                </div>
                <section className="btn">
                    <button onClick={this.cancel}>取消</button>
                    <button onClick={()=>this.ensure()}>确认</button>
                </section>
            </div>
        );
    }
});
