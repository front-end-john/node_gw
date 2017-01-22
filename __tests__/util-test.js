//import expect from "expect";
import {decDatetime} from '../src/jsj/js/util';


test("test util in weixinjsjs",()=>{
    let testList=[null, 0,"",undefined];
    testList.forEach((item,index)=>{
        let {year,month,day,hour,minute} = decDatetime(item);
        if(index==0){
            console.log({year,month,day,hour,minute});
        }else if(index==1){
            console.log({year,month,day,hour,minute});
        }else if(index==2){
            console.log({year,month,day,hour,minute});
        }else if(index==3){
            console.log({year,month,day,hour,minute});
        }
    });
});
