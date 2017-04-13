const fs=require("fs");


test("fs.readFileSync test",()=>{
    try{
        let res=fs.readFileSync("public/duck/additional/www/main.html","utf-8");
        console.log(res)
    }catch(e){
       console.error(e)
    }
});
