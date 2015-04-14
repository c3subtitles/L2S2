$(function() {
	var
		$silence = $('.silence'),
		silenceWait = 15*1000,
		room,
			socketPath = window.location.protocol+'//'+window.location.host,
			socket = io(socketPath);

	jQuery.fn.reverse = Array.prototype.reverse;
	$.fn.autoScale = function() {
		if(!this.data('autoScaleOriginal')) {
			this.data('autoScaleOriginal', parseInt(this.css('font-size')));
		}

		var maxSize = this.data('autoScaleOriginal'),
			maxH = this.parent().innerHeight(),
			thisH = this.css('font-size', maxSize).outerHeight();

		while(thisH > maxH && maxSize > 0) {
			thisH = this.css('font-size', --maxSize).outerHeight();
		}

		return this;
	};

	// join
	$('nav').on('click', 'td', function() {
		room = $(this).text();

		socket.emit('join', room);
		$('nav').hide();
		$('main').show();
	});

	// disconnect/reconnect
	socket.on('disconnect', function() {
		$('.disconnect').show();
	});

	socket.on('connect', function() {
		$('.disconnect').hide();

		// rejoin
		if(room)
			socket.emit('join', room);
	});

	function silence() {
		$silence
			.show()
			.css({opacity: 0})
			.animate({opacity: 1}, 0.75);
	}

	var silenceTimeout = setTimeout(silence, silenceWait);

	// display a line
	socket.on('line', function(stamp, line, duration) {
		if(silenceTimeout) {
			clearTimeout(silenceTimeout);
		}

		silenceTimeout = setTimeout(silence, silenceWait);
		$silence.hide();

		pushLine(stamp, line, duration);
	});


	// presentation specific
	var $lines = $('main').find('h1, h2, h3').reverse();
	function pushLine(stamp, line, duration) {
		// shift lines
		for (var i = $lines.length - 1; i >= 0; i--) {
			$($lines[i]).text(
				$($lines[i-1]).text()
			).autoScale();
		}

		// prepend new line
		$lines.first().text(line).autoScale();
	}

	$(window).on('orientationchange resize', function() {
		$lines.autoScale();
	});
});
/* vim: ts=4:sw=4:noet
 */
