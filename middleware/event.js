/*protocol used till now
room will generally be null
if room is not null, then all devices off type device_id in room
if device_id is negative, then all devices in room
if room is negative, then all rooms
time is in secs, +ve, means >, -ve means less than
energy is in ?, +ve, means >, -ve means less than
timetpe is consecutive or in a day
energytype is individual or additive
exp_time is expected time of this semievent occuring
event_id is the event this semievent is a part of
negation?
clause_id is the semievent, PRimARY key


Table event
name
event_id
action
enabled/disabled?
exp_time (max of all in prev table)

*/
//Fields .. device_id, room_id, roomtype, .., event_id, exp_time
//Mapping of callback_id to file to be run?, enabled/disabled?,event_id, exp_time(max)
//Assuming AND based


var api = require('./api/controller/api.controller.js');
//var events = require('events');
//var eventEmitter = new events.eventEmitter();
var query_string = require('querystring');

var INF = -1;//infinity



function create_event(event){
//mostly convert english statement to a set of fields
//maybe extract from some other file
	device = event.device;
	room = event.room;
	time = event.time;
	energy = event.energy;
	energytype = event.energytype; 
	timetype = event.timetype;
	exp_time = event.exp_time;
	clause_id = unique_clause_id();
	event_id = unique_event_id();
	eventName = event.eventName;
	action = event.action;

//Test data
	device = "";
	room = "";
	time = "10000";
	energy = "";
	energytype = ""; 
	timetype = "c";
	exp_time = (new Date().getTime() + 10000).toString();
	eventName = "Init";
	action = "SomeAction";
	
	query = {
		"device"	:	device,
		"room"		:	room,
		"time"		:	time,
		"energy"	:	energy,
		"energytype":	energytype,
		"timetype"	:	timetype,
		"exp_time"	:	exp_time,
		"clause_id"	:	clause_id,
		"event_id"	:	event_id,
		"key"		:	"221b368d7f5f597867f525971f28ff75"
	};
	api.InsertSemievent(query,function(){
			query = {
				"name"		:	eventName,
				"action"	:	action,
				
				"exp_time"	:	exp_time,
				"event_id"	:	event_id,
				"key"		:	"221b368d7f5f597867f525971f28ff75"
			};
			api.InsertEvent(query,function(){
				//eventEmitter.on('event'+event_id,actionParse(event_id,action));
			});
	});
//Create node event and its associated function actionParse(eventId, action)
}

function delete_event(){

}

function actionParse(eventId, action){
	//first check if the event has been triggered


}


function delete_cron(callback_id){
	clearTimeout(callback_id);
}


function rate_of_consumption2(device_id_array,size,callback,params,net){
	if(size == 0) 
	{
		callback(params,net);
		return;
	}
	sum = 0;
	rate_of_consumption2(device_id_array,size-1,callback,params,1);
	//do the querying and use energy_used_today2(device_id_array,size-1,callback,net,params) as callback

}

function ComputeAndStoreExpTime(event,clause_id){
	query = {
		"id"		:	clause_id,
		"key"		:	"221b368d7f5f597867f525971f28ff75"
	};
	
	api.renderSemieventsQuery(query,function(row){
		createArrayAndComputeStoreTime(row,clause_id,event);
	});
}

function eventhandler(event){
//check if each event is set, then run the application
	eventParsed = query_string.parse(event);
	var device = eventParsed.device;
	
	var room = room_from_device(eventParsed.device);
	

	query = {
			"key"		:	"221b368d7f5f597867f525971f28ff75"
	};
	api.renderAllSemieventQuery(query,function(rows){
		size = rows.length;
		for(i = 0;i<size; i++){
			if((rows[i].device_id == device)||((rows[i].device_id == "-1")&&(rows[i].room_id == room))||( (rows[i].device_id == "")&&(rows[i].room_id == "-1") )){
			    ComputeAndStoreExpTime(event,rows[i].clause_id);
			}
		}
	});
}

function room_from_device(device){
	//TBD
	return 1;
}

function positive(str){
	return (str.substr(0,1)=="+");
}


function time_run_today2(device_id_array,size,callback,net,params){
//obtain from sessions
	if(size == 0) {
		callback(params,net);
		return;
	}
	now = new Date().getTime();
	var date = new Date(now*1000);
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var seconds = date.getSeconds();
	today = now - 3600*hours - 60*minutes - seconds;

	//do the querying and use energy_used_today2(device_id_array,size-1,callback,net,params) as callback
	query = {
		"device_id"		:	device_id_array[size]-1,
		"today"			:	today,
		"key"			:	"221b368d7f5f597867f525971f28ff75"
	};
	api.renderSessionTimeQuery(query ,function(rows){
// AND timestamp_action_start > '" + today + "'
		time = net;
		size2 = rows.length;
		for(i = 0;i< size2; i++){
			if(rows[i].timestamp_action_end != "")
			time = time + rows[i].timestamp_action_end - rows[i].timestamp_action_start;
		}
		if(rows[size2-1].timestamp_action_end == ""){
			now = new Date().getTime();
			time = time + now - rows[i].timestamp_action_start;
		}
		time_run_today2(device_id_array,size-1,callback,time,params);
	});
}

function energy_used_today2(device_id_array,size,callback,net,params){
// obtain from sessions
	if(size == 0) callback(params,net);
	now = new Date().getTime();
	var date = new Date(now*1000);
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var seconds = date.getSeconds();
	today = now - 3600*hours - 60*minutes - seconds;
	//do the querying and use energy_used_today2(device_id_array,size-1,callback,net,params) as callback
	query = {
		"device_id"		:	device_id_array[size]-1,
		"today"			:	today,
		"key"			:	"221b368d7f5f597867f525971f28ff75"
	};
	api.renderSessionTimeQuery(query ,function(rows){
		energy = net;
		size2 = rows.length;
		for(i = 0;i< size2; i++){
			energy = energy + rows[i].energy;
		}
		energy_run_today2(device_id_array,size-1,callback,time,params);
	});
}

function energy_used_in_last_session(device_id_array,size,callback,net,params){
	//obtain from sessions
	if(size == 0) callback(params,net);
	//do the querying and use energy_used_today2(device_id_array,size-1,callback,net,params) as callback
	query = {
		"device_id"		:	device_id_array[size]-1,
		"today"			:	0,
		"key"			:	"221b368d7f5f597867f525971f28ff75"
	};
	api.renderSessionTimeQuery(query ,function(rows){
		energy = net;
		size2 = rows.length;
		for(i = 0;i< size2; i++){
			energy = energy + rows[i].energy;
		}
		energy_run_today2(device_id_array,size-1,callback,time,params);
	});

}


function check_semi_event(clause_id){
	//TBD

}

function unique_event_id(){
	//TBD
	return 1;
}

function unique_clause_id(){
	//TBD
	return 1;
}

periodForCheck = 300000;
function periodicCheck(){
	var query = {
		"key"	:	"221b368d7f5f597867f525971f28ff75"
	};
	api.renderAllEventsQuery(query,function(setOfEvents){
		size = setOfEvents.length;
		for (i = 0;i < size; i++){
			exptime = setOfEvents[i].exp_time;
			var delay = parseInt(exptime) - new Date().getTime();
			if(delay < periodForCheck){
				var timeout = setTimeout(function(){emit('event'+setOfEvents[i].event_id);},delay);
			}
		}
	});
}


function createArrayAndComputeStoreTime(row,clause_id,event){
	var query = {
		"key"	:	"221b368d7f5f597867f525971f28ff75"
	};
	api.renderAllDevices(query,rows){
		arrayOfDevices = new Array();
		size = rows.length;
		console.log(size);
		for(i =0;i<size;i++){
			if(rows[i].id == row.device_id){
				type = rows[i].type;
			}
		}

		index  = 0;
		for(i = 0; i< size; i++){
			if(rows[i].status == "1"){
				if(row.room_id == ""){
					arrayOfDevices[0] = rows.device;
				}
				else if((row.device_id == "-1")&&(row.room_id == "-1")){
						arrayOfDevices[index] = rows[i].id;
						index = index + 1;
				}
				else if((row.device_id == "-1")&&(row.room_id != "")){
					if(rows[i].room_id == row.room_id){
						arrayOfDevices[index] = rows[i].id;
						index = index + 1;
					}
				}
				else if((row.device_id != "")&&(row.room_id == "-1")){
					if(rows[i].type == type){
						arrayOfDevices[index] = rows[i].id;
						index = index + 1;
					}
				}
				else if((row.device_id != "")&&(row.room_id != "")){
					if((rows[i].type == type)&&(rows[i].room_id == row.room_id)){
						arrayOfDevices[index] = rows[i].id;
						index = index + 1;
					}			
				}
			}
		}
		computeStoreTime(arrayOfDevices,clause_id,event);
	});

}

function computeStoreTime(array_of_devices,clause_id,event){
	var query = {
		"clause_id"	:	clause_id,
		"key"	:	"221b368d7f5f597867f525971f28ff75"
	};
	
	api.renderSemieventQuery(query,function(row){
		count = array_of_devices.length;
		params = {
			"row"	:	row,
			"event"	:	event,
			"clause_id"	:	clause_id,
			"array"		:	array_of_devices
		};
		rate_of_consumption2(array_of_devices,count,TimeOrEnergyCompute,params,0);
	});
}

function TimeOrEnergyCompute(params,rate){
	timetype = params.row.timetype;
	time = params.row.time;
	//negation = row.negation;
	count = params.array.length;
	newparams = {
		"row"	:	params.row,
		"event"	:	params.event,
		"clause_id"	:	params.clause_id,
		"rate"	:	rate,
		"count"	:	count
	}
	if(time!=""){
		time_run_today2(params.array,count,computeExpTimeAfterSessions, 0, newparams);	
	}
	else{
		if(timetype == "c"){
			energy_used_today2(params.array,count,computeExpTimeAfterSessions, 0, newparams);
		}
		else{
			energy_used_in_last_session(params.array,count,computeExpTimeAfterSessions, 0, newparams);
		}
	}
}

function computeExpTimeAfterSessions(params,net){
	room = params.row.room;
	device_id = params.row.device_id;
	energytype = params.row.energytype;
	timetype = params.row.timetype;
	energy = params.row.energy;
	time = params.row.time;
	count = params.count;
	
	eventParsed = query_string.parse(params.event);
	status = eventParsed.status
	eventdevice = eventParsed.device;
	
	time_run_today = net;
	energy_run_today = net;
	energy_used_in_last_session = net;
	
	now = new Date().getTime();

	if(time != ""){
		if(status == "0"){
			if((positive(time) == 1)&&(count == 0)){//should count = 1 or 0
				exptime = INF;
			}
			else{
				//TBD but should be NULL
			}
		}
		else if(status == "1"){
			if((timetype == "c")&&(count == 0)){//consecutive count = 0 or 1
				exptime = now + parseInt(time);
			} 
			else if((timetype == "d")&&(count == 0)){
				timerun = time_run_today;
				exptime = now + parseInt(time) - timerun;
			}
			else{
				//TBD, but mostly is null
			}
		}
		else{
			//TBD, but mostly is null
		}
	}
	else if(energy != ""){
		if((status == "0")&&(count == 0)){// or 1
			exptime = INF;
		}
		else {
			if(timetype == "c"){//consecutive
				energyused = energy_in_last_session;
				exptime = now + parseInt(energy) - energyused/params.rate;
			}
			else if(timetype == "d"){
				energyused = energy_used_today;//maybe it would be better to store?
				exptime = now + parseInt(energy) - energyused/params.rate;
			}
		}
	}
	else{
		if (energyconsumption != ""){
			if(timetype == "c"){//consecutive
				energyused = energy_used_in_last_session;
				exptime = now + parseInt(energy) - energyused/params.rate;
			}
			else if(timetype == "d"){
				energyused = energy_used_today;//maybe it would be better to store?
				exptime = now + parseInt(energy) - energyused/params.rate;
			}
		}
	}
	storeExpTimeEvent(params.clause_id,exptime);
}

function storeExpTimeEvent(clause_id,exptime){
	query = {
			"id"		:	clause_id,
			"exp_time"	:	exptime,
			"key"		:	"221b368d7f5f597867f525971f28ff75"
		};
	api.updateExpTimeEvent(query, function(){
		query = {
			"id"		:	clause_id,
			"key"		:	"221b368d7f5f597867f525971f28ff75"
		};
		api.renderAllSemieventQuery(query,function(array){
			index = 0;
			size = array.length;
			maximum = 0;
			event_id = -1;
			for (i = 0;i< size;i++){
				if(array[i].clause_id == clause_id){
					event_id = array[i].event_id;
				}
			}
			for (i = 0;i< size;i++){
				if(array[i].event_id == event_id){
					if (parseInt(array[i].exp_time) > maximum)
						maximum = parseInt(array[i].exp_time);
				}
			}
			query = {
				"id"		:	event_id,
				"exp_time"	:	exptime,
				"key"		:	"221b368d7f5f597867f525971f28ff75"
			};
			api.updateExpTimeEvent(query,function(){});
		});
	});
}

//create_event();
//eventhandler("device=1&status=1&energyconsumption=");
