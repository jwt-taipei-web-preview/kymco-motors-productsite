'use strict';
/*eslint-disable new-cap, no-unused-vars,
	no-use-before-define, no-trailing-spaces, space-infix-ops, comma-spacing,
	no-mixed-spaces-and-tabs, no-multi-spaces, camelcase, no-loop-func,no-empty,
	key-spacing ,curly, no-shadow, no-return-assign, no-redeclare, no-unused-vars,
	eqeqeq, no-extend-native, quotes , no-inner-declarations*/
/*global app, $ */
app.modules.downloadapp = function(){
	$('#content').on('page:update', function(e){
		// console.log(e);
		$('.download-app').each(function(i, ele){
			if ($('html.android').length) {
				$(ele).attr('href', $(ele).attr('data-android-url'));
				
			} else if ($('html.ios').length) {
				$(ele).attr('href', $(ele).attr('data-ios-url'));
			} else{
				// 都不是只好讓他看看IOS版
				$(ele).attr('href', $(ele).attr('data-ios-url'));
			}
		});
	});
};
