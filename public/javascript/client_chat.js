//----------|CLIENT SIDE|----------------------

//make connection on front end on port 3000
var socket= io.connect("http://localhost:3000");

var sentMessage = document.getElementById('message');
var messages = document.getElementById('messages');
//var blacklist = ['kik', 'k i k'];
/*
function bl()
{
    var m = document.getElementById('message').value.tolowerCase();
    for(var i=0; i<blacklist.length; i++)
    {
        if(m.indexOf(blacklist[i].toLowerCase()) > -1)
        {

        }
    }
    submit(m);
}
*/
function submit()
{
    socket.emit('chat', { msg: document.getElementById('message').value, id: socket.id});
    document.getElementById('message').value = "";
}

var typing = false;
var timeout;

function timeoutFunction()
{
    typing = false;
    socket.emit('notify', false);  
}

function notifyTyping()
{
    if(typing == false)
    {
        typing == true;
        socket.emit('notify');
        timeout = setTimeout(timeoutFunction, 5000);
    }
    else
    {
        clearTimeout(timeout);
        timeout = setTimeout(timeoutFunction, 5000);
    }
}



socket.on('chat', function(data)
{
    document.getElementById('messages').innerHTML += '<p><li>' + '<b>' + data.username + '</b><br>' + data.msg + "</li></p>";
});

socket.on(socket.id, function(data)
{
    document.getElementById('messages').innerHTML += '<p><li>' + '<b>' + data.username + '</b><br>' + data.msg + "</li></p>";
});

socket.on('notify', function(user)
{
    if(user)
    {
        document.getElementById('notify').innerHTML = user + " is typing...";
    }
    else
    {
        document.getElementById('notify').innerHTML = "";
    }
}); 








