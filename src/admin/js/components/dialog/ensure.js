import React from 'react';
import ReactDOM from 'react-dom';
let Ensure=React.createClass({
    componentWillMount(){
        let mask=document.getElementById("dialogContainer");
        mask.style.display="block";
    },
    cancel(){
        let mask=document.getElementById("dialogContainer");
        ReactDOM.render(<i/>, mask);
        mask.style.display="none";
    },
    ensure(){
        let change=this.props.change;
        change && change();
        this.cancel();
    },
    render(){
        return(
            <div className="dialog">
                <h2 className="title">{this.props.title}<i onClick={this.cancel}/></h2>
                <p className="dialog-ensure">{this.props.content}</p>
                <section className="btn">
                    <button onClick={this.cancel}>取消</button>
                    <button onClick={this.ensure}>确认</button>
                </section>
            </div>
        );
    }
});

export default Ensure;
