var headerObject = {
	init: function(){
	    $('.nav').css('height',$(window).height());
	    $('.nav').click(function(){
	        $(document.body).removeClass('noScroll');
	        $('.nav').removeClass('show');
	        $(document.body).attr('data-open','0');
	    });

	    $('.nav a').click(function(e){
	       e.stopPropagation();
	    });

	    $('.partuser-icn').click(function(){
	    	
	        var open = $(document.body).attr('data-open');
	        console.log(open);
	        if(open == 0 ){
	            $(document.body).addClass('noScroll');
	            $('.nav').addClass('show');
	            $(document.body).attr('data-open','1');
	        }else if(open == 1){
	            $(document.body).removeClass('noScroll');
	            $('.nav').removeClass('show');
	            $(document.body).attr('data-open','0');
	        }
	    });
	    $('#show-nav').click(function(){
	    	
	        var open = $(document.body).attr('data-open');
	        console.log(open);
	        if(open == 0 ){
	            $(document.body).addClass('noScroll');
	            $('.nav').addClass('show');
	            $(document.body).attr('data-open','1');
	        }else if(open == 1){
	            $(document.body).removeClass('noScroll');
	            $('.nav').removeClass('show');
	            $(document.body).attr('data-open','0');
	        }
	    });
	},
	judePcOrMobile:function(){		
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
	headerObject.init();//初始化菜单头部和菜单条方法；
	headerObject.judePcOrMobile();//判断pc或者移动版进行跳转链接;
	$('.nav-ul li').click(function(){
		var index = $(this).index();
		if(index == 0){
			window.location.href = '/index';
		}else if(index == 1){
			window.location.href = '/comment';
		}else if(index == 2){
			window.location.href = '/history';
		}else if(index == 3){
			window.location.href = '/contact';
		}
	});
});