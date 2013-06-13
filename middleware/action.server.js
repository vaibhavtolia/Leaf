var query_string = require('querystring'),
	crypto = require('crypto'),
	api = require('./api/controller/api.controller'),
	io = require('socket.io').listen(2002);

io.sockets.on('connection', function (socket) {
	
	//console.log("socket : ",socket)
	
	socket.on('action',function(data){
		parsedData = query_string.parse(data);
		//console.log(parsedData);
		if( parsedData.device_id != null && parsedData.action != null && parsedData.client_id != null ){
			parsedData.action = query_string.parse(parsedData.action);
			parsedData.key = '221b368d7f5f597867f525971f28ff75';
			//console.log(parsedData);
			api.addDeviceSession(parsedData,function(data){
				if(data.status == "OK"){
					var session_id = data.session_id;
					var action = query_string.stringify(parsedData.action);
					console.log(action);
					var msg = create_AT_message( action , parsedData.device_id, parsedData.client_id, session_id);//convert client to trigerrer
					socket.broadcast.emit('action-triggered',msg);
					console.log("Sent action to device: ", parsedData.device_id);
				}
			})
		}
	});
	
	
	socket.on('action-response',function(data){
		var parsedData = query_string.parse(data);
		if( parsedData.session_id != null && parsedData.energy_consumption != null && parsedData.time != null && parsedData.status != null && parsedData.client_id != null && parsedData.device_id != null && parsedData.device_status != null ){
			parsedData.key = '221b368d7f5f597867f525971f28ff75';
			api.updateDeviceStatus(parsedData,function(data){
				console.log("action-response : ", data);
				if(data.status == "OK"){
					var response = { "status" : "OK", "msg" : "action done successfully"}
					response = query_string.stringify(response);
					socket.broadcast.emit('action-acknowledgement',response);
				}
			})
		}
		else{
			console.log('params missing');
		}
	});

});


function create_AT_message(action,device,triggerer,session){
	var data = "session_id=" + session + "&client_id=" + triggerer + "&device_id=" + device + "&action=" + action;
	return data;
}

function actionOccured(data){
	//eventhandler
	return;
}
