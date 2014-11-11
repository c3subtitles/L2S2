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
	io = socketio(server);

app.use(morgan('dev'))

app.use(less('./public', {
	compiler: {
		sourceMap: true
	}
}))

app.use(serveStatic('./public'))

//io.set('heartbeat interval', 5);

io.sockets.on('connection', function (socket) {
	socket.emit('welcome', { foo: 'bar' });
});

console.log('starting http/socket-server on port', config.port);
server.listen(config.port)
