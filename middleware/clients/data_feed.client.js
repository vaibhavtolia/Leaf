var query_string = require('querystring'),
sqlite3 = require('sqlite3').verbose(),
	 io = require('socket.io-client');

socket = io.connect('localhost', {
    port: 2001
});

socket.on('connect', function () { 
	console.log("socket connected"); 
});

socket.on('data-feed',function(data){
	storeConsumptionData(data);
})

function storeConsumptionData(data){
	var feed_data = query_string.parse(data);
	console.log(feed_data);
}