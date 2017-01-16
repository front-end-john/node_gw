import React from 'react';

export default React.createClass({
    getInitialState(){
        return{
            init:true,
            cities:[{pinyin:"BeiJing",name:'北京'},{pinyin:"BeiHai",name:'北海'},{pinyin:"ChengDu",name:'成都'},
                {pinyin:"ChangChun",name:'长春'},{pinyin:"ChangZhou",name:'常州'},{pinyin:"ChangSha",name:'长沙'},
                {pinyin:"ChongQing",name:'重庆'},{pinyin:"DaLi",name:'大理'},{pinyin:"DaTong",name:'大同'},
                {pinyin:"DongGuan",name:'东莞'},{pinyin:"DaLian",name:'大连'},{pinyin:"FoShan",name:'佛山'},
                {pinyin:"FuZhou",name:'福州'},{pinyin:"GuiLin",name:'桂林'},{pinyin:"GuangZhou",name:'广州'},
                {pinyin:"GuiYang",name:'贵阳'},{pinyin:"HaErBin",name:'哈尔滨'}, {pinyin:"HeFei",name:'合肥'},
                {pinyin:"HaiKou",name:'海口'},{pinyin:"HangZhou",name:'杭州'},{pinyin:"HuLunBeiEr",name:'呼伦贝尔'},
                {pinyin:"HuangShan",name:'黄山'},{pinyin:"HuHeHaoTe",name:'呼和浩特'},{pinyin:"JiuHuaShan",name:'九华山'},
                {pinyin:"JiuZhaiGou",name:'九寨沟'},{pinyin:"JiuJiang",name:'九江'},{pinyin:"JiNan",name:'济南'},
                {pinyin:"KunMing",name:'昆明'},{pinyin:"LaSa",name:'拉萨'},{pinyin:"LuoYang",name:'洛阳'},
                {pinyin:"LanZhou",name:'兰州'},{pinyin:"LiJiang",name:'丽江'},{pinyin:"NanTong",name:'南通'},
                {pinyin:"NanChang",name:'南昌'},{pinyin:"NingBo",name:'宁波'},{pinyin:"NanNing",name:'南宁'},
                {pinyin:"NanJing",name:'南京'},{pinyin:"QingDao",name:'青岛'},{pinyin:"QinHuangDao",name:'秦皇岛'},
                {pinyin:"QuanZhou",name:'泉州'},{pinyin:"ShenZhen",name:'深圳'},{pinyin:"SanYa",name:'三亚'},
                {pinyin:"ShenYang",name:'沈阳'},{pinyin:"SuZhou",name:'苏州'},{pinyin:"ShangHai",name:'上海'},
                {pinyin:"ShiJiaZhuang",name:'石家庄'},{pinyin:"TaiAn",name:'泰安'},{pinyin:"TaiYuan",name:'太原'},
                {pinyin:"TengChong",name:'腾冲'},{pinyin:"TianJin",name:'天津'},{pinyin:"WeiHai",name:'威海'},
                {pinyin:"WuDangShan",name:'武当山'},{pinyin:"WuLuMuQi",name:'乌鲁木齐'},{pinyin:"WuHan",name:'武汉'},
                {pinyin:"WenZhou",name:'温州'},{pinyin:"WuTaiShan",name:'五台山'},{pinyin:"WuXi",name:'无锡'},
                {pinyin:"XuZhou",name:'徐州'},{pinyin:"XiNing",name:'西宁'},{pinyin:"XiAn",name:'西安'},
                {pinyin:"XiaMen",name:'厦门'},{pinyin:"XiShuangBanNa",name:'西双版纳'},{pinyin:"YangZhou",name:'扬州'},
                {pinyin:"YiChang",name:'宜昌'},{pinyin:"YinChuan",name:'银川'},{pinyin:"YanTai",name:'烟台'},
                {pinyin:"ZhangJiaJie",name:'张家界'},{pinyin:"ZhuHai",name:'珠海'},{pinyin:"ZhengZhou",name:'郑州'},
                {pinyin:"ZunYi",name:'遵义'}],
            searchCities:[],
            hotCities:[{pinyin:"BeiJing",name:'北京'},{pinyin:"ShenZhen",name:'深圳'},{pinyin:"WuHan",name:'武汉'},
                {pinyin:"ShangHai",name:'上海'},{pinyin:"GuangZhou",name:'广州'},{pinyin:"HangZhou",name:'杭州'}]
        };
    },
    handleSearchChange(e){
        let key=e.target.value.trim();
        if(key){
            this.setState({init:false});
        }else{
            this.setState({init:true});
            return ;
        }
        let reg=new RegExp(key,"gi");
        let data=this.state.cities,len=data.length;
        let searchCities=[];
        for(let i=0;i<len;i++){
            if(reg.test(data[i].pinyin)||reg.test(data[i].name)){
                searchCities.push(data[i]);
            }
        }
        this.setState({searchCities:searchCities});
    },

    render(){
        let list=[];
        if(this.state.init){
            let data=this.state.cities,len=data.length;
            for(let i=0;i<26;i++){
                let letter=String.fromCharCode(65+i);
                let reg=new RegExp("^"+letter,"i");
                let lis=[];
                for(let j=0;j<len;j++){
                    if(reg.test(data[j].pinyin)){
                        lis[j]=(<li id={data[j].pinyin} key={j} onClick={this.props.citySelect}>{data[j].name}</li>);
                    }
                }
                list[i]=(<ul key={i}>
                            <li className="group-letter">{letter}</li>
                            {lis}
                        </ul>);
            }
        }else{
            let data=this.state.searchCities,len=data.length;
            let lis=[];
            for(let j=0;j<len;j++){
                lis[j]=(<li id={data[j].pinyin} key={j} onClick={this.props.citySelect} >{data[j].name}</li>);
            }
            list[0]=(<ul key="0">{lis}</ul>);
        }
        let firstLine=[],secondLine=[];
        let hotCities=this.state.hotCities;
        for(let j=0,len=hotCities.length;j<len;j++){
            if(j>2){
                secondLine[j-3]=(<li id={hotCities[j].pinyin} key={j} onClick={this.props.citySelect} >{hotCities[j].name}</li>);
            }else {
                firstLine[j]=(<li id={hotCities[j].pinyin} key={j} onClick={this.props.citySelect} >{hotCities[j].name}</li>);
            }
        }

        return(
            <div className="city-select">
                <section className="search-section">
                    <input type="text" placeholder="城市/行政区/拼音" onChange={this.handleSearchChange}/>
                    <em className="input-search"/>
                </section>
                <section className="hot-cities">
                    <h3>热门城市</h3>
                    <ul>
                        {firstLine}
                    </ul>
                    <ul>
                        {secondLine}
                    </ul>
                </section>
                <section className="city-list">
                    {list}
                </section>
            </div>
        );
    }
});

//参考页面:http://m.jryghq.com/#!/car_city