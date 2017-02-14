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

export let getFormatDate=(format,timestamp)=>{
    if(!timestamp) return "";
    let {year,month,day,hour,minute,second} =decDatetime(timestamp);
    return format.replace("yyyy",year)
        .replace("mm",month)
        .replace("dd",day)
        .replace("hh",hour)
        .replace("ii",minute)
        .replace("ss",second);
};
export let maxNumber=(a,b,c)=>{
    let max=a>=b?a:b;
    max=max>=c?max:c;
    return max;
};
export let addUniqueEle=(arr,e)=>{
    for(let i=0,len=arr.length;i<len;i++){
        if(arr[i]===e) return 0;
    }
    return arr.push(e);
};

export let delExitEle=(arr,e)=>{
    for(let i=0,len=arr.length;i<len;i++){
        if(arr[i]===e) {
            return arr.splice(i,1);
        }
    }
    return 0;
};

export let isExitValue=(arr,e)=>{
    for(let i=0,len=arr.length;i<len;i++){
        if(arr[i]===e) {
            return true;
        }
    }
    return false;
};
export let getStateInfo=(number)=>{
    switch(number){
        case -1:return ["已取消","#969696"];

        case 0:return ["预约成功","#db8800"];
        case 1:return ["客服已确认","#db8800"];

        case 3:return ["接车司机调度中 ","#db8800"];
        case 5:return ["已分配接车司机","#db8800"];
        case 8:return ["已就位","#db8800"];

        case 10:return ["已接车","#db8800"];
        case 15:return ["已入库","#db8800"];
        case 16:return ["钥匙交出","#db8800"];

        case 20:return ["立即送车","#1a9fe5"];
        case 23:return ["送车司机调度中","#1a9fe5"];
        case 25:return ["已分配送车司机","#1a9fe5"];

        case 30:return ["预约成功","#1a9fe5"];
        case 35:return ["预约成功","#1a9fe5"];
        case 36:return ["预约成功","#1a9fe5"];

        case 38:return ["已支付","#323232"];
        case 50:return ["已支付","#323232"];
        default:return ["",""];
    }
};

