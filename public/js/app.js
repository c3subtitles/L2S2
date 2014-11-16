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

		// system state
		state = {
			room: null,
			username: null,
			password: null,
			settings: {},
			writers: []
		};

	// user/pass interaction
	$('nav input[name=username]').focus();
	$nav.on('keyup', 'input', function() {
		var lengths = $nav
			.find('input')
			.map(function() { return $(this).val().length })
			.toArray();

		$nav
			.find('section a')
			.toggleClass('active', lengths.indexOf(0) === -1)

	}).find('input').first().trigger('keydown');

	// joining
	$nav.on('click', 'section a', function(e) {
		e.preventDefault();
		var $a = $(this);

		if(!$a.hasClass('active')) return;

		state.room = $a.data('target');
		state.username = $('nav input[name=username]').val();
		state.password = $('nav input[name=password]').val();

		// emit join-login command
		socket.emit(
			'join',
			state.room,
			state.username,
			state.password,

			// acknowledgement
			function(success, settings, writers) {
				// login-error
				if(!success)
				{
					$nav.addClass('error');
					setTimeout(function() { $nav.removeClass('error'); }, 500);
					return;
				}

				// login-success
				state.settings = settings;
				state.writers = writers;

				$nav.css('display', 'none');
				$input.focus();
			}
		);

	});

	// disconnect/reconnect
	socket.on('disconnect', function() {
		$disconnect.css('display', 'block');
	});

	socket.on('connect', function() {
		$disconnect.css('display', 'none');

		if(room) {
			// re-join
			socket.emit(
				'join',
				state.room,
				state.username,
				state.password
			);
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
		if(e.which != 13 /* ENTER */)
			return;

		socket.emit('line', $input.val());
		$input.val('').focus();
	});

	$input.on('blur', function() {
		$input.focus();
	});
});
