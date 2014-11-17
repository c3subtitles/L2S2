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

	app = express(),
	server = http.Server(app),
	io = socketio(server),

	socketsPerRoom = {},
	writersPerRoom = {},
	linesPerRoom = {},
	logfilePerRoom = {};

// load some small helpers, like an oject-map call
require('./lib/helper')

// enable http requests logging
app.use(morgan('dev'))

// enable less-compiler for all less-files in public
app.use(less('./public', {
	compiler: {
		sourceMap: true
	}
}))

// enable directory-indexes for the logs-folder
app.use('/logs', serveIndex('./public/logs', {
	view: 'details'
}))

// enable serving the public filder
app.use(serveStatic('./public'))

// serve a generic /status call
app.get('/status', function(req, res) {
	res.json({
		// number of connected sockets per room
		'socketsPerRoom': socketsPerRoom.map(function(socketlist) {return socketlist.length }),

		// names of writers per room
		'writersPerRoom': writersPerRoom,

		// receiced number of lines per roomm
		'linesPerRoom': linesPerRoom,
	});
});

// serve a per-room status call
app.get('/status/:room', function(req, res) {
	var room = req.params.room;
	res.json(
		(room in socketsPerRoom) && (socketsPerRoom[room].length > 0)
	);
});

// format an object consisting of all writers in the keys and
// the settings from users.json (minus password) in the value
// the result-object does only contain one item per user, even
// if the user has joined multiple times. its perfectly suitable
// for submitting it to the client for displaying
function aggregateWritersSettings(room) {
	var writersSettings = {};
	writersPerRoom[room].forEach(function(writer) {
		var settings = extend({}, users[writer]);
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
		// the socketsPerRoom-array for that room. on connection-close it must
		// be removed from the respective array. it takes part in the broadcasting
		// of lines for this room
		joinedRoom,

		// if set, the socket has successfully authorized itsself as the user
		// named by joinedName. the name can be found in the writersPerRoom-array
		// for the room it has joined. on connection-close it must be removed from
		// the respective array. it takes part in the broadcasting of partitial lines
		// join and leave-events for this room. it is then also allowed to emit its
		// own line and partline events
		joinedName;

	console.log('connection', socket.id, 'from', socket.conn.remoteAddress);

	// join a room, possibly identify as a user is 
	socket.on('join', function(room, username, password, cb) {
		// clean name - to be sure we're not hacked that easy
		room = room.replace(/[^a-zA-Z0-9 ]/g, '-');

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

				// initialize a writers list if reqired
				if(!writersPerRoom[room])
					writersPerRoom[room] = [];

				// register username as a writer
				writersPerRoom[room].push(joinedName);
				console.log('now', writersPerRoom[room].length, 'writers in room', room, ':', writersPerRoom[room]);

				// craft a version of the users settings, suitable for sending
				// to the client as initial statement
				var writersSettings = aggregateWritersSettings(room);

				// if a callback was requested, call back :)
				if(cb) cb(true, writersSettings);

				// emit a line-event with text & stamp to all sockets in that room
				if(socketsPerRoom[room]) socketsPerRoom[room].forEach(function(itersocket) {
					itersocket.emit('writers', writersSettings);
				});
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
		console.log('socket', socket.id, 'joined room', room);
		joinedRoom = room;

		// initialize lists per room if reqired
		if(!socketsPerRoom[joinedRoom])
			socketsPerRoom[joinedRoom] = [];

		if(!linesPerRoom[joinedRoom])
			linesPerRoom[joinedRoom] = 0;

		// add the socket to the per-room distribution list
		socketsPerRoom[joinedRoom].push(socket);
		console.log('now', socketsPerRoom[joinedRoom].length, 'sockets in room', joinedRoom);

		// if no logfile for the room is opened yet
		if(!logfilePerRoom[joinedRoom])
		{
			// open a room-logfile
			console.log('opening logfile for room', joinedRoom);
			logfilePerRoom[joinedRoom] = fs.createWriteStream(
				path.join('./public/logs/', joinedRoom+'.txt'),
				{ flags: 'a', encoding: 'utf8' }
			);
		}
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

		// if the user was authenticated
		if(joinedName)
		{
			// remove (one occurence of) the username from the writers list of that room
			writersPerRoom[joinedRoom].splice(writersPerRoom[joinedRoom].indexOf(joinedName), 1);
		}

		// remove the users socket from the list of sockets for that room
		socketsPerRoom[joinedRoom].splice(socketsPerRoom[joinedRoom].indexOf(socket), 1);
		console.log('now', socketsPerRoom[joinedRoom].length, 'sockets in room', joinedRoom);


		// craft a version of the users settings, suitable for sending
		// to the client as initial statement
		var writersSettings = aggregateWritersSettings(joinedRoom);

		// emit a line-event with text & stamp to the remaining sockets in that room
		if(socketsPerRoom[joinedRoom]) socketsPerRoom[joinedRoom].forEach(function(itersocket) {
			itersocket.emit('writers', writersSettings);
		});


		// if there is no writer for that room left
		if(writersPerRoom[joinedRoom].length == 0)
		{
			// close the logfile
			console.log('closing logfile for room', joinedRoom);
			logfilePerRoom[joinedRoom].close();

			// and remove the reference to the stale write-stream
			delete logfilePerRoom[joinedRoom];
		}
	});



	// received a line from a socket
	socket.on('line', function(line) {
		// sending lines is not allowed for none-authorized users
		if(!joinedName) return;

		console.log('line from', socket.id, 'for room', joinedRoom, ':', line);

		// stamp it
		var stamp = Date.now();

		// emit a line-event with text & stamp to all sockets in that room
		socketsPerRoom[joinedRoom].forEach(function(itersocket) {
			itersocket.emit('line', stamp, line, joinedName, socket.id);
		});

		// increment statistics counter
		linesPerRoom[joinedRoom]++;

		// escape \n and \r in input
		line = line.replace("\n", "\\n").replace("\r", "\\r");

		// write a line into the logfile
		logfilePerRoom[joinedRoom].write(stamp+"\t"+line+"\n", 'utf8');
	});

	// received a partitial line from a socket
	socket.on('partline', function(partline) {
		// sending partlines is not allowed for none-authorized users
		if(!joinedName) return;

		// emit a line-event with text & stamp to all sockets in that room
		socketsPerRoom[joinedRoom].forEach(function(itersocket) {
			itersocket.emit('partline', partline, joinedName, socket.id);
		});
	});
});

// listen for connections
console.log('starting http/socket-server on port', config.port);
server.listen(config.port)
