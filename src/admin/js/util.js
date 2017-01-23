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
    let {year,month,day,hour,minute,second} =decDatetime(timestamp);
    return format.replace("yyyy",year)
        .replace("mm",month)
        .replace("dd",day)
        .replace("hh",hour)
        .replace("ii",minute)
        .replace("ss",second);
};
export let getStateMsg=(number)=>{
    switch(number){
        case -1:return "已取消";
        case 0:return "预约接车单生成";
        case 1:return "客服已确认";
        case 3:return "调度司机中";
        case 5:return "司机已分配";
        case 8:return "司机已就位";
        case 10:return "已接车";
        case 15:return "已泊车";
        case 16:return "钥匙交出";
        case 20:return "立即送车单生成";
        case 23:return "调度司机中";
        case 25:return "司机已分配";
        case 30:return "已出发";
        case 35:return "已交车";
        case 36:return "用户确认已交车";
        case 38:return "已支付";
        case 50:return "订单完成";
        default:return null;
    }
};
