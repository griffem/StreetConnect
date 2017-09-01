/*  // ADD TO HOMEPAGE JS FILE
var formidable = require("formidable");
var queue = require("./queue.js");
app.post('/', function (req, res) {
    res.send('POST request to the homepage')
    var form = new formidable.IncomingForm();
	queue.queueAdd(req.connection.remoteAddress, form.name, form.interests);
});

// ADD TO DISCONNECT FUNCTION


// ADD TO THE HOMEPAGE HTML
// Each interest is seperated by a comma and/or a space
<label for="name">Name:</label>
<input type="text" id="name" name="name" placeholder="Enter in username" />
<br />
<label for="interests">Interests:</label>
<input type="interests" id="interests" name="interests" placeholder="Seperate interests by a comma" />  */

// START OF ACTUAL QUEUE FILE

var highPriority = 10;

exports.User = function(address, username, interests) {
	this.address = address;
	this.username = username;
	this.interests = parseInterests(interests);
	this.socketId;
}

exports.removeUser = function(user) {
	for(var a = 0; a < interestsList.length; a++) {
		if(interestMatch(interestsList[a].interest, user.interests)) {
			interestsList.splice(a, a+1);
			a--;
		}
	}
}

var chat = require('./chat');
// the amount of users that can go through the queue before current user can be placed in high priority
exports.queueAdd = function(userAdded, chat) {
	for(var i = 0; i < interestsList.length; i++) {
		var interestCat = interestsList[i];
		if(interestMatch(interestCat.interest, userAdded.interests)) {
			chat.match(userAdded, interestCat.user);// INSERT FUNCTION 
			exports.removeUser(interestCat.user);
			return;
		} else {
			interestCat.count += 1;
			console.log(interestCat.count);
			if(interestCat.count >= highPriority) {
				highPriorityAdd(interestCat.user, chat);
				interestsList.splice(i, i+1);
				i--;
			}
		}
	}
	
	var listCount = userAdded.interests.length;
	for(var i = 0; i < listCount; i++) {
		interestsList.push(new InterestCategory(userAdded.interests[i], userAdded));
	}
}

function InterestCategory(interestName, user) {
	this.interest = interestName;
	// used to be this.users = [];, but as the queue works currently, if there are two users in a catagory, they are matched anyway, so having an array is a memory waste
	this.user = user;
	// for high priority queue, would have been put in the user object, but, you just have to index more if it was in a user object for the same reason as above ^
	this.count = 0;
}

var interestsList = [];
// A list isn't necessary bc these users will be instantly matched because of the same reason as above ^^
var highPriorityUser = "";

function parseInterests(interests) {
	// checking there is any reason to split string
	var interestList;
	if(interests.indexOf(",") > -1) {
		interestList = interests.split(",");
	} else {
		interestList = [interests];
	}
	
	for(var i = 0; i < interestList.length; i++) {
		var current = interestList[i];
		// fixes what happens when commas are put at: beginning "hi,dude,", end ",hi,dude", or sequentially "hi,,dude"
		if(current == '' || current == undefined) {
			interestList.splice(i, i+1);
			i--;
			// cannot do charAt() if a blank string
		} else {
			// checks each interest for spaces before
			if (current.charAt(0) == " ") {
				while(current.charAt(0) == " ") {
					current = current.slice(1);
					console.log("test");
				}
				interestList[i] == current;
			}
			// checks each interest for spaces after
			if (current.charAt(current.length-1) == " ") {
				while(current.charAt(current.length-1) == " ") {
					current = current.substr(0, str.length-1);
				}
				interestList[i] == current;
			}
		}
	}
	console.log(interestList);
	return interestList;
}

// check if anything in the string array matches the one string
function interestMatch(interest, interestList) {
	var count = interestList.length;
	for(var i = 0; i < count; i++) {
		if(interest == interestList[i]) {
			return true;
		}
	}
	return false;
}

function highPriorityAdd(user, chat) {
	if(highPriorityUser != "") {
		console.log("high user matched");
		chat.match(user, highPriorityUser)// INSERT FUNCTION 
		highPriorityUser = "";
	} else {
		highPriorityUser = user;
	}
}