var
	fs = require('fs'),
	path = require('path'),
	config = require('./config'),

	express = require('express'),
	morgan = require('morgan'),
	serveStatic = require('serve-static'),
	socketio = require('socket.io'),
	http = require('http'),
	less = require('less-middleware'),

	app = express(),
	server = http.Server(app),
	io = socketio(server),

	socketsPerRoom = {},
	logfilePerRoom = {};

app.use(morgan('dev'))

app.use(less('./public', {
	compiler: {
		sourceMap: true
	}
}))

app.use(serveStatic('./public'))

app.use('/status', function(req, res) {
	var room = req.url.substr(1);
	res.json(
		(room in socketsPerRoom) && (socketsPerRoom[room].length > 0)
	);
});

io.sockets.on('connection', function (socket) {
	var joinedRoom;

	console.log('connection', socket.id, 'from', socket.conn.remoteAddress);
	socket.on('join', function(room) {
		// clean name
		room = room.replace(/[^a-zA-Z0-9]/g, '-');

		console.log('socket joined room', room);
		joinedRoom = room;

		if(!socketsPerRoom[joinedRoom])
			socketsPerRoom[joinedRoom] = [];

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
		console.log('disconnection of', socket.id, 'from room', joinedRoom);

		socketsPerRoom[joinedRoom].splice(socketsPerRoom[joinedRoom].indexOf(socket), 1);
		console.log('now', socketsPerRoom[joinedRoom].length, 'sockets in room', joinedRoom);

		if(socketsPerRoom[joinedRoom].length == 0)
		{
			console.log('closing logfile for room', joinedRoom);
			logfilePerRoom[joinedRoom].close();
			delete logfilePerRoom[joinedRoom];
		}
	});

	socket.on('line', function(line) {
		console.log('line from', socket.id, 'for room', joinedRoom, ':', line);

		var stamp = Date.now();
		socketsPerRoom[joinedRoom].forEach(function(itersocket) {
			itersocket.emit('line', stamp, line);
		});

		if(logfilePerRoom[joinedRoom] && logfilePerRoom[joinedRoom] !== true)
		{
			line = line.replace("\n", "\\n").replace("\r", "\\r");
			logfilePerRoom[joinedRoom].write(stamp+"\t"+line+"\n", 'utf8');
		}
	});
});

console.log('starting http/socket-server on port', config.port);
server.listen(config.port)
