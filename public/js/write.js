$(function() {
	var
		socket = io(window.location.protocol+'//'+window.location.host),
		$nav = $('nav'),
		$login = $('nav .login'),
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

	$.fn.serializeObject = function() {
		var object = {};

		$.each($(this).serializeArray(), function(idx, field) {
			object[field.name] = field.value || '';
		});

		return object;
	}

	// user/pass interaction
	$login.find('input.username').focus();
	$nav.on('keyup', 'input', function() {
		var lengths = $login
			.find('input')
			.map(function() { return $(this).val().length })
			.toArray();

		$login
			.find('a')
			.toggleClass('active', lengths.indexOf(0) === -1)

	}).find('input').first().trigger('keyup');

	// joining
	$login.on('click', 'a', function(e) {
		e.preventDefault();
		var $a = $(this);

		if(!$a.hasClass('active')) return;

		var
			room = $a.text(),
			username = $login.find('input.username').val(),
			password = $login.find('input.password').val();

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
					return setTimeout(function() { $nav.removeClass('error'); }, 500);
				}

				// login-success
				state.room = room;
				state.username = username;
				state.password = password;
				state.writers = writers;

				updateWritersList();

				$nav.hide();

				// header setup
				$('header h2').text($a.text());
				$('header .manage')
					.find('.username')
						.text(username)
					.end()
					.find('a')
						.toggleClass('visible', !!writers[username].admin)

				$input.focus();
			}
		);

	});

	// disconnect/reconnect
	socket.on('disconnect', function() {
		$disconnect.show();
	});

	socket.on('connect', function() {
		$disconnect.hide();

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
			$log.scrollTop($log.height());
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

			$log.scrollTop($log.height());
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

		if($input.val() == '' /* EMPTY */)
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

	// shortcut updating
	$('a.load-hints').on('click', function() {
		var $shortcuts = $('main .hints input:enabled');

		$.ajax({
			url: '/current-talk/'+state.room,
			dataType: 'json',
			success: function(talk) {
				if(!talk)
				{
					$('main .hints').addClass('error');
					setTimeout(function() { $('main .hints').removeClass('error'); }, 500);
				}

				for (var i = 0; i < Math.min(10, talk.persons.length); i++) {
					$shortcuts.get(i).value = talk.persons[i].full_public_name;
				};

				$lineTpl
					.clone()
					.addClass('note')
					.find('strong')
						.text(
							moment(talk.now).format('dd, HH:mm:ss.SSS')
						)
					.end()
					.find('span')
						.text('Fahrplan: Current Talk is '+talk.title+' in '+talk.language)
					.end()
					.appendTo($log);
			}
		});
	});



	var
		$usermgmt = $nav.find('section.usermgmt'),
		$userul = $usermgmt.find('ul.users'),
		$tpl = $userul.find('> li.template')
			.detach()
			.removeClass('template');

	$('header a.domanage').on('click', function() {
		$nav
			.show()
			.find('section')
				.hide();

		function updateUsermgmtList(userlist) {
			$userul.empty();
			for(user in userlist)
			{
				$tpl
					.clone()
					.find('a')
						.text(user)
					.end()
					.find('strong')
						.toggle(!!userlist[user].admin)
					.end()
					.appendTo($userul);
			}
		}

		socket.emit('usermgmt', null, function(userlist) {
			state.userlist = userlist;
			updateUsermgmtList(userlist);

			$usermgmt.show();
		});

		$usermgmt.on('click', 'ul.users a', function(e) {
			e.preventDefault();
			var user = $(this).text();
			$usermgmt
				.find('input[name=username]')
					.val(user)
				.end()
				.find('input[name=admin]')
					.prop('checked', !!state.userlist[user].admin)
				.end()
				.find('input[name=color]')
					.val(state.userlist[user].color || 'black');
		}).on('click', 'button', function(e) {
			e.preventDefault();
			var
				$btn = $(this),
				cmd = $btn.closest('form').serializeObject();

			if($btn.hasClass('delete'))
				cmd['delete'] = true;

			cmd.admin = (cmd.admin == '1');

			socket.emit('usermgmt', cmd, function(userlist) {
				console.log(userlist);
				if(!userlist)
				{
					$nav.addClass('error');
					return setTimeout(function() { $nav.removeClass('error'); }, 500);
				}

				state.userlist = userlist;
				updateUsermgmtList(userlist);
				$usermgmt
					.find('input:text')
						.val('')
					.end()
					.find('input:checkbox')
						.prop('checked', false);

					$nav.addClass('success');
					return setTimeout(function() { $nav.removeClass('success'); }, 500);
			});
		}).on('click', '.close', function(e) {
			e.preventDefault();
			$nav.hide();
		});

		var $color = $usermgmt.find('input[name=color]').ColorPicker({
			onChange: function(hsb, hex, rgb) {
				$color.val('#'+hex);
			},
			onSubmit: function(hsb, hex, rgb) {
				$color.ColorPickerHide();
			},
			onBeforeShow: function () {
				$(this).ColorPickerSetColor(this.value);
			}
		}).on('keyup', function(){
			$(this).ColorPickerSetColor(this.value);
		});
	});

	$('header a.dolock').on('click', function() {
		var dolock = !$log.hasClass('locked')
		$(this).text(dolock ? '[unlock room]' : '[lock room]');

		socket.emit(
			dolock ? 'adminlock' : 'adminunlock',
			function(success) {
				if(success) {
					$log.toggleClass('locked', dolock);
				}
				else {
					$log.addClass('error');
					return setTimeout(function() { $log.removeClass('error'); }, 500);
				}
			}
		);
	});

	// focus tracking
	$('main').on('click', function(e) {
		if(!$(e.target).is('input:enabled'))
			$input.focus();
	});

	// writers-list change
	socket.on('writers', function(writers) {
		state.writers = writers;
		updateWritersList();
	});

	socket.on('adminlock', function(name) {
		$nav
			.show()
			.find('section')
				.hide()
			.end()
			.find('section.lock')
				.show()
				.find('.name')
					.text(name);
	});


	socket.on('adminunlock', function(name) {
		$nav.hide();
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
