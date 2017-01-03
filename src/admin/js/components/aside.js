import React from 'react';

let PrimaryItem = React.createClass({
    render(){
        "use strict";
        let items=this.props.childItems;
        let list=items.map((item,index) =>{
            let id=this.props.prefix+(index+1);
            return(
                <li  id={id} key={index}
                     className={this.props.secondItem==id?"highlight":""}>
                    {item.name} <span>{item.newCount}</span></li>
            );
        });

        return (
            <section onMouseOver={this.props.hover} onMouseLeave={this.props.leave}
                     className={this.props.select === 'y'?"primary-item selected-with-list":"primary-item"}>
                <h2 id={this.props.id} onClick={this.props.click}>
                    <img src={this.props.imgUrl}/>
                    {this.props.itemName}</h2>
                <ul className="primary-list" onClick={this.props.secondNav}>
                    {list}
                </ul>
            </section>
        );
    }
});

let PrimaryItemNoList = React.createClass({
   /* handleItemClick(e){
        "use strict";
        console.log("点击了主项");
    },*/
    render() {
        "use strict";
        return (
            <section  onMouseOver={this.props.hover} onMouseLeave={this.props.leave}
                     className={this.props.select === 'y'?"primary-item selected":"primary-item"}>
                <h2 id={this.props.id} onClick={this.props.click}>
                    <img src={this.props.imgUrl}/>{this.props.itemName}</h2>
            </section>
        );
    }
});

let util={
    highlight:function (arg1,arg2,arg3){
        return (arg1===arg3 || arg2===arg3)
    }
};

let Aside = React.createClass({
    mixins:[util],
    getInitialState(){
        "use strict";
        return {
            currItem:"01",
            hoverItem:'01',
            secondItem:""
        };
    },
    handleHover(e){
        "use strict";
        if(e.target.nodeName==="H2"){
            this.setState({hoverItem:e.target.id});
        }
    },
    handleLeave(e){
        "use strict";
        if(e.target.nodeName==="H2"){
            this.setState({hoverItem:""});
        }
    },
    handClick(e){
        "use strict";
        if(e.target.nodeName==="H2"){
            let id=e.target.id;
            this.setState({currItem:id});
            this.setState({secondItem:""});
            if(id==="01"){
                location.href="#/order_query";
            }else if(id==="02"){
                //this.setState({secondItem:0});

            }else if(id==="jsj_order"){
                //this.setState({secondItem:0});

            }else if(id==="03"){
                location.href="#/user_manager";
            }else if(id==="04"){
                location.href="#/evaluation_manage";
            }else if(id==="05"){
                location.href="#/coupon_manage";
            }
        }
    },
    handleSecondClick(e){
        "use strict";
        if(e.target.nodeName==="LI"){

            let id=e.target.id;
            if(/jsj_/.test(id)){
                this.setState({currItem:"jsj_order"});
            }else {
                this.setState({currItem:"02"});
            }
            this.setState({secondItem:id});
            if(id=="2_1"){
                location.href="#/remain_contact_order";
            }else if(id=="2_2"){
                location.href="#/remain_assign_take_order";
            }else if(id=="2_3"){
                location.href="#/ongoing_take_order";
            }else if(id=="2_4"){
                location.href="#/airport_temp_park";
            }else if(id=="2_5"){
                location.href="#/in_garage_car";
            }else if(id=="2_6"){
                location.href="#/remain_assign_send_order";
            }else if(id=="2_7"){
                location.href="#/ongoing_send_order";
            }else if(id=="jsj_1"){
                //location.href="#/ongoing_send_order";
            }else if(id=="jsj_2"){
                //location.href="#/ongoing_send_order";
            }
        }
    },
    render(){
        "use strict";
        let orderManager=[{name:'待联系订单',newCount:15}, {name:'待分配接车单',newCount:15},
            {name:'进行中的接车订单',newCount:115},{name:'机场临时停放',newCount:15},
            {name:'在库车辆',newCount:15},{name:'待分配送车单',newCount:15},
            {name:'进行中的送车单',newCount:115}];
        let jsjOrder=[{name:'接机订单',newCount:15},{name:'送机订单',newCount:15}];

        return(
            <aside>
                <div id="manager">
                    <div><img src="/admin/img/managerimg.png" /></div>
                    <div>
                        <p>客服人员</p>
                        <section>
                            系统管理员<img className="arrow" src="/admin/img/icon/07.png"/>
                        </section>
                    </div>
                </div>
                <PrimaryItemNoList  id='01' itemName={"订单查询"} imgUrl={
                    this.highlight(this.state.currItem,this.state.hoverItem,'01')?"/admin/img/icon/01_1.png":"/admin/img/icon/01_2.png"}
                    select={this.highlight(this.state.currItem,this.state.hoverItem,'01')?'y':'n'}
                    hover={this.handleHover} leave={this.handleLeave} click={this.handClick}/>

                <PrimaryItem id='02' childItems={orderManager} itemName={"订单管理"} imgUrl={
                             this.highlight(this.state.currItem,this.state.hoverItem,'02')?"/admin/img/icon/02_1.png":"/admin/img/icon/02_2.png"}
                             select={this.highlight(this.state.currItem,this.state.hoverItem,'02')?'y':'n'}
                             secondItem={this.state.secondItem}
                             hover={this.handleHover} leave={this.handleLeave} click={this.handClick}
                             secondNav={this.handleSecondClick}
                             prefix="2_"/>

                <PrimaryItem id='jsj_order' childItems={jsjOrder} itemName={"接送机订单"} imgUrl={
                             this.highlight(this.state.currItem,this.state.hoverItem,'jsj_order')?"/admin/img/icon/jsj_2.png":"/admin/img/icon/jsj_1.png"}
                             select={this.highlight(this.state.currItem,this.state.hoverItem,'jsj_order')?'y':'n'}
                             secondItem={this.state.secondItem}
                             hover={this.handleHover} leave={this.handleLeave} click={this.handClick}
                             secondNav={this.handleSecondClick} prefix="jsj_" />


                <PrimaryItemNoList id='03' itemName={"用户管理"} imgUrl={
                    this.highlight(this.state.currItem,this.state.hoverItem,'03')?"/admin/img/icon/03_1.png":"/admin/img/icon/03_2.png"}
                    select={this.highlight(this.state.currItem,this.state.hoverItem,'03')?'y':'n'}
                    hover={this.handleHover} leave={this.handleLeave} click={this.handClick} />

                <PrimaryItemNoList id='04' itemName={"评价管理"} imgUrl={
                    this.highlight(this.state.currItem,this.state.hoverItem,'04')?"/admin/img/icon/04_1.png":"/admin/img/icon/04_2.png"}
                                   select={this.highlight(this.state.currItem,this.state.hoverItem,'04')?'y':'n'}
                                   hover={this.handleHover} leave={this.handleLeave} click={this.handClick} />

                <PrimaryItemNoList id='05' itemName={"优惠券管理"} imgUrl={
                    this.highlight(this.state.currItem,this.state.hoverItem,'05')?"/admin/img/icon/05_1.png":"/admin/img/icon/05_2.png"}
                                   select={this.highlight(this.state.currItem,this.state.hoverItem,'05')?'y':'n'}
                                   hover={this.handleHover} leave={this.handleLeave} click={this.handClick} />
            </aside>
        );
    }
});

export default Aside;