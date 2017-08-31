//----------|SERVER SIDE|----------------------
"use strict";
var express = require('express');
var chat = require('./chat');
// banSystem = require('./bansystem');
var queue = require('./queue');
var bodyParser = require('body-parser');

//setup express
var app = express();
exports.server = app.listen(3000);

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
//use static files
app.use(express.static('funk-chat'));

app.get('/', function(req, res)
{
    res.sendFile(__dirname + '/public/funk-chat/index.html')
});


app.post('/', function (req, res, next) {
	
	// Forms testing
    //var form = new formidable.IncomingForm();
    console.log('info sent');
    console.log(req.body.interests);
    console.log(req.body.name);
	
	var address = req.connection.remoteAddress;
	// Ban System Check => COMMENT OUT IF YOU DON'T WANT TO BOTHER WITH MONGO
	/*if(banSystem.userConnect(address, res)) {
		res.redirect("www.lemonparty.org");
		return;
	}*/
	
	var user = new queue.User(address, req.body.name, req.body.interests);
	chat.addUser(user)
    queue.queueAdd(user, chat);
    res.redirect('/chat');
});

app.get('/chat', function(req, res)
{
    res.sendFile(__dirname + '/public/funk-chat/chat.html');
});
