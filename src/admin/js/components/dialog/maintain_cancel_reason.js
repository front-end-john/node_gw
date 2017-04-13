 import React from 'react';
 import ReactDOM from 'react-dom';
 import WarnTip from '../dialog/warn_tip';
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
        let textareaStyle={width:200,height:60,padding:10,verticalAlign:"middle"};
        return(
            <div className="dialog">
                <h2 className="title">取消保养<i onClick={this.cancel}/></h2>
                <div className="dialog-flight-info">
                    <p><em>取消保养原因：</em>
                        <textarea style={textareaStyle} placeholder="请输入原因"
                                  onChange={(e)=>this.description=e.target.value}/></p>
                    <p className="maintain-cancel"><input type="checkbox" /><em>需要向客户收费</em></p>
                    <p className="maintain-cancel"><em>&emsp;&ensp;收费金额：</em><select>
                        <option>¥50.00</option>
                        <option>¥100.00</option>
                        <option>¥150.00</option>
                        <option>¥200.00</option>
                    </select></p>
                    <p className="maintain-cancel"><em>&emsp;&ensp;收费理由：</em><select>
                        <option>飞泊通服务费</option>
                        <option>其它</option>
                    </select></p>
                </div>
                <section className="btn">
                    <button onClick={this.cancel}>取消</button>
                    <button onClick={()=>this.ensure()}>确认</button>
                </section>
            </div>
        );
    }
});
