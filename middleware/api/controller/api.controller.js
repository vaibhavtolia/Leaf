var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('../database/maindb');

var API_KEYS = ['221b368d7f5f597867f525971f28ff75','b3be6b55584e1a4e13928e8fdb6e1e5f','dec2abf5473e676042232b6786415d2c'];

/*****************************
Route Handling functions
*****************************/
exports.renderUsersQuery = function(req,callback){
	if(isValidAPIKey(req)){
		if( req.query.id != null && req.query.id != undefined ){
			var sql = "SELECT * FROM users WHERE id = $id";
			var params = { $id : req.query.id };
			runDbQuery(sql,params,function(data){
				callback && callback(data);
			});
		}
		else{
			response = invalidParamsError();
			callback && callback(response);
		}
	}
	else{
		response = invalidAPIKeyError();
		callback && callback(response);
	}
}

exports.renderHubsQuery = function (req,callback){
	if(isValidAPIKey(req)){
		if( req.query.id != null && req.query.id != undefined ){
			var sql = "SELECT * FROM hubs WHERE id = $id";
			var params = { $id : req.query.id };
			runDbQuery(sql,params,function(data){
				callback && callback(data);
			});
		}
		else{
			response = invalidParamsError();
			callback && callback(response);
		}
	}
	else{
		return invalidAPIKeyError();
	}
}

exports.renderDevicesQuery = function (req,callback){
	if(isValidAPIKey(req)){
		if( req.query.id != null && req.query.id != undefined ){
			var sql = "SELECT * FROM devices WHERE id = $id";
			var params = { $id : req.query.id };
			runDbQuery(sql,params,function(data){
				callback && callback(data);
			});
		}
		else{
			response = invalidParamsError();
			callback && callback(response);
		}
	}
	else{
		return invalidAPIKeyError();
	}
}

exports.renderRoomsQuery = function (req,callback){
	if(isValidAPIKey(req)){
		if( req.query.id != null && req.query.id != undefined ){
			var sql = "SELECT * FROM rooms WHERE id = $id";
			var params = { $id : req.query.id };
			runDbQuery(sql,params,function(data){
				callback && callback(data);
			});
		}
		else{
			response = invalidParamsError();
			callback && callback(response);
		}
	}
	else{
		return invalidAPIKeyError();
	}
}

exports.renderSessionsQuery = function (req,callback){
	if(isValidAPIKey(req)){
		if( req.query.id != null && req.query.id != undefined ){
			var sql = "SELECT * FROM sessions WHERE id = $id";
			var params = { $id : req.query.id };
			runDbQuery(sql,params,function(data){
				callback && callback(data);
			});
		}
		else{
			response = invalidParamsError();
			callback && callback(response);
		}
	}
	else{
		return invalidAPIKeyError();
	}
}

/************************
Database Functions
************************/
function runDbQuery(sql,params,callback){
	db.all(sql, params,function(err, row){
		if( err == null && row.length > 0 ){
			//console.log(row);
			var data = apiSuccessResponse(row);
			callback && callback(data);
		}
		else{
			console.log(err);
			var data = apiErrorResponse(err);
			callback && callback(data);
		}
	});
}

/************************
Helper Functions
************************/
function isValidAPIKey(req){
	var key = req.query.key;
	if( key != null && key != undefined){
		if( API_KEYS.indexOf(key) != -1 ){
			return true;
		}
		else{
			return false;
		}		
	}
	else{
		return false;
	}
}

function invalidAPIKeyError(){
	var response = {
		"status" : "INVALID_KEY",
		"response" : ""
	}
	return response;
}

function invalidParamsError(){
	var response = {
		"status" : "INVALID_PARAMETERS",
		"response" : ""
	}
	return response;
}

function apiErrorResponse(err){
	var response = {
		"status" : "ERROR",
		"response" : err
	}
	return response;
}

function apiSuccessResponse(res){
	var response = {
		"status" : "OK",
		"response" : res
	}
	return response;
}
