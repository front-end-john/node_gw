test("test es6 promise",()=>{
    let p1=new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve('i am p1');
        },2000);
    });
    let p2=new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve('i am p2');
        },1000);
    });
    console.log(new Date());
    Promise.all([p1, p2]).then((res)=>{
        console.log(res);
        console.log(new Date());
    });
});