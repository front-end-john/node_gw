 import React from 'react';
 import ReactDOM from 'react-dom';
 import WarnTip from '../dialog/warn_tip';
 export default React.createClass({
    getInitialState(){return{};},
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
    handlePreviewImg(e){
         let node=e.target;
         let file=node.files[0];
         let reader = new FileReader();
         reader.readAsDataURL(file);
         reader.onload=(e)=>{
             console.log("读取完成",e.target);
             this.showImg.src=reader.result;
         };
         reader.onerror=(e)=>{
             console.error("预览图片：",e);
         };
    },
    ensure(){
        let url=this.props.url+"?";
        let chserialnumber=this.props.number;
        let parkingSpot=this.parkingSpot,keySpot=this.keySpot;
        if(!parkingSpot.trim()){
            this.showWarnTip("请输入停车位！",2);return 0;
        }
        if(!keySpot.trim()){
            this.showWarnTip("请输入钥匙位！",2);return 0;
        }
        let file=this.inputFile.files[0];
        if(!file){
            this.showWarnTip("请选择钥匙位图片！",2);return 0;
        }
        let data = new FormData();
        data.append('file',file);
        let uploadUrl="/api5/chorders/uploadPicture";
        fetch(uploadUrl, {method:'POST',body:data,credentials: 'include'}
        ).then((res)=>{
            return res.json();
        }).then((obj)=>{
            console.log("图片上传返回：",obj);
            if(obj.code === 0){
                let savepath=obj.record.savepath;
                url+=queryStr.stringify({chserialnumber,parkingSpot,keySpot,savepath});
                fetch(url,{credentials: 'include'}).then((res)=>{
                    return res.json();
                }).then((obj)=>{
                    if(obj.code === 0){
                        this.showWarnTip(obj.message);
                        this.props.reload();
                    }else {
                        this.showWarnTip(obj.message,2);
                    }
                }).catch((e)=>{
                    this.showWarnTip("网络请求异常！",2);
                    console.warn('异常接口：', url,"异常对象：",e);
                });
            }else {
                this.showWarnTip(obj.message,2);
            }
        }).catch((e)=>{
            this.showWarnTip("网络请求异常！",2);
            console.warn('异常接口：', uploadUrl,"异常对象：",e);
        });
    },
    render(){
        return(
            <div className="dialog">
                <h2 className="title">车辆回库<i onClick={this.cancel}/></h2>
                <div className="dialog-important-user">
                    <p><em>停车位：</em><input type="text" placeholder="请输入停车位置" onChange={(e)=>this.parkingSpot=e.target.value} /></p>
                    <p><em>钥匙位：</em><input type="text" placeholder="请输入钥匙位" onChange={(e)=>this.keySpot=e.target.value} /></p>
                    <p><em>回库图片：</em>
                        <div className="upload-maintain">
                            <input type="file" accept="image/*" onChange={this.handlePreviewImg} ref={c=>this.inputFile=c} />
                            <img src="/duck/img/takeafter/image-upload.png" ref={c=>this.showImg=c}/></div></p>
                </div>
                <section className="btn">
                    <button onClick={this.cancel}>取消</button>
                    <button onClick={this.ensure}>确认</button>
                </section>
            </div>
        );
    }
});
