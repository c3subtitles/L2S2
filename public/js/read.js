$(function() {
	var
		room,
		socket = io(window.location.protocol+'//'+window.location.host);

	jQuery.fn.reverse = Array.prototype.reverse;
	$.fn.autoScale = function() {
		if(!this.data('autoScaleOriginal'))
			this.data('autoScaleOriginal', parseInt(this.css('font-size')));

		var
			maxSize = this.data('autoScaleOriginal');
			maxH = this.parent().innerHeight(),
			thisH = this.css('font-size', maxSize).outerHeight();

		while(thisH > maxH && maxSize > 0) {
			thisH = this.css('font-size', --maxSize).outerHeight();
			console.log(maxSize, thisH);
		}

		return this;
	}

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

	// display a line
	socket.on('line', function(stamp, line, duration) {
		pushLine(stamp, line, duration);
	});


	// presentation specific
	var $lines = $('main').find('h1, h2, h3').reverse();
	console.log($lines);
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

	$(window).on('resize', function() {
		$lines.autoScale();
	});
});
