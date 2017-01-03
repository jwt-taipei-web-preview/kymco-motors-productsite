'use strict';
/*eslint-disable new-cap, no-unused-vars,
	no-use-before-define, no-trailing-spaces, space-infix-ops, comma-spacing,
	no-mixed-spaces-and-tabs, no-multi-spaces, camelcase, no-loop-func,no-empty,
	key-spacing ,curly, no-shadow, no-return-assign, no-redeclare, no-unused-vars,
	eqeqeq, no-extend-native, quotes , no-inner-declarations*/
/*global app */

app.partials.index = function () {};
//# sourceMappingURL=index.js.map

'use strict';
/*eslint-disable new-cap, no-unused-vars,
	no-use-before-define, no-trailing-spaces, space-infix-ops, comma-spacing,
	no-mixed-spaces-and-tabs, no-multi-spaces, camelcase, no-loop-func,no-empty,
	key-spacing ,curly, no-shadow, no-return-assign, no-redeclare, no-unused-vars,
	eqeqeq, no-extend-native, quotes , no-inner-declarations*/
/*global app, $, TimelineMax, TweenMax */

app.modules.kv = function () {

	//輪播
	var timelines = [];
	$('.kv .slide').slick({
		dots: false,
		fade: true,
		arrows: false,
		speed: 750,
		autoplay: true,
		pauseOnFocus: false,
		pauseOnHover: false,
		autoplaySpeed: 6000
	});
	$('.slick-slide').each(function () {
		var tl = new TimelineMax({
			paused: true,
			onComplete: function onComplete() {
				tl.seek(0);
				tl.play();
			}
		});
		timelines.push(tl);
	});
	$('.kv .slide').on('init', function (container, slide) {
		var w = $(window).width();
		if (w > 768) {
			timelines[0].play();
		} else {
			timelines[0].pause();
		}
	}).on('afterChange', function (container, slide) {
		var w = $(window).width();
		var idx = $('.slick-current').index();
		if ($('.slick-current').index() === 0 && w > 768) {
			timelines[idx].play();
		}
	}).on('beforeChange', function (container, slide) {
		$.each(timelines, function (i, tl) {
			tl.pause();
		});
	}).trigger('init').slick('slickGoTo', 0);

	//第一個輪播內容
	if (timelines[0]) {
		var tl1 = timelines[0];
		var ele1 = $('.kv .slide .slick-slide:eq(0) figure.blend');
		TweenMax.set(ele1, {
			opacity: 0
		});
		tl1.add(TweenMax.to(ele1, 1.5, {
			opacity: 1
		}));
		tl1.add(TweenMax.to(ele1, 0.5, {
			opacity: 0
		}));
	}
	// console.log(tl1, ele1);

	//-

};
//# sourceMappingURL=kv.js.map

'use strict';
/*eslint-disable new-cap, no-unused-vars,
	no-use-before-define, no-trailing-spaces, space-infix-ops, comma-spacing,
	no-mixed-spaces-and-tabs, no-multi-spaces, camelcase, no-loop-func,no-empty,
	key-spacing ,curly, no-shadow, no-return-assign, no-redeclare, no-unused-vars,
	eqeqeq, no-extend-native, quotes , no-inner-declarations*/
/*global app, $ */

app.modules.downloadapp = function () {
	$('#content').on('page:update', function (e) {
		// console.log(e);
		$('.download-app').each(function (i, ele) {
			if ($('html.android').length) {
				$(ele).attr('href', $(ele).attr('data-android-url'));
			} else if ($('html.ios').length) {
				$(ele).attr('href', $(ele).attr('data-ios-url'));
			} else {
				// 都不是只好讓他看看IOS版
				$(ele).attr('href', $(ele).attr('data-ios-url'));
			}
		});
	});
};
//# sourceMappingURL=download-app.js.map
