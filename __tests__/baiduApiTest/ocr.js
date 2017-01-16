let fetch = require('node-fetch');
let fs = require('fs');
const APPID="9202785";
const APIKEY="0lY7a494lfKfWh9mlVKAGQHb";
const SECRETKEY="p5hErZhQz0RbbQBq6BM9ggxy17cGclQH";
const access_token='24.33f8a2cc67a1b67fde7934d580240752.2592000.1486952744.282335-9202785';

//let body = { grant_type:"client_credentials",client_id:APIKEY,client_secret:SECRETKEY};
let url="https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id="+
    APIKEY+"&client_secret="+SECRETKEY;
/**
 * 获取access_token
 */
/*fetch(url, {
    method: 'POST'
}).then((res)=>{
        console.log(res.status);
        return res.json();
    }).then((json)=>{
    console.log(json);
}).catch((e)=>{
    console.log(e)
});*/

/**
 * 图片文字识别
 */
/*let bitmap = fs.readFileSync("pic.png");
let base64=new Buffer(bitmap).toString('base64');
//console.log(base64);
let FormData = require('form-data');
let form =new FormData();
form.append("image",base64);
url="https://aip.baidubce.com/rest/2.0/ocr/v1/general?access_token="+ access_token;
fetch(url, {
    method: 'POST',
    body:form
}).then((res)=>{
    console.log(res.status);
    return res.json();
}).then((json)=>{
    console.dir(json);
}).catch((e)=>{
    console.dir(e);
});*/
url="https://aip.baidubce.com/rpc/2.0/nlp/v1/wordpos?access_token="+ access_token;

let iconv=require("iconv-lite");

let query="返回两个词的相似度";

console.log(query.toString());
fetch(url, {
    method: 'POST',
    body:JSON.stringify({query})
}).then((res)=>{
    console.log(res.status);
    return res.json();
}).then((json)=>{
    let arr=json.result_out;
    for(let i=0,len=arr.length;i<len;i++){
        let str=iconv.encode(arr[i].word,"utf8");
        console.log(str.toString());
    }

}).catch((e)=>{
    console.log(e)
});
