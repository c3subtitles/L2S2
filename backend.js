var
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

	socketsPerRoom = [];

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
		console.log('socket joined room', room);
		joinedRoom = room;

		if(!socketsPerRoom[joinedRoom])
			socketsPerRoom[joinedRoom] = [];

		socketsPerRoom[joinedRoom].push(socket);
	});

	socket.on('disconnect', function() {
		console.log('disconnection of', socket.id, 'from room', joinedRoom);

		if(socketsPerRoom[joinedRoom]) {
			socketsPerRoom[joinedRoom].splice(socketsPerRoom.indexOf(socket), 1);
			console.log('now', socketsPerRoom[joinedRoom].length, 'sockets in room', joinedRoom);
		}
	});

	socket.on('line', function(line) {
		console.log(socket.id, 'sent line for room', joinedRoom, ':', line);
	});
});

console.log('starting http/socket-server on port', config.port);
server.listen(config.port)
