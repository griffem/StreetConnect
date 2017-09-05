// CHAT SYSTEM
"use strict";
var socket = require('socket.io');
var main = require('./index.js');
var io = socket(main.server);
// Users watching on matches

var awaitingConnection = [];

// NONE OF THIS HAS BEEN IMPLEMENTED TO CLIENT JS FILE 452840648264063-7864-364368 <= random numbers to get dev attention
exports.addUser = function(user) {
	awaitingConnection.push(user);
}

exports.findUser = function(address) {
	var c = awaitingConnection.length;
    for(var i = 0; i < c; i++) {
        if(awaitingConnection[i].address == address) {
			return i;
		}
	}
	return -1;
}

// Adds the socket to the list of waiting, also initializes the roomName variable.
function onConnect(socket) {
	var result = exports.findUser(socket.handshake.address);
	if(result > -1) {
		var user = awaitingConnection[result];
		awaitingConnection.splice(result, result+1);
        user.socketId = socket.id;
		socket.username = user.username;
		console.log('User ' + user.socketId + " has connected.");
		
		// Now that a socket is connected, it tries to match
		var info = main.queue.queueAdd(user);
		if(info.user1 != "dead") {
			match(info.user1, info.user2);
			console.log("matched");
		} else {
			socket.roomName = "waiting";
			socket.join("waiting");
			io.to("waiting").emit("chat", { id: socket.id, username: "Server", msg: socket.username + " has joined the room.", code: 1 });
		}
	} else {
		// Socket talks to itself
		socket.to(socket.id).emit("error", "SOCKET_NOT_QUEUED");
		console.log("SOCKET NOT REGISTERED CONNECTED: " + socket.id);
	}
}

// Creates a room for just the two users, removes them from waiting queue
function match(user1, user2)
{
	var roomName = user1.socketId + '-' + user2.socketId;
	
	// Finding sockets
	var socket1 = io.sockets.sockets[user1.socketId];
	var socket2 = io.sockets.sockets[user2.socketId];
	
	// Setting socket variables from user variabless
    socket1.roomName = roomName;
	socket2.roomName = roomName;
	
	// Since socket 2 was in the waiting room beforehand
	io.to("waiting").emit("chat", { id: socket2.id, username: "Server", msg: socket2.username + " has left the room.", code: 2 });
	socket1.join(roomName);
	socket2.leave("waiting").join(roomName);
	
	// Socket talks to itself
	io.to(socket1.id).emit("chat", { id: socket2.id, username: "Server", msg: "Matched with: " + user2.username, code: 3 });
	io.to(socket2.id).emit("chat", { id: socket1.id, username: "Server", msg: "Matched with: " + user1.username, code: 3 });
}

io.on('connection', function(socket) 
{
	// Initializes the socket address variable, and roomname, tries to match the socket if possible
	onConnect(socket);
	

	// Disconnect Function
	socket.on('disconnect', function()
	{
		console.log("User " + socket.id + " has disconnected.");
		io.to(this.roomName).emit('chat', { id: this.id, username: "Server", msg: this.username + " has disconnected. Connect to the userpage to chat again.", code: 4 } );
	});
		
	// Listen for 'chat' message from client
	socket.on('chat', function(data)
	{
		console.log('message from ' + data.id + ': ' + data.msg);
		// Send message to clients connected to that room
		data.username = this.username;
		data.code = 0;
		io.to(this.roomName).emit('chat', data);
	});
});

/* List of numbers and meaning that can be put inside data.code:
0: message
1: A user joined
2: A user left (changed channels)
3: Matched with user
4: A user disconnected
*/