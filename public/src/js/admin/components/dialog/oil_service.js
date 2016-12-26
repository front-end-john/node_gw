 import React from 'react';

 export default React.createClass({
    getInitialState(){
        "use strict";
        return{
            oilType:"1"
        };
    },
    cancel(){
        "use strict";
        let mask=document.getElementById("dialogContainer");
        mask.style.display="none";
    },
    ensure(){
        "use strict";
        let mask=document.getElementById("dialogContainer");
        mask.style.display="none";

    },
    handleOilType(e){
        let val=e.target.value;
        console.log(val);
        this.setState({oilType:val});
    },
    render(){
        "use strict";
        let list=[];
        if(this.state.oilType==1){
            list[0]=(<option key="0" value="0#" >0#</option>);
        }else{
            list[0]=( <option key="0" value="92#" >92#</option>);
            list[1]=(<option key="1" value="95#" >95#</option>);
        }

        return(
            <div className="dialog">
                <h2 className="title">加油服务<i onClick={this.cancel}/></h2>
                <div className="dialog-important-user">
                    <p><em>燃油类型：</em>
                        <select onChange={this.handleOilType}>
                            <option value="">请选择</option>
                            <option value="1" >柴油</option>
                            <option value="2" >汽油</option>
                        </select><i className="select-arrow"/>
                    </p>
                    <p><em>燃油标号：</em>
                        <select>
                            <option value="">请选择</option>
                            {list}
                        </select><i className="select-arrow"/>
                    </p>
                    <p><em>加油金额：</em>
                        <select >
                            <option value="100元" >100元</option>
                            <option value="200元" >200元</option>
                            <option value="300元" >300元</option>
                        </select><i className="select-arrow"/>
                    </p>
                    <p><em>备&emsp;&emsp;注：</em><textarea placeholder="填写备注"  /></p>
                </div>
                <section className="btn">
                    <button onClick={this.cancel}>取消</button>
                    <button onClick={this.ensure}>确认</button>
                </section>
            </div>
        );
    }
});
