
/*
// This is mostly unchanged, TODO: revamp
exports.socketFile = function (io) {
        io.on('connection', function(socket) {

	
	addSocket(socket);
	// Adds the socket to the list of waiting, also initializes the roomName variable.
	function addSocket(socket) {
	var c = waiting.length;
	for(var i = 0; i < c; i++) {
		var address = socket.handshake.address;
		if(waiting[i].address == address.address) {
			waiting[i].socketId = socket.id;
			socket.roomName = "waiting";
			console.log('User ' + socket.id + " has connected.");
			return;
		}
	}
	// Socket talks to itself
	socket.to(socket.id).emit("error", "SOCKET_NOT_QUEUED");
	console.log("SOCKET NOT REGISTERED CONNECTED: " + socket.id);
	}	
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
}
*/