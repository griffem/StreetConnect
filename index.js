//----------|SERVER SIDE|----------------------
"use strict";

//setup express
var express = require('express');
var app = express();
exports.server = app.listen(3000);

// Setup database 
exports.mongoose = require('mongoose');
exports.db = mongoose.createConnection("mongodb://localhost:27017/myproject"); // CREATE YOUR OWN MONGO SERVER WITH SAME PORT
exports.db.on('error', console.error.bind(console, 'mongodb connection error:'));

//bodyParser setup
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// CookieParser setup
var cookieParser = require('cookie-parser');
app.use(cookieParser());

// Setting up paths of use
var path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views')); 

// Setting up server request logger
var logger = require('morgan');
app.use(logger('dev')); 

// Handlebars View Engine setup
var handlebars  = require('express-handlebars');
app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Router setup
var router = express.Router();
app.use(router);

// Homemade files setup
var chat = require('./chat');
//var banSystem = require('./bansystem');
exports.queue = require('./queue');

// GET and POST management
app.get('/', function(req, res)
{
    res.sendFile('index.html')
});

app.post('/', function (req, res, next) {
	var address = req.connection.remoteAddress;
	// Ban System Check => COMMENT OUT IF YOU DON'T WANT TO BOTHER WITH MONGO
	/*if(banSystem.userConnect(address, res)) {
		res.redirect("www.lemonparty.org");
		return;
	}*/
	
	chat.addUser(new exports.queue.User(address, req.body.name, req.body.interests));
	res.redirect('/chat');
});

router.get('/chat', function(req, res)
{
	if(chat.findUser(req.connection.remoteAddress) > -1) {
		next();
	} else {
		res.redirect('/');
	}
});

// ERROR HANDLING CODE BELOW
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


app.use(function(req, res, next) {  
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

