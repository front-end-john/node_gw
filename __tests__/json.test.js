let randomjson = require("randomjson");
const clc = require('cli-color');
let error = clc.red.bold;
let warn = clc.yellow;
let notice = clc.blue;

test("randomjson test",()=>{
    let modelJson = {
        "code": "00",
        "numberCode": "<@[10000,20000]>",
        "msg2": "<@string{2,3}>",
        "logo": "<@image{100,100}>",
        "result": {
            "pList<@{2,3}>":[
                {
                    "indexToString": "<@index><@>",
                    "index": "<@index>",
                    "id": "<@[1-5]>",
                    "price": "<@float>",
                    "name": "name<@index>",
                    "person": "person<@index>",
                    "address": "California NO.<@index>",
                    "mobile": "1<@number{10}>",
                    "tel": "<@number{4}>-<@number{8}>",
                    "list": [
                        {
                            "auditKey": 1,
                            "auditValue": "<@[0,1,2]>"
                        },
                        {
                            "auditKey": 2,
                            "auditValue": "<@[0,1,2]>"
                        }
                    ]
                }
            ]
        }
    };
    let myJson = randomjson(modelJson);
    console.log(notice(JSON.stringify(myJson, null,2)));
});