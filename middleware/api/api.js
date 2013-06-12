var sqlite3 = require('sqlite3').verbose(),
	express = require('express');

var db = new sqlite3.Database('../database/maindb');
var app = new express();

var API_KEYS = ['221b368d7f5f597867f525971f28ff75','b3be6b55584e1a4e13928e8fdb6e1e5f','dec2abf5473e676042232b6786415d2c'];

app.listen(3000)

app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);


/***********************
Routes Definitions
***********************/
app.get('/users',renderUsersQuery);
app.get('/hubs',renderHubsQuery);
app.get('/devices',renderDevicesQuery);
app.get('/rooms',renderRoomsQuery);
app.get('/sessions',renderSessionsQuery);


/*****************************
Route Handling functions
*****************************/
function renderUsersQuery(req,res){
	if(isValidAPIKey(req)){
		if( req.query.id != null && req.query.id != undefined ){
			var sql = "SELECT * FROM users WHERE id = $id";
			db.all(sql,{ $id : req.query.id },function(err, row){
				if( err == null && row.length > 0 ){
					res.json(200,apiSuccessResponse(row));
				}
				else{
					console.log(err);
					res.json(200,apiErrorResponse(err));
				}
			});
		}
		else{
			res.json(200, invalidParamsError());
		}
	}
	else{
		res.json(200, invalidAPIKeyError());
	}
}

function renderHubsQuery(req,res){
	
}

function renderDevicesQuery(req,res){
	
}

function renderRoomsQuery(req,res){
	
}

function renderSessionsQuery(req,res){
	
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


/***********************
Error and Exception handling functions
to be used by default by express
***********************/

function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
}

function clientErrorHandler(err, req, res, next) {
  if (req.xhr) {
    res.send(500, { error: 'Something blew up!' });
  } else {
    next(err);
  }
}

function errorHandler(err, req, res, next) {
  res.status(500);
  res.render('error', { error: err });
}