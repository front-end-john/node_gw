import rangeArray from "./rangeArray";

test("test map perform",()=>{
    let map=new Map();
    console.time("map perform");
    rangeArray(0,1000).forEach((item,index)=>{
        map.set(item,index);
    });
    console.timeEnd("map perform");
});

test("test object perform",()=>{
    let obj={};
    console.time("object perform");
    rangeArray(0,1000).forEach((item,index)=>{
        obj[item]=index;
    });
    console.timeEnd("object perform");
});

