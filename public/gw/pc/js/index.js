

var bannerPage = {
	nowPage: 1,
	ints:null,
	objLength: 3,
	prev:function(){
		$('.js-partner-banner li').eq(this.nowPage-1).fadeOut();
		if(this.nowPage > 1){
			this.nowPage--;						
		}else {												
			this.nowPage = this.objLength;						
		}
		$('.js-partner-banner li').eq(this.nowPage-1).fadeIn();
		this.nowPageFouce();
	},
	next:function(){
		if(this.nowPage >= this.objLength){
			this.nowPage = 1;
			$('.js-partner-banner li').eq(this.objLength-1).fadeOut();			
		}else {
			$('.js-partner-banner li').eq(this.nowPage-1).fadeOut();
			this.nowPage++;						
		}
		$('.js-partner-banner li').eq(this.nowPage-1).fadeIn();
		this.nowPageFouce();
	},
	nowPageFouce:function(){
		$('.js-identification span').removeClass('on');
		$('.js-identification span').eq(this.nowPage-1).addClass('on');
	},
	autoChangePage:function(){
		if(this.nowPage >= this.objLength){
			this.nowPage = 0;
			this.next();
		}else{
			this.next();
		}
	},
	calculationBannerHeight:function(){
		var windowWidth = $(window).width();
		var minHeight = windowWidth/3;
		/*console.log(minHeight);
		$('.banner').css("height",minHeight);
		$('.js-prev').css("top",(minHeight-100)/2);
		$('.js-next').css("top",(minHeight-100)/2);*/
		$('.banner').css("height",minHeight);
		$('.js-prev').css("top",(minHeight-100)/2);
		$('.js-next').css("top",(minHeight-100)/2);
		$('.identification').show();
		
	},
	linkToPage:function(page){
		var pagesTotal = $('.js-partner-banner li').length;
		var index = page + 1;
		var jsClass = '.part'+index;
		if (index == 0) {return;};
		$("html,body").animate({scrollTop: $(jsClass).offset().top-10}, 1000);
	}
}


var parkUlChange = {
	timeObj: null,
	changePage:function(page){
		var nowPage = Math.floor($('#parkul').attr('data-now'));
		$('#parkul li').eq(nowPage).fadeOut();
		$('#parkul li').eq(page).fadeIn();
		$('#parkul').attr('data-now',page);
		$('.park-focue span').removeClass('on');
		$('.park-focue span').eq(page).addClass('on');
	},
	autoChangePage:function(){
		parkUlChange.next();
	},
	next:function(){
		var nowPage = Math.floor($('#parkul').attr('data-now'));
		var changeToPage = nowPage + 1;
		if(nowPage >= 7){
			changeToPage = 0;
		}
		$('#parkul li').eq(nowPage).fadeOut();
		$('#parkul li').eq(changeToPage).fadeIn();
		$('#parkul').attr('data-now',changeToPage);
		$('.park-focue span').removeClass('on');
		$('.park-focue span').eq(changeToPage).addClass('on');
	}
}

function userNumberCallBack(){
	console.log('callback');
}

var userNumber = {
	init: function(){
		var data = {
			callback: 'userNumberCallBack'
		}
		$.ajax({
			method: "POST",
			url: FBT+"/api3/system/usercount",
			data: data,
			dataType: "jsonp",
			success:function(data){
				if(data.code == 0){
					userNumber.changeNumberData(data.record.count);
				}
			}
		});
	},
	changeNumberData: function(num){
		var numBer = ''+num
		var arr = [0,0,0,0,0,0];
		for(var i = 0;i<numBer.length;i++){
		     arr[i] = numBer.substring(i,i+1);
		}

		$('.user-num img').remove();
		var imgSrc;
		for(var j=0;j<arr.length;j++){
			imgSrc = '/gw/pc/images/index/'+arr[j]+'.png';
			$('.user-num').append('<img src="'+imgSrc+'"/>');
		}
	}
}

$(function(){

	userNumber.init();

	bannerPage.ints=self.setInterval("bannerPage.autoChangePage()","3000");
	$('.banner').mouseenter(function(){
        window.clearInterval(bannerPage.ints);
    });

    $('.banner').mouseleave(function(){
    	bannerPage.ints=self.setInterval("bannerPage.autoChangePage()","3000");
    });

	$('.js-prev').click(function(){
		bannerPage.prev();
	});
	$('.js-next').click(function(){
		bannerPage.next();
	});
	$(window).resize(function(){
		location.replace(location);
	});
	bannerPage.calculationBannerHeight();



	$(window).resize(function(){
		location.replace(location);
	});



	$('.park-focue span').click(function(){
		var index = $(this).index();
		var nowPage = Math.floor($('#parkul').attr('data-now'));
		parkUlChange.changePage(index);
	});

	parkUlChange.timeObj = self.setInterval("parkUlChange.autoChangePage()","5000");

	$('#parkul').mouseenter(function(){
        window.clearInterval(parkUlChange.timeObj);
    });

    $('#parkul').mouseleave(function(){
    	parkUlChange.timeObj=self.setInterval("parkUlChange.autoChangePage()","5000");
    });
	
});