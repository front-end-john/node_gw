import es6 from "es6-promise";
es6.polyfill();
import 'whatwg-fetch';
import {checkCacheConfig,loadRemoteResource,appendResource,updateResource} from './util';


let href=location.href;
let local_config_key="gloal_cache_config";
let local_js_key="jsj_index_js";
let local_css_key="jsj_common_css";
let config_url="/mobile/jsj/local_cache?t="+new Date().getTime();

if(href.indexOf("admin")>-1){
    local_js_key="admin_index_js";
    local_css_key="admin_index_css";
    config_url="/admin/local_cache?t="+new Date().getTime();
}else if(href.indexOf("main")>-1){
    local_js_key="jsj_main_js";
}else if(href.indexOf("more_service")>-1){
    local_js_key="jsj_more_service_js";
}else if(href.indexOf("order_pay")>-1){
    local_js_key="jsj_order_pay_js";
}else if(href.indexOf("order_list")>-1){
    local_js_key="jsj_order_list_js";
}else if(href.indexOf("order_status")>-1){
    local_js_key="jsj_order_status_js";
}else if(href.indexOf("check_order_detail")>-1){
    local_js_key="jsj_check_order_detail_js";
}else if(href.indexOf("cancel_order_know")>-1){
    local_js_key="jsj_cancel_order_know_js";
}else if(href.indexOf("cancel_order_rule")>-1){
    local_js_key="jsj_cancel_order_rule_js";
}else if(href.indexOf("order_comment")>-1){
    local_js_key="jsj_order_comment_js";
}else if(href.indexOf("modify_contact_person")>-1){
    local_js_key="jsj_modify_contact_person_js";
}

/**
 * 加载本地缓存资源
 */
let cssText=localStorage.getItem(local_css_key),jsText=localStorage.getItem(local_js_key);
appendResource(cssText,"css");
appendResource(jsText,"js");

/**
 * 异步更新资源,如果资源有改变
 */
let curr_config=localStorage.getItem(local_config_key);
checkCacheConfig(config_url,(json)=>{
    console.log("远程获取的缓存配置信息：",json);
    curr_config=JSON.parse(curr_config)||{};
    let curr_css=curr_config[local_css_key];
    let next_css=json[local_css_key];
    /**
     * css资源更新
     */
    if(!cssText || !curr_css || next_css.update!=curr_css.update){
        loadRemoteResource(next_css.loadUrl,(text)=>{
            /**
             * 成功更新css资源
             */
            console.log(next_css.loadUrl+"资源更新成功");
            updateResource(text,"css");
            localStorage.setItem(local_css_key,text);
            /**
             * 更新当前配置
             */
            let latest=JSON.parse(localStorage.getItem(local_config_key))||{};
            latest[local_css_key]=json[local_css_key];
            localStorage.setItem(local_config_key,JSON.stringify(latest));
        },(e)=>{
            console.log("更新"+next_css.loadUrl+"资源失败",e);
        })
    }else {
        console.log(next_css.loadUrl+"资源已是最新");
    }

    let curr_js=curr_config[local_js_key];
    let next_js=json[local_js_key];
    /**
     * js资源更新
     */
    if(!jsText || !curr_js || next_js.update!=curr_js.update){
        loadRemoteResource(next_js.loadUrl,(text)=>{
            /**
             * 成功更新js资源
             */
            console.log(next_js.loadUrl+"资源更新成功");
            updateResource(text,"js");
            localStorage.setItem(local_js_key,text);
            /**
             * 更新当前配置
             */
            let latest=JSON.parse(localStorage.getItem(local_config_key))||{};
            latest[local_js_key]=json[local_js_key];
            localStorage.setItem(local_config_key,JSON.stringify(latest));
        },(e)=>{
            console.log("更新"+next_js.loadUrl+"资源失败",e);
        })
    }else {
        console.log(next_js.loadUrl+"资源已是最新");
    }
},(e)=>{
    console.log("加载缓存配置失败：",e);
});