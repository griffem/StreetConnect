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
	return false;
}

// Adds the socket to the list of waiting, also initializes the roomName variable.
function onConnect(socket) {
	var index = exports.findUser(socket.handshake.address)
	if(index != false) {
		awaitingConnection.splice(index, index+1);
        user.socketId = socket.id;
			
        socket.roomName = "waiting";
		console.log('User ' + user.socketId + " has connected.");
			
		// Now that a socket is connected, it tries to match
		var info = main.queue.queueAdd(user);
		if(info.user1 != "dead") {
			match(info.user1, info.user2);
		} else {
			io.to("waiting").emit(user.username + " has joined the room.");
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
	socket1.userName = user1.username;
	socket2.userName = user2.username;
	
	// Moving sockets from waiting room to user room
	socket1.leave("waiting").join(roomName);
	socket2.leave("waiting").join(roomName);
	// Socket talks to itself
	socket1.to(socket1.id).emit("Matched with: " + user2.username);
	socket2.to(socket2.id).emit("Matched with: " + user1.username);
}

io.on('connection', function(socket) 
{
	onConnect(socket);
	// Adds the socket to the list of waiting, also initializes the roomName variable.

	//disconnect
	socket.on('disconnect', function()
	{
		console.log("User " + socket.id + " has disconnected.");
		io.to(socket.roomName).emit('chat', { name: socket.id, username: socket.username, msg: "The other user has disconnected." } );
	});
		
	//listen for 'chat' message from client
	socket.on('chat', function(data)
	{
		console.log('message from ' + data.name + ' : ' + data.msg);
		//send message to clients connected to that room
		data.username = this.username;
		console.log(data);
		io.to(this.roomName).emit('chat', data);
	});
	
	socket.on('notify', function(user)
	{
		io.emit('notify', user);
	});
});