$(function() {
	var
		socket = io(window.location.protocol+'//'+window.location.host),
		$nav = $('nav'),
		$disconnect = $('.disconnect'),
		$ul = $('main ul'),
		$lineTpl = $ul.find('li.template')
			.removeClass('template')
			.detach(),
		$input = $('main input'),
		room;

	// joining
	$nav.on('click', 'section a', function() {
		var $a = $(this);
		room = $a.data('target');

		socket.emit('join', room);
		$nav.css('display', 'none');
		$input.focus();
	});

	// disconnect/reconnect
	socket.on('disconnect', function() {
		$disconnect.css('display', 'block');
	});

	socket.on('connect', function() {
		$disconnect.css('display', 'none');

		if(room) {
			// re-join
			socket.emit('join', room);
		}
	});

	// receiving
	socket.on('line', function(stamp, text) {
		$lineTpl
			.clone()
			.find('strong')
				.text(stamp)
			.end()
			.find('span')
				.text(text)
			.end()
			.appendTo($ul);
	});

	// sending
	$input.on('keypress', function(e) {
		if(e.which != 13)
			return;

		socket.emit('line', $input.val());
		$input.val('').focus();
	});

	$input.on('blur', function() {
		$input.focus();
	});
});
