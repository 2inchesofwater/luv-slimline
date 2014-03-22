(function () {
	
	var cfg = {}, wdata = {};
	
	// create the image
	var init = function () {
		// config
		cfg.url = 'images/background-beach.jpg';
		
		// create the wrapper
		wdata.img = document.createElement('div');
		var s = wdata.img.style;
		s.top = s.left = '0px';
		s.width = '100%';
		s.backgroundSize = 'contain';
		s.backgroundPosition = 'top center';
		s.zIndex = '-999998';
		s.position = 'fixed';
		document.body.appendChild(wdata.img);
		
		// create the instance
		cfg.img = new Image();
		cfg.img.onload = onload;
		cfg.img.src = cfg.url;
		
		// when we scroll
		window.addEventListener('mousewheel', onscroll);
		window.addEventListener('scroll', onscroll);
		window.addEventListener('DOMMouseScroll', onscroll);
		
		// update when the comic is loaded
		(function () {
			var comic = document.querySelector('.slide img');
			if (!comic) return;
			
			if (comic.getAttribute('src') == 'images/ajax-loader.gif') {
				setTimeout(arguments.callee, 50);
				return;
			}
			
			onscroll();
		})();
		
		// update the image sizes
		window.addEventListener('resize', onresize);
		
		// raf
		/*if (!window['requestAnimationFrame']) window['requestAnimationFrame'] = window['webkitRequestAnimationFrame'];
		requestAnimationFrame(onframe);*/
	};
	
	// painting
	var onframe = function (dont_call) {
		if (cfg.last_pos === cfg.pos) {
			if (!dont_call) requestAnimationFrame(onframe);
			return;
		}
		cfg.last_pos = cfg.pos;
		
		var s = wdata.img.style;
		s.webkitTransform = s.transform = 'translateY(' + cfg.pos + 'px)';
		if (!dont_call) requestAnimationFrame(onframe);
	};
	
	// when the image is loaded
	var onload = function () {
		cfg.loaded = 1;
		var s = wdata.img.style;
		if (window.jQuery) {
			s.display = 'none';
			window.jQuery(wdata.img).fadeIn(5000);
		}
		s.backgroundImage = 'url('+cfg.url+')';
		onresize();
	};
	
	// when we resize
	var onresize = function () {
		if (!cfg.loaded) return;
		
		var b_w = document.body.offsetWidth;
		var w = b_w;
		var h = w / cfg.img.width * cfg.img.height;
		if (h < window.innerHeight) {
			h = window.innerHeight;
			w = h / cfg.img.height * cfg.img.width;
		}
		
		var s = wdata.img.style;
		s.width = w + 'px';
		s.height = h + 'px';
		cfg.img_h = h;
		
		cfg.gap = document.body.offsetHeight - h;
		onscroll();
	};
	
	// when we scroll
	var onscroll = function () {
		if (cfg.scrolling) return;
		cfg.scrolling = 1;
		var pos;
		if (window.pageYOffset) pos = window.pageYOffset;
		else pos = document.body.scrollTop;
		var h = document.body.offsetHeight - window.innerHeight;
		
		// calculate the position
		var d = wdata.img;
		cfg.pos = pos / h * (window.innerHeight - cfg.img_h);
		onframe(1);
		cfg.scrolling = 0;
	};

	init();
})();