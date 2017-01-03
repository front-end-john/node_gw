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
