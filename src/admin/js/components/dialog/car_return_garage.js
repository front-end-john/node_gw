 import React from 'react';
 import ReactDOM from 'react-dom';
 import WarnTip from '../dialog/warn_tip';
 export default React.createClass({
     getInitialState(){
         return{ warn:''};
     },
    componentWillMount(){
        let mask=document.getElementById("dialogContainer");
        mask.style.display="block";
    },
    cancel(){
        let mask=document.getElementById("dialogContainer");
        ReactDOM.render(<i/>, mask);
        mask.style.display="none";
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
    ensure(){

    },
    render(){
        return(
            <div className="dialog">
                <h2 className="title">车辆回库<i onClick={this.cancel}/></h2>
                <div className="dialog-important-user">
                    <p><em>停车位：</em><input type="text" placeholder="请输入停车位置"  /></p>
                    <p><em>钥匙位：</em><input type="text" placeholder="请输入钥匙位"  /></p>
                    <p><em>回库图片：</em>
                        <div className="upload-maintain"><input type="file" />
                            <img src="/duck/img/takeafter/image-upload.png" /></div></p>
                </div>
                <section className="btn">
                    <button onClick={this.cancel}>取消</button>
                    <button onClick={this.ensure}>确认</button>
                </section>
            </div>
        );
    }
});
