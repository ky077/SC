$(function(){
	$('.top').prepend('<div class="topTool">'+
						  '<div class="topTool-content">'+
                            '<a href="setLang.html" class="btn-back backLang"><small>Language</small></a>'+
							'<a href="bookPanel.html" class="btn-back backGrade">HOME</a> <a href="setTest.html" class="btn-back backSetTest"><small>Mic Test</small></a>'+
						 ' </div>'+
						  '<div class="topTool-arrow">'+
							'<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>'+
						  '</div>'+
					  '</div>');
	
	$('.top .topTool .topTool-arrow').click(function(){
		$('.topTool').toggleClass('active');
		$(this).html( ($(this).html() !='<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>') ? '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>' : '<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>' );
	
	});
});
