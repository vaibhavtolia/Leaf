var io = require('socket.io-client'),
	query_string = require('querystring');

var clients = [1,2,3,4,5];

socket = io.connect('localhost', {
    port: 2002
});

socket.on('connect', function () { 

	var interval = setInterval(function(){
		generateDeviceAction(sendAction);
	},7000);
});

socket.on('action-acknowledgement',function(data){
	parsedData = query_string.parse(data);
	console.log("Action acknowledgement recieved...");
	console.log(parsedData);
	
});

function generateDeviceAction(callback){
	var device_action = {
		device_id : Math.floor((Math.random()*10)+1),
		action : query_string.stringify({ 'status' : Math.floor((Math.random()*2)) }),
		client_id : clients[Math.floor((Math.random()*5))]
	}
	var msg = query_string.stringify(device_action);
	callback && callback(msg);
}

function sendAction(msg){
	//console.log(msg);
	socket.emit('action',msg);
	console.log("changing status of device "+ query_string.parse(msg).device_id );
	//console.log('msg sent')
}