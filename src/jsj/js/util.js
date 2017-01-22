export let decDatetime=(timestamp)=>{
    let d=new Date(timestamp);
    let year=d.getFullYear();
    let month=d.getMonth();month++;month=month<10?"0"+month:month;
    let day=d.getDate();day=day<10?"0"+day:day;
    let hour=d.getHours();hour=hour<10?"0"+hour:hour;
    let minute=d.getMinutes();minute=minute<10?"0"+minute:minute;
    let second=d.getSeconds();second=second<10?"0"+second:second;
    let week=d.getDay();
    return {year,month,day,hour,minute,second,week};
};

export let getLocalTimestamp=(timeStr)=>{
    let dt=new Date(timeStr.replace(/\-/g,'/'));
    return dt.getTime() + dt.getTimezoneOffset()*60000;
};

export let decLocSearch=(search)=>{
    let arr=search.replace("?","").split("&");
    let obj={};
    for(let i=0,len=arr.length;i<len;i++){
        let item=arr[i].split("=");
        obj[item[0]]=decodeURI(item[1]);
    }
    return obj;
};

export let checkCacheConfig=(url,success,fail)=>{
    fetch(url, {
        method: 'GET',
        mode: 'cors'
    }).then((res)=>{
        return res.json()
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

export let appendInDom=(text,type)=>{
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