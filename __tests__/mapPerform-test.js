/**
 * Created by 10667 on 2017/3/7.
 */

let rangeArray = (start, end) => Array(end - start + 1).fill(0).map((v, i) => i + start);
let map=new Map();
let obj={};
let test_arr=rangeArray(0,1000);

test("test map perform",()=>{
    console.time("map perform");
    test_arr.forEach((item,index)=>{
        map.set(item,index);
    });
    console.timeEnd("map perform");
});

test("test object perform",()=>{
    console.time("object perform");
    test_arr.forEach((item,index)=>{
        obj[item]=index;
    });
    console.timeEnd("object perform");
});

for (let item of obj){
    console.log(item);
}