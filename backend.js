var
	fs = require('fs'),
	path = require('path'),
	config = require('./config'),
	users = require('./users'),

	express = require('express'),
	morgan = require('morgan'),
	serveIndex = require('serve-index'),
	serveStatic = require('serve-static'),
	socketio = require('socket.io'),
	http = require('http'),
	less = require('less-middleware'),
	extend = require('util')._extend,
	clone = function(o) { return extend({}, o); },

	app = express(),
	server = http.Server(app),
	io = socketio(server),

	// per-room information. see 'connection'-event for per-room structure
	rooms = {},
	fahrplan = null;

// load some small helpers, like an oject-map call
require('./lib/helper')

// enable http requests logging
//app.use(morgan('dev'))
app.set('json spaces', "\t");

// enable less-compiler for all less-files in public
app.use(less('./public', {
	compiler: {
		sourceMap: true
	}
}))

// serve ui files
app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, 'public/read.html'))
})
app.get('/beamer', function(req, res) {
	res.sendFile(path.join(__dirname, 'public/beamer.html'))
})
app.get('/write', function(req, res) {
	res.sendFile(path.join(__dirname, 'public/write.html'))
})
app.get('/tech', function(req, res) {
	res.sendFile(path.join(__dirname, 'public/tech.html'))
})

// enable directory-indexes for the logs-folder
app.use('/logs', serveIndex('./public/logs', {
	view: 'details'
}))

// serve a generic /status call
app.get('/status', function(req, res) {
	res.json(rooms.map(function(room) {
		return {
			// number of connected sockets per room
			'publicSockets': room.publicSockets.length,
			'writerSockets': room.writerSockets.length,

			// names of writers per room
			'writerNames': room.writerSockets.map(function(socket) { return socket.username; }),

			// locked-state
			'adminlock': room.adminlock,

			// receiced number of lines per roomm
			'statistics': room.statistics,
		}
	}));
});

// serve a per-room status call
app.get('/status/:room', function(req, res) {
	var room = req.params.room;
	res.json(
		(room in rooms) && (rooms[room].writerNames.length > 0)
	);
});

app.get('/current-talk/:room', function(req, res) {
	if(!fahrplan)
		return res.end('early bird');

	var
		now = config.fahrplanSimulate ? new Date(config.fahrplanSimulate) : new Date(),
		days = fahrplan['schedule']['conference']['days'];

	for (var i = 0; i < days.length; i++) {
		var
			day = days[i],
			day_start = new Date(day.day_start),
			day_end = new Date(day.day_end);

		if(day_start > now || day_end < now)
			continue;
		
		if(!day.rooms[req.params.room])
			continue;

		var talks = day.rooms[req.params.room];
		for (var i = 0; i < talks.length; i++) {
			var
				talk = talks[i],
				parts = talk.duration.split(':');
				duration = parseInt(parts[0]) * 60 + parseInt(parts[1]);
				start = new Date(talk.date),
				end = new Date(start.getTime() + duration*60*1000);

			if(start > now || end < now)
				continue;

			talk.now = now.getTime();
			return res.json(talk);
		};
	}

	return res.json(null);
});

// enable serving the public filder
app.use(serveStatic('./public'))

function fetchFahrplan() {
	console.log('updating fahrplan from', config.fahrplan);
	http.get(config.fahrplan, function(res) {

		var data = '';
		res.setEncoding('utf-8');
		res.on("data", function(chunk) {
			data += chunk;
		})
		res.on('end', function() {
			setTimeout(fetchFahrplan, config.fahrplanTTL);

			console.log('got updated version of', data.length, 'bytes');

			var newFahrplan = JSON.parse(data)
			if(!newFahrplan)
				return console.log('updated is not valid JSON, resheduling - keeping old version');

			fahrplan = newFahrplan;
		});
	}).on('error', function(e) {
		return console.log('fahrplan-update returned error:', e.message, '- keeping old version');
		setTimeout(fetchFahrplan, config.fahrplanTTL);
	});

}
fetchFahrplan();


// format an object consisting of all writers in the keys and
// the settings from users.json (minus password) in the value
// the result-object does only contain one item per user, even
// if the user has joined multiple times. its perfectly suitable
// for submitting it to the client for displaying
function aggregateWritersSettings(room) {
	var writersSettings = {};
	if(rooms[room]) rooms[room].writerSockets.forEach(function(socket) {
		var
			writer = socket.username,
			settings = clone(users[writer]);

		delete settings.password;
		settings.cnt = writersSettings[writer] ? writersSettings[writer].cnt+1 : 1;

		writersSettings[writer] = settings;
	});
	return writersSettings;
}

// serve socket-connections ;)
io.sockets.on('connection', function (socket) {
	// hint: this is run once per-connection

	var
		// if set, the current socket has joined a room and can be found in
		// the publicSockets- or the writerSockets-array for that room.
		// on connection-close it must be removed from the respective array.
		// it takes part in the broadcasting of lines for this room
		joinedRoom,

		// if set, the socket has successfully authorized itsself as the user
		// named by joinedName. the socket can be found in the writerSockets-array
		// for the room it has joined. on connection-close it must be removed from
		// the respective array. it takes part in the broadcasting of partitial lines
		// join and leave-events for this room. it is then also allowed to emit its
		// own line and partline events
		joinedName;

	var partlineStamp = null;
	console.log('connection', socket.id, 'from', socket.conn.remoteAddress);

	// join a room, possibly identify as a user is 
	socket.on('join', function(room, username, password, cb) {
		// clean name - to be sure we're not hacked that easy
		room = room.replace(/[^a-zA-Z0-9 ]/g, '-');

		if(!rooms[room]) rooms[room] = {
			publicSockets: [],
			writerSockets: [],
			logfile: null,
			adminlock: null,
			statistics: {
				linesWritten: 0,
				linesServed: 0
			}
		};

		// if username and password is provided
		if(username && password)
		{
			console.log('socket', socket.id, 'tries to authenticate as', username);

			// check if the password correct
			if(users[username] && users[username].password == password)
			{
				console.log('socket', socket.id, 'is now authenticated as', username);

				// register that the socket successfully authenticated as user
				joinedName = username;
				socket.username = username;

				// register username as a writer
				rooms[room].writerSockets.push(socket);
				joinedRoom = room;
				console.log('now', rooms[room].publicSockets.length, 'read-only sockets in room', joinedRoom, '(', rooms[room].writerSockets.length, ' writer sockets)');

				// craft a version of the users settings, suitable for sending
				// to the client as initial statement
				var writersSettings = aggregateWritersSettings(room);

				// if a callback was requested, call back :)
				if(cb) cb(true, writersSettings);

				if(rooms[room].adminlock)
					socket.emit('adminlock', rooms[room].adminlock.name);

				console.log('informing all writersockets about new writers');
				rooms[room].writerSockets.forEach(function(itersocket) {
					itersocket.emit('writers', writersSettings);
				});

				// if no logfile for the room is opened yet
				if(!rooms[room].logfile)
				{
					// open a room-logfile
					console.log('opening logfile for room', room);
					rooms[room].logfile = fs.createWriteStream(
						path.join('./public/logs/', room+'.txt'),
						{ flags: 'a', encoding: 'utf8' }
					);
				}

				return;
			}

			// the user wanted to authenticate but didn't succeed
			else {
				console.log('socket', socket.id, 'faild to authenticate as', username);

				// callback with a fail-flag
				if(cb) cb(false);

				// and don't change anything on our state
				return;
			}
		}

		// register that the socket successfully joined the room
		console.log('socket', socket.id, 'joined room', room, 'readonly');
		joinedRoom = room;

		// add the socket to the per-room distribution list
		rooms[room].publicSockets.push(socket);
		joinedRoom = room;
		console.log('now', rooms[room].publicSockets.length, 'read-only sockets in room', joinedRoom, '(', rooms[room].writerSockets.length, ' writer sockets)');
	});

	// on socket-disconnect
	socket.on('disconnect', function() {
		// if the user has not yet joined a room
		if(!joinedRoom)
		{
			// just let it go
			console.log('disconnection of', socket.id);
			return;
		}

		console.log('disconnection of', socket.id, 'from room', joinedRoom);

		// if the user was not authenticated
		if(!joinedName)
		{
			// remove the socket from the public list of that room
			rooms[joinedRoom].publicSockets.splice(rooms[joinedRoom].publicSockets.indexOf(socket), 1);
			console.log('now', rooms[joinedRoom].publicSockets.length, 'read-only sockets in room', joinedRoom, '(', rooms[joinedRoom].writerSockets.length, ' writer sockets)');
			return;
		}

		// remove the writer-socket from the list of that room
		rooms[joinedRoom].writerSockets.splice(rooms[joinedRoom].writerSockets.indexOf(socket), 1);
		console.log('now', rooms[joinedRoom].publicSockets.length, 'read-only sockets in room', joinedRoom, '(', rooms[joinedRoom].writerSockets.length, ' writer sockets)');

		// craft a version of the users settings, suitable for sending
		// to the client as initial statement
		var writersSettings = aggregateWritersSettings(joinedRoom);

		// emit an event with text & stamp to the remaining sockets in that room
		rooms[joinedRoom].writerSockets.forEach(function(itersocket) {
			itersocket.emit('writers', writersSettings);
		});

		// if there is no writer for that room left
		if(rooms[joinedRoom].logfile && rooms[joinedRoom].writerSockets.length == 0)
		{
			// close the logfile
			console.log('closing logfile for room', joinedRoom);
			rooms[joinedRoom].logfile.close();
			rooms[joinedRoom].logfile = null;
		}

		// if this user had locked the room - unlock it
		if(rooms[joinedRoom].adminlock && rooms[joinedRoom].adminlock.id == socket.id)
		{
			console.log('this user had locked the room', joinedRoom, '- unlocking it');
			rooms[joinedRoom].adminlock = null;

			rooms[joinedRoom].writerSockets.forEach(function(itersocket) {
				itersocket.emit('adminunlock');
			});
		}
	});


	function calculateDisplayDuration(line) {
		var words = (line.match(/ /g) || []).length;
		return 2 + words * 1.5;
	}

	// received a line from a socket
	socket.on('line', function(line) {
		// sending lines is not allowed for non-authorized users
		if(!joinedName)
			return;

		console.log('line from', socket.id, 'for room', joinedRoom, ':', line);

		// stamp it
		if(partlineStamp) console.log('using existing partlineStamp', partlineStamp, 'to stamp the line');
		var stamp = partlineStamp || Date.now();
		partlineStamp = null;

		// emit a line-event with text & stamp to all sockets in that room
		rooms[joinedRoom].writerSockets.forEach(function(itersocket) {
			itersocket.emit('line', stamp, line, joinedName, socket.id);
		});

		// emit a line-event with text & stamp to all sockets in that room
		rooms[joinedRoom].publicSockets.forEach(function(itersocket) {
			itersocket.emit('line', stamp, line, calculateDisplayDuration(line));
			rooms[joinedRoom].statistics.linesServed++;
		});

		// increment statistics counter
		rooms[joinedRoom].statistics.linesWritten++;

		// escape \n and \r in input
		line = line.replace("\n", "\\n").replace("\r", "\\r");

		// write a line into the logfile
		rooms[joinedRoom].logfile.write(stamp+"\t"+line+"\n", 'utf8');
	});

	// received a partitial line from a socket
	socket.on('partline', function(partline) {
		// sending partlines is not allowed for non-authorized users
		if(!joinedName)
			return;

		if(partline.length == 0)
		{
			partlineStamp = null;
			console.log('partline got empty from', socket.id, '- unsetting partlineStamp');
		}
		else if(!partlineStamp)
		{
			partlineStamp = Date.now();
			console.log('registering partlineStamp', partlineStamp, 'for', socket.id);
		}

		// emit a line-event with text & stamp to all sockets in that room
		rooms[joinedRoom].writerSockets.forEach(function(itersocket) {
			itersocket.emit('partline', partline, joinedName, socket.id);
		});
	});

	socket.on('adminlock', function(cb) {
		// locking is not allowed for non-authorized users
		if(!joinedName)
			return;

		// locking is not allowed for non-admin users
		if(!users[joinedName].admin)
			return;

		if(rooms[joinedRoom].adminlock)
		{
			console.log('room', joinedRoom, 'already locked by', rooms[joinedRoom].adminlock.name);
			return cb(false);
		}

		console.log('locking room', joinedRoom, ' for username', joinedName);
		rooms[joinedRoom].adminlock = {
			id: socket.id,
			name: joinedName
		}

		rooms[joinedRoom].writerSockets.forEach(function(itersocket) {
			if(itersocket == socket)
				return;

			itersocket.emit('adminlock', joinedName);
		});

		return cb(true);
	});

	socket.on('adminunlock', function(cb)
	{
		if(!rooms[joinedRoom].adminlock || rooms[joinedRoom].adminlock.id != socket.id)
		{
			console.log('room', joinedRoom, 'not locked or locked by a different socket, NOT unlocking');
			return cb(false);
		}

		rooms[joinedRoom].writerSockets.forEach(function(itersocket) {
			if(itersocket == socket)
				return;

			itersocket.emit('adminunlock');
		});
		rooms[joinedRoom].adminlock = null;

		return cb(true);
	});






	function usersWithoutPasswords() {
		return users.map(function(user) {
			var newUser = clone(user);
			delete newUser.password;
			return newUser;
		});
	}

	socket.on('usermgmt', function(task, cb) {
		// sending lines is not allowed for non-authorized users
		if(!joinedName)
			return;

		// sending lines is not allowed for non-admin users
		if(!users[joinedName].admin)
			return;

		console.log('sending usermgmt-list to', joinedName);
		if(!task)
			return cb(usersWithoutPasswords());

		if(task.delete)
		{
			if(task.username == joinedName)
			{
				console.log('NOT allowing user', task.username, 'to delete himself');
				return cb(false);
			}

			console.log('deleting user', task.username, 'on behalf of', joinedName);
			delete users[task.username];
		}
		else {
			if(users[task.username]) {
				var user = users[task.username];

				if(joinedName == task.username && user.admin && !task.admin)
				{
					console.log('NOT allowing user', joinedName, 'to revoke his/her own admin rights');
					delete task.admin;
				}

				if(!task.password)
					delete task.password;

				var
					user = extend(user, task),
					username = task.username;

				delete user.username;
				console.log('modifying user', username, 'on behalf of', joinedName, 'to', user);
				users[username] = user;
			}
			else {
				if(!task.password)
				{
					console.log('NOT creating user without password');
					return cb(false);
				}
				var username = task.username;
				delete task.username;
				console.log('creating user', username, 'on behalf of', joinedName, 'as', task);
				users[username] = task;
			}

		}

		console.log('saving new version of users.js');
		var s = fs.createWriteStream('users.json', {encoding: 'utf-8'})
		s.write(JSON.stringify(users, null, "\t"))
		s.end()

		return cb(usersWithoutPasswords());
	});
});

// listen for connections
console.log('starting http/socket-server on port', config.port);
server.listen(config.port, '::')
