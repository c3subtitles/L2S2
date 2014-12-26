var
fs = require('fs'),
		path = require('path'),
		config = require('./config'),
		users = require('./users'),

		express = require('express'),
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
require('./lib/helper');

// enable http requests logging
//app.use(morgan('dev'))
app.set('json spaces', '\t');

// enable less-compiler for all less-files in public
app.use(less('./public', {
	compiler: {
		sourceMap: true
	}
}));

// serve ui files
app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, 'public/read.html'));
});
app.get('/beamer', function(req, res) {
	res.sendFile(path.join(__dirname, 'public/beamer.html'));
});
app.get('/write', function(req, res) {
	res.sendFile(path.join(__dirname, 'public/write.html'));
});

// enable directory-indexes for the logs-folder
app.use('/logs', serveIndex('./public/logs', {
	view: 'details'
}));

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

			// room with speech recognition
			'speechlock': room.speechlock,

			// receiced number of lines per roomm
			'statistics': room.statistics,
		};
	}));
});

// serve a per-room status call
app.get('/status/:room', function(req, res) {
	var room = req.params.room;
	res.jsonp(
		(room in rooms) && (rooms[room].writerSockets.length > 0)
	);
});

app.get('/current-talk/:room', function(req, res) {
	if(!fahrplan) {
		return res.end('early bird');
	}

	var
	now = config.fahrplanSimulate ? new Date(config.fahrplanSimulate) : new Date(),
			days = fahrplan.schedule.conference.days;

	for (var i = 0; i < days.length; i++) {
		var
		day = days[i],
				dayStart = new Date(day.day_start),
				dayEnd = new Date(day.day_end);

		if(dayStart > now || dayEnd < now) {
			continue;
		}

		if(!day.rooms[req.params.room]) {
			continue;
		}

		var talks = day.rooms[req.params.room];
		for (var j = 0; j < talks.length; j++) {
			var
			talk = talks[j],
					parts = talk.duration.split(':'),
					duration = parseInt(parts[0]) * 60 + parseInt(parts[1]),
					start = new Date(talk.date),
					end = new Date(start.getTime() + duration*60*1000);

			if(start > now || end < now) {
				continue;
			}

			talk.now = now.getTime();
			return res.json(talk);
		}
	}

	return res.json(null);
});

// enable serving the public filder
app.use(serveStatic('./public'));

function fetchFahrplan() {
	console.log('updating fahrplan from %s', config.fahrplan);
	http.get(config.fahrplan, function(res) {

		var data = '';
		res.setEncoding('utf-8');
		res.on('data', function(chunk) {
			data += chunk;
		});
		res.on('end', function() {
			setTimeout(fetchFahrplan, config.fahrplanTTL);
			console.log('got updated version of %s bytes', data.length);

			var newFahrplan = JSON.parse(data);
			if(!newFahrplan) {
				return console.log('updated is not valid JSON, resheduling - keeping old version');
			}

			fahrplan = newFahrplan;
		});
	}).on('error', function(e) {
		setTimeout(fetchFahrplan, config.fahrplanTTL);
		return console.log('fahrplan-update returned error: %s - keeping old version', e.message);
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
	if(rooms[room]) {
		rooms[room].writerSockets.forEach(function(socket) {
			var
			writer = socket.username,
					settings = clone(users[writer]);

			delete settings.password;
			settings.cnt = writersSettings[writer] ? writersSettings[writer].cnt+1 : 1;

			writersSettings[writer] = settings;
		});
	}
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
	console.log('connection %s from %s', socket.id, socket.conn.remoteAddress);

	// join a room, possibly identify as a user is 
	socket.on('join', function(room, username, password, cb) {
		// clean name - to be sure we're not hacked that easy
		room = room.replace(/[^a-zA-Z0-9 ]/g, '-');

		if(!rooms[room]) {
			rooms[room] = {
				publicSockets: [],
				writerSockets: [],
				logfile: null,
				adminlock: null,
				speechlock: null,
				speechDelay: 3,
				statistics: {
					linesWritten: 0,
					linesServed: 0
				}
			};
		}

		// if username and password is provided
		if(username && password) {
			console.log('socket %s tries to authenticate as %s', socket.id, username);

			// check if the password correct
			if(users[username] && users[username].password === password) {
				console.log('socket %s is now authenticated as %s', socket.id, username);

				// register that the socket successfully authenticated as user
				joinedName = username;
				socket.username = username;

				// register username as a writer
				rooms[room].writerSockets.push(socket);
				joinedRoom = room;
				console.log('now %s read-only sockets in room %s (%s writer sockets)', rooms[room].publicSockets.length, joinedRoom, rooms[room].writerSockets.length);

				// craft a version of the users settings, suitable for sending
				// to the client as initial statement
				var writersSettings = aggregateWritersSettings(room);

				// if a callback was requested, call back :)
				if(cb) {
					cb(true, writersSettings);
				}
				
				socket.emit('speechDelay', rooms[room].speechDelay);

				if(rooms[room].adminlock) {
					socket.emit('adminlock', rooms[room].adminlock.name);
				}

				if(rooms[room].speechlock) {
					socket.emit('speechlock', rooms[room].speechlock.name);
				}

				console.log('informing all writersockets about new writers');
				rooms[room].writerSockets.forEach(function(itersocket) {
					itersocket.emit('writers', writersSettings);
				});

				// if no logfile for the room is opened yet
				if(!rooms[room].logfile) {
					// open a room-logfile
					console.log('opening logfile for room %s', room);
					rooms[room].logfile = fs.createWriteStream(
						path.join('./public/logs/', room+'.txt'),
						{ flags: 'a', encoding: 'utf8' }
					);
				}

				return;
			}

			// the user wanted to authenticate but didn't succeed
			else {
				console.log('socket %s failed to authenticate as %s', socket.id, username);

				// callback with a fail-flag
				if(cb) {
					cb(false);
				}

				// and don't change anything on our state
				return;
			}
		}

		// register that the socket successfully joined the room
		console.log('socket %s joined room %s read-only', socket.id, room);
		joinedRoom = room;

		// add the socket to the per-room distribution list
		rooms[room].publicSockets.push(socket);
		joinedRoom = room;
		console.log('now %s read-only sockets in room %s (%s writer sockets)', rooms[room].publicSockets.length, joinedRoom, rooms[room].writerSockets.length);
	});

	// on socket-disconnect
	socket.on('disconnect', function() {
		// if the user has not yet joined a room
		if(!joinedRoom) {
			// just let it go
			console.log('disconnection of %s', socket.id);
			return;
		}

		console.log('disconnection of %s from room %s', socket.id, joinedRoom);

		// if the user was not authenticated
		if(!joinedName) {
			// remove the socket from the public list of that room
			rooms[joinedRoom].publicSockets.splice(rooms[joinedRoom].publicSockets.indexOf(socket), 1);
			console.log('now %s read-only sockets in room %s (%s writer sockets)', rooms[joinedRoom].publicSockets.length, joinedRoom, rooms[joinedRoom].writerSockets.length);
			return;
		}

		// remove the writer-socket from the list of that room
		rooms[joinedRoom].writerSockets.splice(rooms[joinedRoom].writerSockets.indexOf(socket), 1);
		console.log('now %s read-only sockets in room %s (%s writer sockets)', rooms[joinedRoom].publicSockets.length, joinedRoom, rooms[joinedRoom].writerSockets.length);

		// craft a version of the users settings, suitable for sending
		// to the client as initial statement
		var writersSettings = aggregateWritersSettings(joinedRoom);

		// emit an event with text & stamp to the remaining sockets in that room
		rooms[joinedRoom].writerSockets.forEach(function(itersocket) {
			itersocket.emit('writers', writersSettings);
		});

		// if there is no writer for that room left
		if(rooms[joinedRoom].logfile && rooms[joinedRoom].writerSockets.length === 0) {
			// close the logfile
			console.log('closing logfile for room %s', joinedRoom);
			rooms[joinedRoom].logfile.close();
			rooms[joinedRoom].logfile = null;
		}

		// if this user had locked the room - unlock it
		if(rooms[joinedRoom].adminlock && rooms[joinedRoom].adminlock.id === socket.id) {
			console.log('this user had locked the room %s - unlocking it', joinedRoom);
			rooms[joinedRoom].adminlock = null;

			rooms[joinedRoom].writerSockets.forEach(function(itersocket) {
				itersocket.emit('adminunlock');
			});
		}

		// if this user had locked the room - unlock it
		if(rooms[joinedRoom].speechlock && rooms[joinedRoom].speechlock.id === socket.id)
		{
			console.log('this user had locked the room', joinedRoom, '- unlocking it');
			rooms[joinedRoom].speechlock = null;

			rooms[joinedRoom].writerSockets.forEach(function(itersocket) {
				itersocket.emit('speechunlock');
			});
		}
	});


	function calculateDisplayDuration(line) {
		var words = (line.match(/ /g) || []).length;
		return 2 + words * 1.5;
	}

	// received a line from a socket
	socket.on('line', function(line, correctionId) {
		// sending lines is not allowed for non-authorized users
		if(!joinedName) {
			return;
		}

		//If locked only authorized
		if (rooms[joinedRoom].adminlock && !users[joinedName].admin) {
			return;
		}

		if (rooms[joinedRoom].speechlock && !(users[joinedName].admin || users[joinedName].speech)) {
			return;
		}

		console.log('line from %s for room %s: %s', socket.id, joinedRoom, line);

		// stamp it
		if(partlineStamp) {
			console.log('using existing partlineStamp %s to stamp the line', partlineStamp);
		}
		var stamp = partlineStamp || Date.now();
		partlineStamp = null;

		// emit a line-event with text & stamp to all sockets in that room
		rooms[joinedRoom].writerSockets.forEach(function(itersocket) {
			itersocket.emit('line', stamp, line, joinedName, socket.id, correctionId);
		});

		// emit a line-event with text & stamp to all sockets in that room
		rooms[joinedRoom].publicSockets.forEach(function(itersocket) {
			itersocket.emit('line', stamp, line, calculateDisplayDuration(line));
			rooms[joinedRoom].statistics.linesServed++;
		});

		// increment statistics counter
		rooms[joinedRoom].statistics.linesWritten++;

		// escape \n and \r in input
		line = line.replace('\n', '\\n').replace('\r', '\\r');

		// write a line into the logfile
		rooms[joinedRoom].logfile.write(stamp+'\t'+line+'\n', 'utf8');
	});

	socket.on('removeCorrection', function(correctionId) {
		if ((rooms[joinedRoom].speechlock && !(users[joinedName].admin || users[joinedName].speech)) || !rooms[joinedRoom].speechlock) {
			return;
		}

		rooms[joinedRoom].writerSockets.forEach(function(itersocket) {
			itersocket.emit('removeCorrection', correctionId);
		});
	});

	socket.on('correct', function(line) {
		if(!joinedName) {
			return;
		}
		if ((rooms[joinedRoom].speechlock && !(users[joinedName].admin || users[joinedName].speech)) || !rooms[joinedRoom].speechlock) {
			return;
		}

		console.log('line for correction from %s for room %s: %s', socket.id, joinedRoom, line);

		// stamp it
		if(partlineStamp) {
			console.log('using existing partlineStamp %s to stamp the line', partlineStamp);
		}
		var stamp = partlineStamp || Date.now();
		partlineStamp = null;

		// emit a line-event with text & stamp to all sockets in that room
		rooms[joinedRoom].writerSockets.forEach(function(itersocket) {
			itersocket.emit('correct', stamp, line, joinedName, socket.id);
		});
	});

	// received a partitial line from a socket
	socket.on('partline', function(partline) {
		// sending partlines is not allowed for non-authorized users
		if(!joinedName) {
			return;
		}

		if (rooms[joinedRoom].adminlock && !users[joinedName].admin) {
			return;
		}

		if (rooms[joinedRoom].speechlock && !(users[joinedName].admin || users[joinedName].speech)) {
			return;
		}

		if(partline.length === 0) {
			partlineStamp = null;
			console.log('partline got empty from %s - unsetting partlineStamp', socket.id);
		} else if(!partlineStamp) {
			partlineStamp = Date.now();
			console.log('registering partlineStamp %s for %s', partlineStamp, socket.id);
		}

		// emit a line-event with text & stamp to all sockets in that room
		rooms[joinedRoom].writerSockets.forEach(function(itersocket) {
			itersocket.emit('partline', partline, joinedName, socket.id);
		});
	});

	socket.on('adminlock', function(cb) {
		// locking is not allowed for non-authorized users
		if(!joinedName || !users[joinedName].admin) {
			return;
		}

		if(rooms[joinedRoom].adminlock) {
			console.log('room %s already locked by %s', joinedRoom, rooms[joinedRoom].adminlock.name);
			return cb(false);
		}

		console.log('locking room %s for username %s', joinedRoom, joinedName);
		rooms[joinedRoom].adminlock = {
			id: socket.id,
			name: joinedName
		};

		rooms[joinedRoom].writerSockets.forEach(function(itersocket) {
			if(itersocket === socket) {
				return;
			}

			itersocket.emit('adminlock', joinedName);
		});

		return cb(true);
	});

	socket.on('adminunlock', function(cb) {
		if(!rooms[joinedRoom].adminlock || rooms[joinedRoom].adminlock.id !== socket.id) {
			console.log('room %s not locked or locked by a different socket, NOT unlocking', joinedRoom);
			return cb(false);
		}

		rooms[joinedRoom].writerSockets.forEach(function(itersocket) {
			if(itersocket === socket) {
				return;
			}

			itersocket.emit('adminunlock');
		});
		rooms[joinedRoom].adminlock = null;

		return cb(true);
	});

	socket.on('speechlock', function(cb) {
		// locking is not allowed for non-authorized users
		if(!joinedName) {
			return;
		}

		// locking is not allowed for non-admin users
		if(!users[joinedName].admin) {
			return;
		}

		if(rooms[joinedRoom].speechlock) {
			console.log('room', joinedRoom, 'already locked by', rooms[joinedRoom].speechlock.name);
			return cb(false);
		}

		console.log('locking room', joinedRoom, 'for username', joinedName);
		rooms[joinedRoom].speechlock = {
			id: socket.id,
			name: joinedName
		};

		rooms[joinedRoom].writerSockets.forEach(function(itersocket) {
			if(itersocket === socket) {
				return;
			}

			itersocket.emit('speechlock', joinedName);
		});

		return cb(true);
	});

	socket.on('speechunlock', function(cb) {
		if(!rooms[joinedRoom].speechlock || rooms[joinedRoom].speechlock.id !== socket.id) {
			console.log('room', joinedRoom, 'not locked or locked by a different socket, NOT unlocking');
			return cb(false);
		}

		rooms[joinedRoom].writerSockets.forEach(function(itersocket) {
			if(itersocket === socket) {
				return;
			}

			itersocket.emit('speechunlock');
		});
		rooms[joinedRoom].speechlock = null;

		return cb(true);
	});

	socket.on('speechDelay', function(delay) {
		if(!joinedName) {
			return;
		}
		if ((rooms[joinedRoom].speechlock && !(users[joinedName].admin || users[joinedName].speech)) || !rooms[joinedRoom].speechlock) {
			return;
		}
		
		rooms[joinedRoom].speechDelay = delay;
		
		rooms[joinedRoom].writerSockets.forEach(function(itersocket) {
			itersocket.emit('speechDelay', delay);
		});
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
		if(!joinedName) {
			return;
		}

		// sending lines is not allowed for non-admin users
		if(!users[joinedName].admin) {
			return;
		}

		if(!task) {
			console.log('sending usermgmt-list to %s', joinedName);
			return cb(usersWithoutPasswords());
		}

		if(task.delete) {
			if(task.username === joinedName) {
				console.log('NOT allowing user %s to delete her-/himself', task.username);
				return cb(false);
			}

			console.log('deleting user %s on behalf of %s', task.username, joinedName);
			delete users[task.username];
		} else {
			if(users[task.username]) {
				var user = users[task.username];

				if(joinedName === task.username && user.admin && !task.admin) {
					console.log('NOT allowing user %s to revoke her/hos own admin privileges', joinedName);
					delete task.admin;
				}

				if(!task.password) {
					delete task.password;
				}

				user = extend(user, task);
				var	username = task.username;

				delete user.username;
				console.log('modifying user %s on behalf of %s to %s', username, joinedName, user);
				users[username] = user;
			} else {
				if(!task.password) {
					console.log('NOT creating user without password');
					return cb(false);
				}
				var username = task.username;
				delete task.username;
				console.log('creating user %s on behalf of %s as %s', username, joinedName, task);
				users[username] = task;
			}

		}

		console.log('saving new version of users.js');
		var s = fs.createWriteStream('users.json', {encoding: 'utf-8'});
		s.write(JSON.stringify(users, null, '\t'));
		s.end();

		return cb(usersWithoutPasswords());
	});
});

// listen for connections
console.log('starting http/socket-server on port %s', config.port);
server.listen(config.port, '::');
/* vim: ts=4:sw=4:noet 
 */
