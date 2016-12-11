
 function setMyCookie(cookieName, cookieValue, nDays) {	 
	 delCookie(cookieName);
    /*当前日期*/
    var today = new Date();
    /*Cookie过期时间*/
    var expire = new Date();
     /*如果未设置nDays参数或者nDays为0，取默认值1*/
    if(nDays == null || nDays == 0) nDays = 1;
     /*计算Cookie过期时间*/
    expire.setTime(today.getTime() + 3600000 * 24 * nDays);
     /*设置Cookie值*/
    document.cookie = cookieName + "=" + escape(cookieValue) + ";expires=" + expire.toGMTString();
    //document.cookie = cookieName + "=" + escape(cookieValue) + ";expires=" + expire.toGMTString();
 }

/*
function getMyCookie(cookieName) {
    var theCookie = "" + document.cookie;
    var ind = theCookie.indexOf(cookieName);
    if(ind==-1 || cookieName=="") return "";
    var ind1 = theCookie.indexOf(';',ind);
    if(ind1==-1) ind1 = theCookie.length;
    return unescape(theCookie.substring(ind+cookieName.length+1,ind1));
}*/

function getMyCookie(name){
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}

//写cookies
function setCookie(c_name, value, expiredays) {
    setMyCookie(c_name, value, expiredays)
}

//读取cookies
function getCookie(name) {
    return getMyCookie(name);
}

//删除cookies
function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null)
        document.cookie = name + "=" + escape(cval) + ";expires=" + exp.toGMTString();
}
