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
	$('.kv.slide').slick({
		dots: false,
		fade: true,
		arrows: false,
		autoplay: true,
		autoplaySpeed: 10000
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
	$('.kv.slide').on('init', function (container, slide) {
		timelines[0].play();
	}).on('afterChange', function (container, slide) {
		var idx = $('.slick-current').index();
		if ($('.slick-current').index() === 0) {
			timelines[idx].play();
		}
	}).on('beforeChange', function (container, slide) {
		$.each(timelines, function (i, tl) {
			tl.pause();
		});
	}).trigger('init');

	//第一個輪播內容
	var tl1 = timelines[0];
	var ele1 = $('.kv.slide .slick-slide:eq(0) figure.blend');
	TweenMax.set(ele1, {
		opacity: 0
	});
	tl1.add(TweenMax.to(ele1, 1.5, {
		opacity: 1
	}));
	tl1.add(TweenMax.to(ele1, 0.5, {
		opacity: 0
	}));
	// console.log(tl1, ele1);

	//-

};
//# sourceMappingURL=kv.js.map
