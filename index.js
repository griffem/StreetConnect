//----------|SERVER SIDE|----------------------
"use strict";
var express = require('express');
var bodyParser = require('body-parser');

//setup express
var app = express();
exports.server = app.listen(3000);

//bodyParser setup
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
//use static files
app.use(express.static('public'));

//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');


var chat = require('./chat');
// banSystem = require('./bansystem');
exports.queue = require('./queue');

app.get('/', function(req, res)
{
    res.sendFile(__dirname + '/public/funk-chat/index.html')
});


app.post('/', function (req, res, next) {
	
	// Forms testing
    //var form = new formidable.IncomingForm();
	
	var address = req.connection.remoteAddress;
	// Ban System Check => COMMENT OUT IF YOU DON'T WANT TO BOTHER WITH MONGO
	/*if(banSystem.userConnect(address, res)) {
		res.redirect("www.lemonparty.org");
		return;
	}*/
	
	chat.addUser(new exports.queue.User(address, req.body.name, req.body.interests));
	res.redirect('/chat');
});

app.get('/chat', function(req, res)
{
	//if(chat.findUser(res.connection.remoteAddress) != false) {
		res.sendFile(__dirname + '/public/funk-chat/chat.html');
	/*} else {
		res.redirect('/');
	}*/
});
