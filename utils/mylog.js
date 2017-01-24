let clc = require('cli-color');

let decDatetime=(timestamp)=>{
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

let getFormatDate=(format,date=new Date())=>{
    let {year,month,day,hour,minute,second,week} =decDatetime(date.getTime());
    return format.replace("yyyy",year)
        .replace("mm",month)
        .replace("dd",day)
        .replace("hh",hour)
        .replace("ii",minute)
        .replace("ss",second);
};

let info=(msg,filename=null)=>{
    console.log(clc.white.bold(getFormatDate("yyyy-mm-dd hh:ii:ss")),
        clc.blue(filename?filename+'\r\n':''),clc.blue(msg));
};
let warn=(msg,filename=null)=>{
    console.log(clc.white.bold(getFormatDate("yyyy-mm-dd hh:ii:ss")),
        clc.blue(filename?filename+'\r\n':''),clc.yellow(msg));
};
let error=(msg,filename=null)=>{
    console.log(clc.white.bold(getFormatDate("yyyy-mm-dd hh:ii:ss")),
        clc.blue(filename?filename+'\r\n':''),clc.red.bold(msg));
};
module.exports={decDatetime,getFormatDate,info,warn,error};
