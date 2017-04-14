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

        case 0:return ["预约成功","#f00"];
        case 1:return ["客服已确认","#f00"];

        case 3:return ["接车司机调度中 ","#f00"];
        case 5:return ["已分配接车司机","#f00"];
        case 8:return ["已就位","#f00"];

        case 10:return ["已接车","#f00"];
        case 15:return ["已入库","#f00"];
        case 16:return ["钥匙交出","#f00"];

        case 20:return ["立即送车","#f00"];
        case 23:return ["送车司机调度中","#f00"];
        case 25:return ["已分配送车司机","#f00"];

        case 30:return ["预约成功","#f00"];
        case 32:return ["已核对送车密码","#f00"];
        case 35:return ["车辆已送还","#323232"];
        case 36:return ["预约成功","#f00"];

        case 38:return ["已支付","#323232"];
        case 50:return ["已支付","#323232"];
        default:return ["",""];
    }
};
/**
 * @param type
 *  修改预约接车时间:1
 *     添加返程航班:2
 *  修改预约取车时间:3
 *   添加或取消加油:4
 *   添加或取消洗车:5
 *     分配接车司机:6
 *     分配送车司机:7
 * @param s
 */
export let optState=(type,s)=>{
    if(type===1){
        return s>=0 && s<10
    }else if(type===2 || type===3){
        return s>=0 && s<30
    }else if(type===4){
        return s>=0 && s<15
    }else if(type===5){
        return s>=0 && s<=16
    }else if(type===6){
        return s>=0 && s<=5
    }else if(type===7){
        return s>=16 && s<=25
    }else {
        return false;
    }
};

export function maintainState(s) {
    let status="";
    if(s===0){
        status="待推荐";
    }else if(s===5){
        status="司机推荐";
    }else if(s===10){
        status="已推荐";
    }else if(s===20){
        status="用户已确认保养";
    }else if(s===30){
        status="保养中";
    }else if(s===50){
        status="保养已完成";
    }else if(s===-1){
        status="已取消";
    }else if(s===-10){
        status="无需保养";
    }
    return status;
}