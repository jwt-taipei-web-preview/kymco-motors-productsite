'use strict';
/*eslint-disable new-cap, no-unused-vars,
	no-use-before-define, no-trailing-spaces, space-infix-ops, comma-spacing,
	no-mixed-spaces-and-tabs, no-multi-spaces, camelcase, no-loop-func,no-empty,
	key-spacing ,curly, no-shadow, no-return-assign, no-redeclare, no-unused-vars,
	eqeqeq, no-extend-native, quotes , no-inner-declarations*/
/*global  $, Hammer */
var app = {};
app.partials = {};
app.modules = {};

// var dayOfMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

// 網址為 gulp 或者 github 時 設定成debug 模式
var debug = /localhost[:]9000|github.io/.test(location.href);
var github = /github.io/.test(location.href);
var rootPath = github ? '/kymco-motors-productsite/' : '/';
if(/localhost[:]9000/.test(location.href)){
	$('.logo a').attr('href','/');
}else if(github){
	$('.logo a').attr('href','/kymco-motors-productsite/');
	$(function(){
		$('.kv figure').each(function(i,d){
			if($(this).attr('data-src')){
				$(this).attr('data-src', $(this).attr('data-src').replace(/img\//ig,'/kymco-motors-productsite/img/'));
			}
		});
	});
}

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
	function updateContent(content){

		$(content).each(function(i, element){
			if($(element).attr('role') === 'main'){
				$('#content .inner').html(element);
			}
		});
		
	}
	function pushState(content, cat, cata){
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

	var kvkeep = $('.kv.keep');

	$('header nav.menu li[data-content]').on('click', function(){

		var content = rootPath + $(this).attr('data-content'), cat = $(this).attr('data-cat'), cata = $(this).attr('data-cata');
		console.log(content);
		$.get(content + '?_=' + (new Date() * 1), function(cont){
			updateContent(cont);
			pushState(content, cat, cata);
			$('#content .inner a').on('click', function(){
				content = $(this).attr('data-content');
				cat = $(this).attr('data-cat');
				cata = $(this).attr('data-cata');
				$.get($(this).attr('data-content'), function(product){
					updateContent(product);
					// console.log(content, cat, cata);
					pushState(content, cat, cata);
				});
			});
			changeViewport('inner-page');
		});

		kvFreeze();

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
			pushState('/', null, null);
		}, 750);
	});

	$('.expand-page').on('click', function(){
		//點擊主選單空白區塊的動作
		if($(this).hasClass('on')){
			changeViewport('inner-page-short');
			$(this).removeClass('on');
		}else{
			changeViewport('page-expand');
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
		var currentKv = $('.kv.slide .slick-current figure').css('background-image');

		$('figure', kvkeep).css('background-image', currentKv);
		kvkeep.removeClass('hide');
		$('.kv.slide').slick('unslick');
		$('header nav.menu li').removeClass('active');
		$(this).addClass('active');
		$(this).parents('aside').addClass('on').siblings().removeClass('on');
		$('header').removeClass('on');
	}
	//

	if(getParam('content') && getParam('cat') && getParam('cata')) {
		// $('header nav li[data-cata='+getParam('cata')+']').trigger('click');
		var content = rootPath + getParam('content'), cat = getParam('cat'), cata = getParam('cata');
		// console.log(content);
		$.get(content, function(product){
			updateContent(product);
			pushState(content, cat, cata);
			kvFreeze();
			if(cat){
				bindCatalogLink();
			}
		});
		changeViewport('inner-page');

	}
	$(window).on('popstate', function(r,g,b){
		var info = r.originalEvent.state;
  		console.log(info);
		$.get(info.content, function(product){
			updateContent(product);
			kvFreeze();
			if(info.category){
				bindCatalogLink();
			}
		});
	});

	function bindCatalogLink(){

		$('#content .inner a').on('click', function(){
			content = rootPath + $(this).attr('data-content');
			console.log(content);
			cat = $(this).attr('data-cat');
			cata = $(this).attr('data-cata');
			$.get(content, function(product){
				updateContent(product);
				// console.log(content, cat, cata);
				pushState(content, cat, cata);
			});
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


