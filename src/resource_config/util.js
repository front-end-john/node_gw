
export let checkCacheConfig=(url,success,fail)=>{
    fetch(url, {
        method: 'GET',
        mode: 'cors'
    }).then((res)=>{
        if(res.status==305){
            return new Error("后台读取缓存配置文件异常");
        }
        return res.json();
    }).then(function(json) {
        success(json);
    }).catch((e)=>{
        fail(e)
    });
};

export let loadRemoteResource=(url,success,fail)=>{
    fetch(url, {
        method: 'GET',
        mode: 'cors'
    }).then((res)=>{
        return res.text()
    }).then(function(text) {
        success(text);
    }).catch((e)=>{
        fail(e)
    });
};

export let appendResource=(text,type)=>{
    if(type=="css"){
        let style=document.createElement("style");
        style.innerHTML=text;
        document.head.appendChild(style);
    }else if(type=="js"){
        let script=document.createElement("script");
        script.innerHTML=text;
        document.body.appendChild(script);
    }
};

export let updateResource=(text,type)=>{
    let styles=document.head.getElementsByTagName("style");
    let scripts=document.body.getElementsByTagName("script");
    if(type=="css"){
        styles[styles.length-1].innerHTML=text;
    }else if(type=="js"){
        scripts[scripts.length-1].innerHTML=text;
    }
};