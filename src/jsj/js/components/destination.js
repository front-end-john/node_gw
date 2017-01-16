import React from 'react';
import ReactDOM from 'react-dom';
import CitySelect from '../widgets/city_select'

export default React.createClass({
    getInitialState(){
        return{searchData:[]};
    },
    componentWillMount(){
        document.title="目的地";
        this.city={pinyin:"",name:this.props.location.query.city||"深圳"};
    },
    handleSelectCity(){
        let dom=document.getElementById("dialog");
        ReactDOM.render(<CitySelect citySelect={this.handleCitySelect} />,dom);
        dom.style.display="block";
    },
    handleCitySelect(e){
        let li=e.target;
        let city={pinyin:li.id,name:li.innerHTML};
        let dom=document.getElementById("dialog");
        dom.style.display="none";
        this.city=city;
        this.refs.cityName.innerHTML=city.name;
    },
    handleChange(e){
        let key=e.target.value.trim();
        if(!key) return;
        let ak="CE6cd9406d95e0f351bc98a8898b9abf";
        let url="http://api.map.baidu.com/place/v2/suggestion?query="+key+
            "&region="+ this.city.name + "市&output=json&city_limit=true&ak="+ak;
        /**
         * 调百度接口，获取具体位置列表
         */
        fetchJsonp(url).then((res)=>{
                return res.json();
            }).then((json)=>{
                this.setState({searchData:json.result});
            }).catch(function(e) {
                console.warn('错误', e);
            });
    },
    handleSelectLocation(e){
        let orderType=sessionStorage.getItem("OrderType");
        let id=e.target.id;
        if(e.target.nodeName==="P"){
            id=e.target.parentNode.id;
        }
        let address=this.state.searchData[id];
        /**
         * 保存用户目的地/出发地数据
         */
        if(orderType=="1"){
            sessionStorage.setItem("UserJJAddress",JSON.stringify(address));
        }else {
            sessionStorage.setItem("UserSJAddress",JSON.stringify(address));
        }

        location.href="#/jsj_query?type="+orderType;
    },
    render(){
        let list=this.state.searchData.map((item,index)=>{
            return (
                <li key={index} id={index} onClick={this.handleSelectLocation}>
                    <p>{item.name}</p>
                    <p>{item.city}&ensp;{item.district}</p>
                </li>
            );
        });

        return(
            <div className="destination">
                <section className="dest-select">
                    <ul>
                        <li onClick={this.handleSelectCity}>
                            <span ref='cityName' >{this.city.name}</span><i className="arrow-down"/></li>
                        <li><input type="text" placeholder="请输入目的地" onChange={this.handleChange} /></li>
                    </ul>
                </section>
                <section className="search-result">
                    <ul>{list}</ul>
                </section>
            </div>
        );
    }
});
