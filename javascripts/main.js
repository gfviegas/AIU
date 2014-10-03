$(document).ready(function() {
	$('#sidebar').affix({
	      offset: {
	        top: 245
	      }
	});

	var $body   = $(document.body);
	var navHeight = $('.navbar').outerHeight(true) + 15;

	$body.scrollspy({
		target: '#scrollspythis',
		offset: navHeight
	});
});
