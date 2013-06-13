var io = require('socket.io-client'),
	query_string = require('querystring'),
	_und = require('underscore');

var devices = [];

socket = io.connect('localhost', {
    port: 2002
});

socket.on('connect', function () { 
	console.log("socket connected");
});


socket.on('action-triggered',function(data){
		parsedData = query_string.parse(data)
		//console.log(parsedData);
		updateDevices(parsedData,sendActionTriggerData);
});


function updateDevices(data,callback){
	var device_id = data.device_id;
	var device_obj = _und.where(devices,{'id' : device_id})
	console.log(device_obj[0]);
	data.action = query_string.parse(data.action);
	//console.log(data.action);
	if( devices.length > 0 && device_obj.length > 0 ){
		if( device_obj[0].action.status != data.action.status ){
			console.log('device status changed')
			device_obj[0].action = data.action;
			var energy_consumption = device_obj[0].energy_consumption;
			var time = new Date().getTime() - device_obj[0].time;
			var status = data.action.status;
			var msg = "session_id="+device_obj.session_id+"&energy_consumption="+energy_consumption+"&time="+time+"&device_status="+status+"&client_id="+data.client_id+"&device_id="+device_id+"&status=1";
			callback(msg);
		}
		else{
			console.log('device status unchanged')
		}
	}
	else{
		console.log('no devices found yet adding device');
		var obj = {
			'id' : data.device_id,
			'action' : data.action,
			'energy_consumption' : 0,
			'time' : new Date().getTime(),
			'session_id' : data.session_id
		}
		devices.push(obj);
		//console.log(devices);
		var status = data.action.status;
		var msg = "session_id="+obj.session_id+"&energy_consumption="+obj.energy_consumption+"&time="+0+"&device_status="+status+"&client_id="+data.client_id+"&device_id="+device_id+"&status=1";
		callback(msg);
	}
}

function sendActionTriggerData(msg){
	socket.emit('action-response',msg);
	console.log("Action done succesfully");
}