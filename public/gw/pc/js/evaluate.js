var evaluateDate = {
	init:function(page,pagesize){
		var commentList;
		var data = {
            offset: page,
            pagesize: pagesize
        }
		$.ajax({
			method: "POST",
			url: FBT+"/api3/comments/list",
			data: data,
			dataType: "jsonp",
			success:function(data){
				if(data.code == 0){
					commentList = data.records;
					$('#commentList li').remove();
					if(commentList.length > 0){
						for(var i=0;i<commentList.length;i++){
							$('#commentList').append(evaluateDate.appendLi(commentList[i]));
							$('.lazy').lazyload();
						}
					}
					if(commentList.length >= 20){
                        $('#loadMoreComment').css('display','block');
                        $('#nomoreData').css('display','none');
                    }else {
                        $('#loadMoreComment').css('display','none');
                        $('#nomoreData').css('display','block');
                    }   
				}
			}
		});
	},
	appendLi:function(data){
		var htmlStr = new StringBuffer();
		htmlStr.append('<li>');		
		htmlStr.append('<div class="top">');
		htmlStr.append('<div class="avatar">');
		htmlStr.append('<img class="lazy" src="/gw/pc/images/evaluate/icn_user_logo.png" data-original="'+data.useravatar+'"/>');
		htmlStr.append('<img class="cover" src="/gw/pc/images/evaluate/icn_img_border.png" />');
		htmlStr.append('</div>');
		htmlStr.append('<div class="name">');
		htmlStr.append('<p>'+data.usercall+'</p>');
		htmlStr.append('<span>'+data.city+'</span>');
		htmlStr.append('</div>');
		htmlStr.append('<p>'+longToYYYYMMDDHHMM(data.commenttime)+'</p>');
		htmlStr.append('</div>');
		htmlStr.append('<div class="detail">');
		htmlStr.append('<div class="star-block">');
		htmlStr.append('<p>评价星级：</p>');
		htmlStr.append(evaluateDate.getStarString(data.servicescore));
		htmlStr.append('</div>');
		htmlStr.append('<p class="comment-p">'+data.content+'</p>');
		htmlStr.append(evaluateDate.getSeriveComment(data.responsecontent,data.responsetime));
		htmlStr.append('</div>');		
		htmlStr.append('</li>');
		return htmlStr.toString();
		
	},
	getStarString:function(servicescore){
		var htmlStr = new StringBuffer();
		htmlStr.append('<span>');	
		for(var i=0;i<servicescore;i++){
			htmlStr.append('<img src="/gw/pc/images/evaluate/icn_star_on.png"/>');
		}
		for(var j=5;j>servicescore;j--){
			htmlStr.append('<img src="/gw/pc/images/evaluate/icn_star.png"/>');
		}
		htmlStr.append('</span>');
		return htmlStr.toString();
	},
	getSeriveComment:function(responsecontent,responsetime){
		var htmlStr = new StringBuffer();
		if(responsecontent){
			htmlStr.append('<div class="service-comment">');
			htmlStr.append('<img class="icn-up" src="/gw/pc/images/evaluate/icn_xs.png"/>');
			htmlStr.append('<span>');
			htmlStr.append('<em>飞泊通：</em>');
			htmlStr.append('<p>'+responsecontent+'</p>');
			htmlStr.append('</span>');
			htmlStr.append('<p class="return-time">'+longToYYYYMMDDHHMM(responsetime)+'</p>');
			htmlStr.append('</div>');
		}
		
		return htmlStr.toString();
	},
	loadmoreData: function(offset,num){
		var commentList;
		var data = {
            offset: offset,
            pagesize: num
        }
		$.ajax({
			method: "POST",
			url: FBT+"/api3/comments/list",
			data: data,
			dataType: "jsonp",
			success:function(data){
				if(data.code == 0){
					commentList = data.records;
					console.log(commentList);
					if(commentList.length > 0){
						for(var i=0;i<commentList.length;i++){
							$('#commentList').append(evaluateDate.appendLi(commentList[i]));
						}
						$('.lazy').lazyload();
					}
					if(commentList.length >= 20){
                        $('#loadMoreComment').css('display','block');
                        $('#nomoreData').css('display','none');
                    }else {
                        $('#loadMoreComment').css('display','none');
                        $('#nomoreData').css('display','block');
                    }   
				}
			}
		});
	}
}

$(function(){
	evaluateDate.init(1,20);
	$('.lazy').lazyload();
	$('#loadMoreComment').click(function(){
		var nowPage = Math.floor($(this).attr('data-page'));
        nowPage++;
        var offset = (nowPage-1)*20 + 20;
        evaluateDate.loadmoreData(offset,20);
        $(this).attr('data-page',nowPage);
        $('.lazy').lazyload();
	});
});
