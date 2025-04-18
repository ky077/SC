//星星旋轉
function rotateStar(el) {
  if (!el.hasClass('done')) {
    disableAll(); // 禁用所有互動

    el.addClass("done rotate");

    setTimeout(function () {
      el.removeClass("rotate");
      enableAll();
    }, 1000);
  }
}

//星星收合
function collectStar(fromEl, toEl) {
  if (!toEl.hasClass('done')) {
    $('html,body').animate({
      scrollTop: 0
    }, 500, function () {
      fromEl.find('.glyphicon-star').each(function () {
        let starImg = $(this);

        let starClone = starImg.clone().css({
          'position': 'absolute',
          'top': starImg.offset().top,
          'left': starImg.offset().left,
          'width': starImg.width(),
          'height': starImg.height(),
          'z-index': 999999999
        }).addClass('done').show();

        let box_top = toEl.find('.active .glyphicon-star').offset().top;
        let box_left = toEl.find('.active .glyphicon-star').offset().left;

        if ($(window).width() < 992) {
          box_top = $('.navbar-toggle').offset().top;
          box_left = $('.navbar-toggle').offset().left;
        }

        starClone.appendTo('body').animate({
          'top': box_top,
          'left': box_left,
          'width': 20,
          'height': 'auto',
		  'font-size': '1rem'
        }, {
          duration: 500,
          complete: function () {
            starClone.wrap('<div class="rotate"></div>');
            setTimeout(function () {
              starClone.remove();
              toEl.find('.active').addClass('done');
            }, 1000);
          }
        });
      });
    });
  }
}

//禁用所有互動
function disableAll() {
  $('button, a').prop('disabled', true); // 禁用所有按鈕(禁onclick?)
  $('body').addClass('no-scroll'); // 禁用滾動
  $(window).on('scroll.disable mousewheel.disable DOMMouseScroll.disable', function (e) {
    e.preventDefault();
    return false;
  });
}

//恢復所有互動
function enableAll() {
  $('button').prop('disabled', false); // 啟用所有按鈕
  $('.dialog-guess-btn').find('span').parent('.dialog-guess-btn').prop('disabled', true); //dialog-guess-btn [?] 不能按
  $('body').removeClass('no-scroll'); // 恢復滾動
  $(window).off('scroll.disable mousewheel.disable DOMMouseScroll.disable');
}


//計算pageBlock星星 [demo]
function pageStar(el) {
  let $parent = el.parents('.pageBlock');

  let index = $parent.index();

  let startLength = $parent.find('.glyphicon-star').length;
  let doneLength = $parent.find('.done').length;

  if (startLength === doneLength) {
    setTimeout(function () {
      $("html,body").animate({scrollTop: 0}, 500, function () {
        rotateStar($('.stepMenu li').eq(index));
      });
    }, 1000); //延遲1秒 

  }
}

//計算article星星 [demo]
function articleStar(el) {
  let $parent = el.parents('.artical');

  let startLength = $parent.find('.glyphicon-star').length;
  let doneLength = $parent.find('.done').length;

  if (startLength === doneLength) {
    setTimeout(function () {
      $("html,body").animate({scrollTop: 0}, 500, function () {
        rotateStar($('.stepMenu li').eq(1));
      });
    }, 1000); //延遲1秒 

  }
}


//計算練習字詞星星 [demo]
function CWStar() {
  let $parent = $('.stepMenu');

  let startLength = $parent.find('.glyphicon-star').length;
  let doneLength = $parent.find('.done').length;

  if (startLength === doneLength) {
    setTimeout(function () {
      $("html,body").animate({ scrollTop: 0}, 500, function () {
        rotateStar($('[class*="btn-CW"].active'));
      });
    }, 1000); //延遲1秒 	
  }
}


//計算navigation星星 [demo]
function navStar(el) {
  let $parent = el || $('.stepMenu');

  let startLength = $parent.find('.glyphicon-star').length;
  let doneLength = $parent.find('.done').length;

  if (startLength === doneLength) {  
	//滑動到.navigation .ative頁籤  
	navSlide();
	  
    collectStar($parent, $('.navigation'));
  }
}

//滑動到.navigation .ative頁籤
function navSlide() {
	let $active = $('.content .navigation > ul li.active');
	let $container = $('.content .navigation > ul');
	let targetScrollLeft = $active.offset().left - $container.offset().left + $container.scrollLeft();

	$('.content .navigation > ul').animate({
	  scrollLeft: targetScrollLeft
	}, 800);
}	
