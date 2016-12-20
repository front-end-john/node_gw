import React from 'react';

let SelectInput=React.createClass({
    render(){
        "use strict";
        let dataList=[{name:"深航",value:"SZAIR"},{name:"携程",value:"Ctrip"},
            {name:"携程单卖",value:"CTRIPSHEETSELL"}, {name:"武汉胜意",value:"WUHANSHENGYI"},
            {name:"同程",value:"TONGCHENG"},{name:"分销系统",value:"DISTRIBUTOR"},{name:"建行",value:"CCB"}];
        let list=dataList.map(function (item,index) {
            return(
                <option value={item.value} key={index}>{item.name}</option>
            );
        });
        return(
            <p className="select-item">
                <label>{this.props.title}</label>
                <select id={this.props.name}  onChange={this.props.change} >
                    <option value="">{this.props.defaultName}</option>
                    {list}
                </select>
            </p>
        );
    }
});

export default SelectInput;