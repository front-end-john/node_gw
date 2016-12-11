var aboutusObject = {
	init: function(){
		var type = getQueryString('type');
		$('.part').hide();
		var id = '#' + type;
		$(id).show();
		var ids = '#' + type +'-type';
		$('.choice-block p').removeClass('on');
		$(ids).addClass('on');
	}
}
$(function(){
	aboutusObject.init();

	$('.choice-block p').click(function(){
		$('.choice-block p').removeClass('on');
		$(this).addClass('on');
		var id = '#'+$(this).attr('data-type');
		$('.part').hide();
		$(id).show();
	});
});