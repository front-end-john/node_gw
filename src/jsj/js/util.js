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