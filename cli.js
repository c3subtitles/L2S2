var
	socket = require('socket.io-client'),
	cli = socket('http://c3voc.mazdermind.de:33133');

cli.on('connect', function() {
	cli.emit('join', 'Saal 1');
});

cli.on('line', function(stamp, line, duration) {
	console.log(line);
});
/* vim: ts=4:sw=4:noet 
 */
