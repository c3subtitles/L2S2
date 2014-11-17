$(function() {
	var
		socket = io(window.location.protocol+'//'+window.location.host),
		$nav = $('nav'),
		$disconnect = $('.disconnect'),
		$log = $('main ul.log'),
		$lineTpl = $log.find('li.template')
			.removeClass('template')
			.detach(),
		$input = $('main > input'),

		// system state
		state = {
			room: null,
			username: null,
			password: null,
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

	}).find('input').first().trigger('keyup');

	// joining
	$nav.on('click', 'section a', function(e) {
		e.preventDefault();
		var $a = $(this);

		if(!$a.hasClass('active')) return;

		var
			room = $a.text(),
			username = $('nav input.username').val(),
			password = $('nav input.password').val();

		// emit join-login command
		socket.emit(
			'join',
			room,
			username,
			password,

			// acknowledgement
			function(success, writers) {
				// login-error
				if(!success)
				{
					$nav.addClass('error');
					setTimeout(function() { $nav.removeClass('error'); }, 500);
					return;
				}

				// login-success
				state.room = room;
				state.username = username;
				state.password = password;
				state.writers = writers;

				updateWritersList();

				$nav.css('display', 'none');
				$('header h2').text($a.text());
				$('header .manage').text(username);
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

		if(state.room) {
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
	socket.on('line', function(stamp, text, writer, socketid) {
		$log.find('.partline[data-socketid='+socketid+']').remove();

		var $line = $lineTpl
			.clone()
			.find('strong')
				.text(
					moment(stamp).format('dd, HH:mm:ss.SSS')
				)
			.end()
			.find('span')
				.text(text)
			.end();

		var $partline = $log.find('li.partline').last();
		if($partline.length > 0)
		{
			$line.insertBefore($partline);
		}
		else
		{
			$line.appendTo($log);
			$log.scrollTo($line);
		}
	});

	// receiving
	socket.on('partline', function(text, writer, socketid) {
		var $line = $log.find('.partline[data-socketid='+socketid+']');

		if($line.length == 0)
		{
			$line = $lineTpl
				.clone()
				.addClass('partline')
				.attr('data-socketid', socketid)
				.css('color', state.writers[writer].color || 'black')
				.appendTo($log);

			$log.scrollTo($line);
		}

		$line
			.find('span')
			.text(text)
	});

	// sending
	var preVal = '';
	$input.on('keypress', function(e) {
		if(e.which != 13 /* ENTER */)
			return;

		socket.emit('line', $input.val());
		$input.val('').focus();
		preVal = '';
	}).on('keyup', function(e) {
		var val = $input.val();
		if(val != preVal)
		{
			preVal = val;

			$('input.shortcut').each(function() {
				val = val.replace(this.name, this.value);
				val = val.replace(this.name.toLowerCase(), this.value);
			});

			if(val != preVal)
			{
				$input.val(val)
			}

			socket.emit('partline', val);
		}
	});

	$('main').on('click', function(e) {
		if(!$(e.target).is('input:enabled'))
			$input.focus();
	});

	// writers-list change
	socket.on('writers', function(writers) {
		state.writers = writers;
		updateWritersList();
	});


	function updateWritersList()
	{
		var $ul = $('.writers').empty();
		for(writer in state.writers)
		{
			$('<li>')
				.text([
					writer,
					(state.writers[writer].admin ? '*' : ''),
					(state.writers[writer].cnt > 1 ? ' ×'+state.writers[writer].cnt : '')
				].join(''))
				.css('color', state.writers[writer].color || 'black')
				.appendTo($ul);
		}
	}
});
