'use strict';
/*eslint-disable new-cap, no-unused-vars,
	no-use-before-define, no-trailing-spaces, space-infix-ops, comma-spacing,
	no-mixed-spaces-and-tabs, no-multi-spaces, camelcase, no-loop-func,no-empty,
	key-spacing ,curly, no-shadow, no-return-assign, no-redeclare, no-unused-vars,
	eqeqeq, no-extend-native, quotes , no-inner-declarations*/
/*global  $ */
var app = {};
app.partials = {};
app.modules = {};

// var dayOfMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

// 網址為 gulp 或者 github 時 設定成debug 模式
var debug = /localhost[:]9000|nelson119.github.io/.test(location.href);

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


	//分享按鈕


	//選單箭頭
	$.get('img/nav/caret.svg', function(r){
		$('svg', r).appendTo($('header nav.menu aide >a'));
	});


	//選單與內容切換模式
	var containerClasses = 'container';
	function changeViewport(stat){
		$('.' + containerClasses).attr('class', containerClasses + ' ' + stat);
	}

	var kvkeep = $('.kv.keep');

	$('header nav.menu li').on('click', function(){
		//點擊主選單後動作
		var currentKv = $('.kv.slide .slick-current figure').css('background-image');
		console.log(currentKv);
		$('figure', kvkeep).css('background-image', currentKv);
		kvkeep.removeClass('hide');
		$('.kv.slide').slick('unslick');
		setTimeout(function(){
			changeViewport('inner-page');
		}, 10);

		$('header nav.menu li').removeClass('active');
		$(this).addClass('active');
		$(this).parents('aside').addClass('on').siblings().removeClass('on');

	});
	$('.expand').on('click', function(){
		//點擊主選單空白區塊的動作
		$('header nav.menu li').removeClass('active');
		$('header nav.menu aside').removeClass('on');
		changeViewport('menu-expand');
		setTimeout(function(){
			$('.kv.slide').slick({
				dots: false,
				fade: true,
				arrows: false,
				autoplay: true,
				autoplaySpeed: 10000
			});
			kvkeep.addClass('hide');
		}, 750);
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
	//
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


