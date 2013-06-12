var sqlite3 = require('sqlite3').verbose(),
	io = require('socket.io').listen(2001);

io.sockets.on('connection', function (socket) {
	
	setInterval(function(){
		var data_string = generateDeviceData();
		socket.emit('data-feed',data_string);
	},5000);

	socket.on('disconnect', function () {
		clearInterval(tweets);
	});
});


function generateDeviceData(){
	var time = 5*60;
	var session_id = "x0a0a1234";
	var energy_consumption = Math.floor((Math.random()*10)+1);
	return "session_id="+session_id+"&energy_consumption="+energy_consumption+"&time="+time
}
