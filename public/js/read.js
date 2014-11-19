$(function() {
	var socket = io(window.location.protocol+'//'+window.location.host);

	$('nav').on('click', 'td', function() {
		var room = $(this).text();

		socket.emit('join', room);
		$('nav').hide();
		$('main').show();
	});

	socket.on('line', function(stamp, line, duration, writer, socketid) {
		pushLine(stamp, line, duration);
	});

	// presentation specific
	var $lines = $('main').find('h1, h2, h3');
	function pushLine(stamp, line, duration) {
		// shift lines
		for (var i = $lines.length - 1; i >= 0; i--) {
			$($lines[i]).text(
				$($lines[i-1]).text()
			)
		}

		// prepend new line
		$lines.first().text(line);
	}
});
