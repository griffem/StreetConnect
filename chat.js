// CHAT SYSTEM
"use strict";
var socket = require('socket.io');
var main = require('./index.js');
var queue = require('./queue');
var io = socket(main.server);
var socketFile = require('./socket');
// Users watching on matches
var waiting = [];
var awaitingConnection = [];
// NONE OF THIS HAS BEEN IMPLEMENTED TO CLIENT JS FILE 452840648264063-7864-364368 <= random numbers to get dev attention
exports.addUser = function(user) {
	awaitingConnection.push(user);
}



// Creates a room for just the two users, removes them from waiting queue
exports.match = function(user1, user2)
{
	
	var roomName = user1.socketId + '-' + user2.socketId;
	console.log(roomName);
	
	var socket1 = io.sockets.sockets[user1.socketId];
	var socket2 = io.sockets.sockets[user2.socketId];
	console.log(socket1);
	/*
    socket1.roomName = roomName;
	socket2.roomName = roomName;
	socket1.leave("waiting").join(roomName);
	socket2.leave("waiting").join(roomName);
	
	for(var i = 0; i < waiting.length; i++) {
		if(waiting[i] == user1 || waiting[i] == user2) {
			waiting[i].splice(i, i+1);
			i--;
		}
	}
	
	// Socket talks to itself
	socket1.to(socket1.id, "Matched with: " + user2.username);
	socket2.to(socket2.id, "Matched with: " + user1.username);
	*/
	console.log('inmatchfunction');
	//socketFile.socketFile(io);
}

io.on('connection', function(socket) 
{
	console.log('User ' + socket.id + " has connected.");
		addSocket(socket);
		// Adds the socket to the list of waiting, also initializes the roomName variable.

		//disconnect
		socket.on('disconnect', function()
		{
			console.log("User " + socket.id + " has disconnected.");
			removeSocket(this.socket);
		});
		
		//listen for 'chat' message from client
		socket.on('chat', function(data)
		{
			console.log('message from ' + data.name + ' : ' + data.msg);
			//send message to clients connected to that room
			this.socket.to(this.socket.roomName).emit('chat', data); 
		});
	
		socket.on('notify', function(user)
		{
			io.emit('notify', user);
		});
});

// Adds the socket to the list of waiting, also initializes the roomName variable.
function addSocket(socket) {
	var c = awaitingConnection.length;
	console.log(c);
    for(var i = 0; i < c; i++) {
        if(awaitingConnection[i].address == socket.handshake.address) {
            awaitingConnection[i].socketId = socket.id;
            console.log(socket.id);
            console.log('User ' + awaitingConnection[i].socketId + " has connected.");

			console.log(c);
			waiting.push(awaitingConnection[i]);
			console.log(c);
			awaitingConnection.splice (i, i+1);
			console.log(c);
            socket.roomName = "waiting";
            return;
		}
		console.log(c);
    }
    // Socket talks to itself
    socket.to(socket.id).emit("error", "SOCKET_NOT_QUEUED");
    console.log("SOCKET NOT REGISTERED CONNECTED: " + socket.id);
}

// Makes sure all registered info of the user/socket is gone
function removeSocket(socket) {
	var c = waiting.length;
	for(var i = 0; i < c; i++) {
		if(waiting[i].address == socket.handshake.address) {
			queue.removeUser(waiting[i]);
			waiting[i].splice(i, i+1);
			return;
		}
	}
	
	// If the socket isn't in the waitlist
	// CODE TELLING SOCKETS THAT OTHER USER HAS LEFT, return if you find the socket
	
	// If the socket isn't on either:
	console.log("SOCKET NOT REGISTERED DISCONNECTED: " + socket.id)
}