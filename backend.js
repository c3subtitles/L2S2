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

	app = express(),
	server = http.Server(app),
	io = socketio(server),

	socketsPerRoom = {},
	writersPerRoom = {},
	linesPerRoom = {},
	logfilePerRoom = {};

Object.defineProperty(Object.prototype, 'map', {
    value: function(f, ctx) {
        ctx = ctx || this;
        var self = this, result = {};
        Object.keys(self).forEach(function(v) {
            result[v] = f.call(ctx, self[v], v, self); 
        });
        return result;
    }
});

app.use(morgan('dev'))

app.use(less('./public', {
	compiler: {
		sourceMap: true
	}
}))

app.use('/logs', serveIndex('./public/logs', {
	view: 'details'
}))
app.use(serveStatic('./public'))


app.get('/status', function(req, res) {
	res.json({
		'socketsPerRoom': socketsPerRoom.map(function(socketlist) { return socketlist.length }),
		'writersPerRoom': writersPerRoom,
		'linesPerRoom': linesPerRoom,
	});
});
app.get('/status/:room', function(req, res) {
	var room = req.params.room;
	res.json(
		(room in socketsPerRoom) && (socketsPerRoom[room].length > 0)
	);
});

io.sockets.on('connection', function (socket) {
	var	joinedRoom, joinedName;

	console.log('connection', socket.id, 'from', socket.conn.remoteAddress);
	socket.on('join', function(room, username, password, cb) {
		// clean name
		room = room.replace(/[^a-zA-Z0-9]/g, '-');

		console.log('socket', socket.id, 'joined room', room);
		joinedRoom = room;

		if(username && password)
		{
			console.log('socket', socket.id, 'tries to authenticate as', username);
			if(users[username] && users[username].password == password)
			{
				joinedName = username;

				if(!writersPerRoom[joinedRoom])
					writersPerRoom[joinedRoom] = [];

				writersPerRoom[joinedRoom].push(joinedName);
				console.log('now', writersPerRoom[joinedRoom].length, 'writers in room', joinedRoom, ':', writersPerRoom[joinedRoom]);

				console.log('socket', socket.id, 'is now authenticated as', username);
				if(cb) cb(true);
			}
			else {
				console.log('socket', socket.id, 'faild to authenticate as', username);
				if(cb) cb(false);
				return;
			}
		}

		if(!socketsPerRoom[joinedRoom])
			socketsPerRoom[joinedRoom] = [];

		if(!linesPerRoom[joinedRoom])
			linesPerRoom[joinedRoom] = 0;

		socketsPerRoom[joinedRoom].push(socket);
		console.log('now', socketsPerRoom[joinedRoom].length, 'sockets in room', joinedRoom);

		if(!logfilePerRoom[joinedRoom]) {
			console.log('opening logfile for room', joinedRoom);
			logfilePerRoom[joinedRoom] = fs.createWriteStream(
				path.join('./public/logs/', joinedRoom+'.txt'),
				{ flags: 'a', encoding: 'utf8' }
			);
		}
	});

	socket.on('disconnect', function() {
		if(!joinedRoom) {
			console.log('disconnection of', socket.id);
			return;
		}
		console.log('disconnection of', socket.id, 'from room', joinedRoom);

		writersPerRoom[joinedRoom].splice(writersPerRoom[joinedRoom].indexOf(joinedName), 1);
		socketsPerRoom[joinedRoom].splice(socketsPerRoom[joinedRoom].indexOf(socket), 1);
		console.log('now', socketsPerRoom[joinedRoom].length, 'sockets in room', joinedRoom);

		if(writersPerRoom[joinedRoom].length == 0)
		{
			console.log('closing logfile for room', joinedRoom);
			logfilePerRoom[joinedRoom].close();
			delete logfilePerRoom[joinedRoom];
		}
	});

	socket.on('line', function(line) {
		if(!joinedName) return;

		console.log('line from', socket.id, 'for room', joinedRoom, ':', line);

		var stamp = Date.now();
		socketsPerRoom[joinedRoom].forEach(function(itersocket) {
			itersocket.emit('line', stamp, line);
		});

		linesPerRoom[joinedRoom]++;

		if(logfilePerRoom[joinedRoom] && logfilePerRoom[joinedRoom] !== true)
		{
			line = line.replace("\n", "\\n").replace("\r", "\\r");
			logfilePerRoom[joinedRoom].write(stamp+"\t"+line+"\n", 'utf8');
		}
	});
});

console.log('starting http/socket-server on port', config.port);
server.listen(config.port)
