import React from 'react';

export default React.createClass({

    componentWillMount(){
        document.title="选择车型";
        let carData=sessionStorage.getItem("carTypeList");
        carData=JSON.parse(carData);
        /**
         * 保存查询标识
         */
        sessionStorage.setItem("pricemark",carData.pricemark);
        this.setState({cars:carData.records});
        /**
         *初始化车图片列表
         */
        this.carImgList=["/weixinjsj/img/07.png","/weixinjsj/img/08.png","/weixinjsj/img/09.png","/weixinjsj/img/10.png"];
    },
    handleClickSelect(e){
        let id=e.target.id;
        let selectedCarType=this.state.cars[id];
        selectedCarType.imgUrl=this.carImgList[+selectedCarType.id-1];
        sessionStorage.setItem("selectedCarType",JSON.stringify(selectedCarType));
        location.href="#/order_detail";
    },
    render(){
        let list=this.state.cars.map((item,index)=>{

            return(<section className="type-item" key={index} >
                <ul>
                    <li>
                        <p><em>{item.cartype}</em>&ensp;{item.cardescription}</p>
                        <p><img src="/weixinjsj/img/people.png"/> &le;{item.passengernumber}人&ensp;
                            <img src="/weixinjsj/img/trunk.png"/> &le;{item.luggagenumber}件</p>
                    </li>
                    <li>
                        <p><img src={this.carImgList[+item.id-1]}/></p>
                        <p>一口价<em>{item.totalfee}</em>元&emsp;
                            <button onClick={this.handleClickSelect} id={index}>选择</button></p>
                    </li>
                </ul>
            </section>);
        });
        return(
            <div className="car-type-list">
                <p><img src="/weixinjsj/img/auction.png" />
                    <span>&ensp;一口价:&ensp;</span>起点到终点的所有费用(包括高速费，停车费等)</p>
                {list}
            </div>
        );
    }
});
