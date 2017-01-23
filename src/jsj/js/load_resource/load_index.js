import es6 from "es6-promise";
es6.polyfill();
import 'whatwg-fetch';
import {checkCacheConfig,loadRemoteResource,appendInDom} from '../util';

/**
 * 加载本地缓存资源
 */
appendInDom(localStorage.getItem("jsj_index_css"),"css");
appendInDom(localStorage.getItem("jsj_index_js"),"js");

/**
 * 异步更新资源,如果资源有改变
 */
let url="/mobile/jsj/local.json?t="+new Date().getTime();
let curr=localStorage.getItem("jsj_index_config");
checkCacheConfig(url,(json)=>{
    console.log("获取后台缓存配置：",json);
    curr=JSON.parse(curr)||{};
    /**
     * css资源更新
     */
    if(json.common_css_update!=curr.common_css_update){
        url="/mobile/jsj/css/index.css";
        loadRemoteResource(url,(text)=>{
            /**
             * 成功更新css资源
             */
            console.log("更新jsj_index的css资源成功");
            appendInDom(text,"css");
            localStorage.setItem("jsj_index_css",text);
            /**
             * 更新当前配置
             */
            let latest=JSON.parse(localStorage.getItem("jsj_index_config"))||{};
            latest.common_css_update=json.common_css_update;
            localStorage.setItem("jsj_index_config",JSON.stringify(latest));
        },(e)=>{
            console.log("更新jsj_index的css资源失败",e);
            appendInDom(localStorage.getItem("jsj_index_css"),"css");
        })
    }else {
        console.log("jsj_index的css资源已是最新");
        appendInDom(localStorage.getItem("jsj_index_css"),"css");
    }

    /**
     * js资源更新
     */
    if(json.index_js_update!=curr.index_js_update){
        url="/mobile/jsj/dist/index.js";
        loadRemoteResource(url,(text)=>{
            /**
             * 成功更新js资源
             */
            console.log("更新jsj_index的js资源成功");
            appendInDom(text,"js");
            localStorage.setItem("jsj_index_js",text);
            /**
             * 更新当前配置
             */
            let latest=JSON.parse(localStorage.getItem("jsj_index_config"))||{};
            latest.index_js_update=json.index_js_update;
            localStorage.setItem("jsj_index_config",JSON.stringify(latest));
        },(e)=>{
            console.log("更新jsj_index的js资源失败",e);
            appendInDom(localStorage.getItem("jsj_index_js"),"js");
        })
    }else {
        console.log("jsj_index的js资源已是最新");
        appendInDom(localStorage.getItem("jsj_index_js"),"js");
    }
},(e)=>{
    console.log("加载jsj_index的缓存配置失败：",e);
});