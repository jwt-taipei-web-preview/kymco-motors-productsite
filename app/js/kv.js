'use strict';
/*eslint-disable new-cap, no-unused-vars,
	no-use-before-define, no-trailing-spaces, space-infix-ops, comma-spacing,
	no-mixed-spaces-and-tabs, no-multi-spaces, camelcase, no-loop-func,no-empty,
	key-spacing ,curly, no-shadow, no-return-assign, no-redeclare, no-unused-vars,
	eqeqeq, no-extend-native, quotes , no-inner-declarations*/
/*global app, $, TimelineMax, TweenMax */
app.modules.kv = function(){

	//輪播
	$('.kv').slick({
		dots: false,
		fade: true,
		arrows: false,
		// autoplay: true,
		autoplaySpeed: 10000
	});
	var timelines = [];
	$('.slick-slide').each(function(){
		var tl = new TimelineMax({
			paused: true,
			onComplete: function(){
				tl.play();
			}
		});
		timelines.push(tl);
	});

	//第一個輪播內容
	var tl1 = timelines[0];
	var ele1 = $('.kv .slick-slide:eq(0) figure.blend');
	tl1.add(TweenMax.to(ele1, 0.8, {
		backgroundPosiiton: '10px 0, 0 0'
	}));
	tl1.add(TweenMax.to(ele1, 0.8, {
		backgroundPosiiton: '-10px 0, 0 0'
	}));
	// console.log(tl1, ele1);

	//-


	$('.kv').on('afterChange', function(container, slide){
		var idx = $('.slick-current').index();
		console.log(timelines[idx]);
		if($('.slick-current').index() === 0){
			timelines[idx].play();
		}
	});
	$('.kv').on('beforeChange', function(container, slide){
		$.each(timelines, function(i, tl){
			tl.pause();
		});
	});
};
