import React from 'react';
let Ensure=React.createClass({
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
    handleSelectLabel(e){
        "use strict";
        let ele=e.target;
        if(ele.nodeName=="LI"){
            if(ele.className=="selected"){
                ele.className="";
            }else {
                ele.className="selected"
            }
        }
    },
    render(){
        "use strict";
        return(
            <div className="dialog">
                <h2 className="title">客户标签<i onClick={this.cancel}/></h2>
                <ul className="customer-label" onClick={this.handleSelectLabel}>
                    <li>机场客户</li>
                    <li>优质客户</li>
                    <li>关系客户</li>
                    <li>无需电话确认</li>
                    <li>无烟客户</li>
                    <li>发票</li>
                </ul>
            </div>
        );
    }
});

export default Ensure;
