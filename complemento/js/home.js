$(document).ready(function() {

	// $("#spInscribete").on("click",()=>{
	// 	$("#aBtnInscribete").trigger("click");
	// });

	$('.popupVideoLink').magnificPopup({
		disableOn: 768,
		fixedContentPos: true,
		type: 'iframe',
	    iframe: {
	        patterns: {
	            youtube: {
	                index: 'youtube.com/', 
	                id: function(url) {        
	                    var m = url.match(/[\\?\\&]v=([^\\?\\&]+)/);
	                    if ( !m || !m[1] ) return null;
	                    return m[1];
	                },
	                src: 'https://www.youtube.com/embed/%id%?autoplay=1'
	            }
	        }
	    }
	});

	function parallaxIt() {
		var $fwindow = $(window);
		var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

		$fwindow.on('scroll resize', function() {
			scrollTop = window.pageYOffset || document.documentElement.scrollTop;
		});

		$('[data-type="wpbg"]').each(function() {
			var $backgroundObj = $(this);
			var bgOffset = parseInt($backgroundObj.offset().top);
			var yPos;
			var coords;
			var speed = ($backgroundObj.data('speed') || 0 );

			$fwindow.on('scroll resize', function() {
				yPos = - ((scrollTop - bgOffset) / speed);
				coords = '50% '+ yPos + 'px';
				$backgroundObj.css({ backgroundPosition: coords });
			});
		});

		$fwindow.trigger('scroll');
	};

	parallaxIt();

});