var sqlite3 = require('sqlite3').verbose(),
	io = require('socket.io').listen(2001);

io.sockets.on('connection', function (socket) {
	
	var data_feed = setInterval(function(){
		var data_string = generateDeviceData();
		socket.emit('data-feed',data_string);
	},5000);

	socket.on('disconnect', function () {
		clearInterval(data_feed);
	});
});


function generateDeviceData(){
	var time = 5*60;
	var session_id = 1;
	var energy_consumption = Math.floor((Math.random()*10)+1);
	return "session_id="+session_id+"&energy_consumption="+energy_consumption+"&time="+time+"&key=b3be6b55584e1a4e13928e8fdb6e1e5f"
}
