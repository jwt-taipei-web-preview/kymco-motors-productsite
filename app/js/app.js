'use strict';
/*eslint-disable new-cap, no-unused-vars,
	no-use-before-define, no-trailing-spaces, space-infix-ops, comma-spacing,
	no-mixed-spaces-and-tabs, no-multi-spaces, camelcase, no-loop-func,no-empty,
	key-spacing ,curly, no-shadow, no-return-assign, no-redeclare, no-unused-vars,
	eqeqeq, no-extend-native, quotes , no-inner-declarations*/
/*global  $, Hammer, TweenMax */
var app = {};
app.partials = {};
app.modules = {};

// var dayOfMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

// 網址為 gulp 或者 github 時 設定成debug 模式
var debug = /localhost[:]9000|github.io/.test(location.href);
var github = /github.io/.test(location.href);
var rootPath = github ? '/kymco-motors-productsite/' : '/';
$('.logo a').attr('href',rootPath);
$.get($('.logo a img'). attr('src'), function(svg){
	$('.logo a').html($('svg', svg));
});
$(function(){
	$('.kv figure[data-src]').each(function(i,d){
		$(this).attr('data-src', rootPath + $(this).attr('data-src'));
	});
});
//分享按鈕
var share = {
	facebook: function(href, title){
		href = encodeURIComponent(href || location.href + '?utm_source=facebook&utm_medium=fbshare_m&utm_campaign=roseanni');
		title = encodeURIComponent(title || document.title);
		window.open('https://www.facebook.com/sharer.php?u='+href+'&amp;t='+title);
	},
	googleplus: function(href){
		href = encodeURIComponent(href || location.href + '?utm_source=g+&utm_medium=fbshare_m&utm_campaign=roseanni');
		window.open('https://plus.google.com/share?url=' + href,'', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
	},
	email: function(href, title){
		href = encodeURIComponent(href || location.href + '?utm_source=email&utm_medium=fbshare_m&utm_campaign=roseanni');
		title = encodeURIComponent(title || document.title);
		var body = encodeURIComponent(''+href+' #' +title+'');
		window.open('https://mail.google.com/mail/?view=cm&fs=1&to=&su=與你分享:'+title+'&body='+body+'&bcc=');
	}
};


$(function(){

    // 定義modules
	$.each(app.modules, function(name, init){
		init();
    });

    // 定義每個section
	$.each(app.partials, function(name, init){
		init();
    });



	//觸發第一次調整頁面尺寸
	$(window).trigger('resize');




	//選單箭頭
	$.get((github?'/kymco-motors-productsite/img/nav/caret.svg':'/img/nav/caret.svg'), function(r){
		$('svg', r).appendTo($('header nav.menu aside >a'));
	});
	$('[data-icon]').each(function(i,d){
		$.get($(d).attr('data-icon'), function(r){
			$('svg', r).appendTo($(d));
		});

	});


	//選單與內容切換模式
	var containerClasses = 'container';
	function changeViewport(stat){
		$('.' + containerClasses).attr('class', containerClasses + ' ' + stat);
	}
	function updateContent(content, cat, cata, callback){
		if(content === '/'){
			$('.expand').trigger('click');
			return false;
		}
		pushState(content, cat, cata);
		$('#content').addClass('fade').removeClass('in');

		$.get(content, function(product){

			$(product).each(function(i, element){
				if($(element).attr('role') === 'main'){
					$('#content .inner').html(element);
				}
			});

			$('#content').addClass('in').removeClass('fade');

			kvFreeze();

			if(typeof callback == 'function'){
				callback();
			}

			if(/catalog/ig.test(content)){
				bindCatalogLink();
			}
			TweenMax.to('#content .inner', 0.5, {
				scrollTop: 0
			});
		});
		var currentViewPort = 'inner-page';
		if($('.container.page-expand').length){
			currentViewPort = 'page-expand';
		}
		switch(cat){
			case 'worldwide':
			case 'about-us':
				changeViewport(currentViewPort + ' show-nav-about');
				break;
			default:
				changeViewport(currentViewPort);
				break;
		}
		
	}
	function pushState(content, cat, cata){
		console.log(content);
        history.pushState({
          content: content,
          category: cat,
          catalog: cata
        }, document.title, content);
	}
	function getParam(name){
		var r = new RegExp('^.*[?&]'+name+'[=]([^&]+).*$', 'i');
		if(!r.test(location.search)){
			return null;
		}
		var value = location.search.replace(r,'$1');
		return decodeURIComponent(value);
	}

	var kvkeep = $('.kv .keep');

	$('header nav.menu li[data-content]').on('click', function(){

		var content = rootPath + $(this).attr('data-content') + '/', cat = $(this).attr('data-cat'), cata = $(this).attr('data-cata');
		// console.log(content);
		updateContent(content, cat, cata, function(){

			$('#content .inner a').on('click', function(){
				var cont2 = $(this).attr('data-content'),
					cat2 = $(this).attr('data-cat'),
					cata2 = $(this).attr('data-cata');
				updateContent(content, cat, cata);
			});
		});

	});

	$('header nav.about a[data-content]').on('click', function(){

		var content = rootPath + $(this).attr('data-content') + '/', cat = $(this).attr('data-cat');
		// console.log(content);
		updateContent(content, cat, null, function(){
			switch(cat){
				case 'worldwide':
					prepareMap();
					break;
				case 'about-us':
					// prepareMap();
					break;
			}
		});

	});

	$('.expand').on('click', function(){
		//點擊主選單空白區塊的動作
		$('header nav.menu li').removeClass('active');
		$('header nav.menu aside').removeClass('on');
		changeViewport('menu-expand');
		setTimeout(function(){
			$('.kv .slide').slick({
				dots: false,
				fade: true,
				arrows: false,
				speed: 750,
				autoplay: true,
				pauseOnFocus: false,
				pauseOnHover: false,
				autoplaySpeed: 6000,
				initialSlide: kvkeep.attr('data-index')
			});
			kvkeep.addClass('hide');
			pushState(rootPath, null, null);
		}, 750);
	});

	$('.expand-page').on('click', function(){
		var append = '';
		if($('.show-nav-about').length){
			append = ' show-nav-about';
		}
		//點擊主選單空白區塊的動作
		if($(this).hasClass('on')){
			changeViewport('inner-page-short' + append);
			$(this).removeClass('on');
		}else{
			changeViewport('page-expand' + append);
			$(this).addClass('on');
		}
	});

	$('header nav.menu >aside >a').each(function(i, ele){
		var item = new Hammer(ele, {});
		item.on('tap', function () {
			$(ele).parent().toggleClass('on').siblings().removeClass('on');
		});
	});

	var burger = new Hammer($('.burger-container')[0], {});
	burger.on('tap', function(){
		$('header').toggleClass('on');
	});

	//預載圖片
	var imagePreload = {}, background = {};
	$('figure[data-src]').each(function(idx, ele){
		if($(ele).attr('data-src')){
			imagePreload[$(ele).attr('data-src')] = false;
			background[$(ele).attr('data-src')] = ele;
		}
	});

	$.each(imagePreload, function(src, stat){
		var img = new Image();
		img.onload = function(){
			imagePreload[src] = true;
			var alldone = true;
			$.each(imagePreload, function($s, $done){
				alldone = $done && alldone;
			});

			//載入後 加到背景
			$(background[src]).css('background-image', 'url(' + src + ')');

			if(alldone){
				//全部圖片下載完成
				imageLoaded();
			}
		};
		img.src = src;
	});

	function imageLoaded(){
		$.each(imagePreload, function(src, stat){
			$(background[src]).css('background-image', 'url(' + src + ')');
		});
		var litMotor = $('.blend').prev();
		$('.blend').css('background-image',
			'url(' + $('.blend').attr('data-src') + '), url(' + $(litMotor).attr('data-src') + ')');
	}

	//點擊主選單後動作
	function kvFreeze(){
		var currentKv = $('.kv .slide .slick-current figure');
		var index = $('.kv .slide .slick-current').index();
		var backgroundImage = currentKv.css('background-image') != 'none' ?
			currentKv.css('background-image') :
			'url(' + currentKv.attr('data-src') + ')';
		// console.log(backgroundImage);
		kvkeep.css('background-image', backgroundImage);
		kvkeep.attr('data-index', index);
		kvkeep.removeClass('hide');
		$('.kv .slide').slick('unslick');
		$('header nav.menu li').removeClass('active');
		$(this).addClass('active');
		$(this).parents('aside').addClass('on').siblings().removeClass('on');
		$('header').removeClass('on');
	}
	//

	if(getParam('content') && getParam('cat') && getParam('cata')) {
		// $('header nav li[data-cata='+getParam('cata')+']').trigger('click');
		var content = rootPath + getParam('content') + '/', cat = getParam('cat'), cata = getParam('cata');
		// console.log(content);
		var src = 'url(' + $('.kv .slide li:eq(0) figure').attr('data-src') + ')';
		setTimeout(function(){
			$('.kv .keep').css('background-image', src );	
		}, 500);
		updateContent(content, cat, cata);		

	}

	//Worldwide direct link handle
	if(getParam('content') === 'worldwide' && getParam('cat') === 'worldwide') {
		var content = rootPath + getParam('content') + '/', cat = getParam('cat');
		// console.log(content);
		var src = 'url(' + $('.kv .slide li:eq(0) figure').attr('data-src') + ')';
		setTimeout(function(){
			$('.kv .keep').css('background-image', src );	
		}, 500);
		updateContent(content, cat, null, function(){
			prepareMap();
		});		
	}
	//about-us direct link handle
	if(getParam('content') === 'about-us' && getParam('cat') === 'about-us') {
		var content = rootPath + getParam('content') + '/', cat = getParam('cat');
		// console.log(content);
		var src = 'url(' + $('.kv .slide li:eq(0) figure').attr('data-src') + ')';
		setTimeout(function(){
			$('.kv .keep').css('background-image', src );	
		}, 500);
		updateContent(content, cat, null, function(){
			// prepareMap();
		});		
	}


	$(window).on('popstate', function(r,g,b){
		var info = r.originalEvent.state;
  		if(info === null){
  			location.href = rootPath;
  		}

		updateContent(info.content, info.cat, info.cata);
	});

	function bindCatalogLink(){
		$('#content .inner a:not(.top)').on('click', function(){
			content = rootPath + $(this).attr('data-content') + '/';
			// console.log(content);
			cat = $(this).attr('data-cat');
			cata = $(this).attr('data-cata');
			updateContent(content, cat, cata);
		});
		$('#content .inner a.top').on('click', function(){
			TweenMax.to('#content .inner',0.3,{scrollTop: 0});
			return false;
		});
	}
	function prepareMap(){

		$('.map .place').each(function(){
			var x = $(this).attr('data-x') * 1,
				y = $(this).attr('data-y') * 1;
			$(this).css('margin', (y / 9.3) + '% 0 0 ' + (x / 9.3) + '%');
		}).on('click', function(){
			$(this).addClass('on').siblings().removeClass('on');
			$('.map-container .place-info').eq($(this).index()).addClass('on').siblings().removeClass('on');
		}).on('mouseover', function(){
			$(this).addClass('on').siblings().removeClass('on');
			$('.map-container .place-info').eq($(this).index()).addClass('on').siblings().removeClass('on');
		}).on('mouseoout', function(){
			$(this).addClass('on').removeClass('on');
			$('.map-container .place-info').eq($(this).index()).removeClass('on');
		});
	}
});




//判斷是否具有屬性
$.fn.hasAttr = function(attributeName){
	var attr = $(this).attr(attributeName);
	if (typeof attr !== typeof undefined && attr !== false) {
		return true;
	}else{
		return false;
	}
};


