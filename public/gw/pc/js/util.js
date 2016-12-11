var FBT = 'https://m.feibotong.com';
var judePcOrMoblie = {
	init: function(){
	  var sUserAgent = navigator.userAgent.toLowerCase();
      var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
      var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
      var bIsMidp = sUserAgent.match(/midp/i) == "midp";
      var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
      var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
      var bIsAndroid = sUserAgent.match(/android/i) == "android";
      var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
      var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
      if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
        //window.location.href="http://m.feibotong.com";
      } else {
        //window.location.href="http://www.feibotong.com";
      }
	}
}

$(function(){
	judePcOrMoblie.init();
});

// 获取根据key值   获取页面参数
function getQueryString(name) { 
	// 如果链接没有参数，或者链接中不存在我们要获取的参数，直接返回空 
	if(location.href.indexOf("?")==-1 || location.href.indexOf(name+'=')==-1) { 
		return ''; 
	} 
	// 获取链接中参数部分 
	var queryString = location.href.substring(location.href.indexOf("?")+1); 
	// 分离参数对 ?key=value&key2=value2 
	var parameters = queryString.split("&"); 
	var pos, paraName, paraValue; 
	for(var i=0; i<parameters.length; i++) { 
		// 获取等号位置 
		pos = parameters[i].indexOf('='); 
		if(pos == -1) { continue; } 
		// 获取name 和 value 
		paraName = parameters[i].substring(0, pos); 
		paraValue = parameters[i].substring(pos + 1); 
		// 如果查询的name等于当前name，就返回当前值，同时，将链接中的+号还原成空格 
		if(paraName == name){ 
			return unescape(paraValue.replace(/\+/g, " ")); 
		} 
	} 
	return ''; 
}; 



/*提示框封装*/
function warning(msg){
    $.tips({
        content: msg,
        stayTime: 2000,
        type: "warn"
    });
}


/*检测是否为正确的车牌号*/
function check_carno(carno) {
    var provinces = "京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼测";
    carno = carno.toUpperCase();
    if (carno.match(/^粤Z[A-Z\d]{4}[澳港]{1}$/)){
        return true;
    }
    if (carno.length != 7) {
        return false;
    }
    if (provinces.indexOf(carno[0]) == -1) {
        return false;
    }
    if (!carno.substr(1).match(/^[A-Z\d]{6}$/)) {
        return false;
    }
    return true;
}

/*检测是否是正确的电话号码*/
function validateMobile(mobile) { 
    if(mobile.length==0) {  
      return false; 
    }     
    if(mobile.length!=11) {  
       return false; 
    } 
    var myreg = /^(((1[3|4|5|7|8][0-9]{1}))+\d{8})$/;
    if(!myreg.test(mobile)) { 
       return false; 
    } 
    return true;
}

function isWeiXin(){
    var ua = window.navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i) == 'micromessenger'){
        return true;
    }else{
        return false;
    }
}


function longToYYYYMMDDHHMM(date) {
    if (date > 0) {
        date = date * 1000
        var d = new Date(date);
        var year = d.getFullYear();
        var month = (d.getMonth() + 1);
        var day = d.getDate();
        var hour = d.getHours();
        var minute = d.getMinutes();
        return year + "-" + (month < 10 ? '0' + month : month) + "-"
                + (day < 10 ? '0' + day : day)+" "+(hour < 10 ? '0' + hour : hour)+
                ":"+(minute < 10 ? '0' + minute : minute);
    } else {
        return "";
    }
}

function StringBuffer() {
    this.__strings__ = new Array();
}
StringBuffer.prototype.append = function (str) {
    this.__strings__.push(str);
    return this;    //方便链式操作
}
StringBuffer.prototype.toString = function () {
    return this.__strings__.join("");
}