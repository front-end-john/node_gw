import React from 'react';

export default React.createClass({
    render(){
        let items=this.props.childItems,childLevel=null;
        if(items){
            let list = items.map((item, index) => {
                let id = this.props.prefix + (index + 1);
                return (
                    <li id={id} key={index} onClick={()=>this.props.secondClick(id)}
                        className={this.props.secondItem == id?"highlight" : ""}>
                        {item.name} <span>{item.newCount}</span></li>
                );
            });
            childLevel = (<ul className="primary-list">
                {list}
            </ul>);
        }
        //style={{backgroundColor:this.props.id==this.props.currItem?"#202E43":"inherit"}}
        return (
            <section className="primary-item" >
                <h2  onClick={(e)=> this.props.click(this.props.id)}
                     className={this.props.id==this.props.currItem?"selected":""}>
                    <em className="item-icon" />
                    {this.props.itemName}</h2>
                {childLevel}
            </section>
        );
    }
});