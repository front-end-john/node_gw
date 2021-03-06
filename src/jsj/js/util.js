export let decDatetime=(timestamp)=>{
    if(!timestamp){
        return {year:0,month:0,day:0,hour:0,minute:0,second:0,week:7};
    }
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
    let dt=timeStr?new Date(timeStr.replace(/\-/g,'/')):new Date();
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
