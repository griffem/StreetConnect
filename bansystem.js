"use strict";
var express = require("express");
var app = express();
var assert = require('assert');

var mongoose = require('mongoose');
var url = "mongodb://localhost:27017/myproject" // CREATE YOUR OWN MONGO SERVER WITH SAME PORT
var db = mongoose.createConnection(url);
db.on('error', console.error.bind(console, 'connection error:'));

var collectionName = "ipaddresses";

var banSchema = new mongoose.Schema( { ip : String, reports : Number, ban : Number } );
var banModel = db.model(collectionName, banSchema);

var banTime = 60000; // banTime is in milliseconds

// Checks if ip address is in db, and if it is, adds one to it, if it isn't creates it and adds one to it. If it reaches three, a ban timeout of 3 days is set.
function addOne(address) {
	banModel.findOne( { ip : address }, function response(err, docs) {
		if (err) throw err;
		if (docs) {
			var debugData = banData(address, docs, true)
			console.log(debugData.reports);
			debugData.save(function(err, user) { if (err) throw err; }); // DEBUG THIS LINE OF CODE
			
		} else {
			console.log("saved data");
			banData(address, 
			new banModel( { ip : address, reports : 0, ban : 0 } ), 
			true).save(function(err, user) { if (err) throw err;  });
		}
	});
}

// Returns proper updated ban data, if reported is false, unbans user
function banData(address, docs, reported) {
	if(reported) {
		docs.reports += 1;
		if (docs.reports >= 3) { docs.ban = Date.now() + banTime; docs.reports = 0; }
	} else {
		docs.ban = 0;
		
	}
	return docs;
}

var isBan = false;
// Checks if user is banned
function banned(address) {
	banModel.findOne( { ip : address}, function response(err, docs) {
		if (err) throw err;
		if (docs) {
			if (docs.ban == 0) {
				console.log("not banned");
				isBan = false;
			} else {
				if(Date.now() > docs.ban) {
					banData(address, docs, false).save(function(err, user) { if (err) throw err; });
					console.log("not banned but unrekt");
					isBan = false;
				} else {
					console.log("banned");
					// Have to use global variable bc callback function
					isBan = true;
				}
			}
		}
	});
}

// Reports user, address is ip address
exports.report = function(address) {
	addOne(address, banModel);
}

// Returns if a user is banned or not
exports.userConnect = function(address) {
	banned(address)
	return isBan;
}