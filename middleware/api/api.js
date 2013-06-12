var sqlite3 = require('sqlite3').verbose(),
	express = require('express'),
	api = require('./controller/api.controller.js');

var db = new sqlite3.Database('../database/maindb');
var app = new express();

app.listen(3000)

app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);

/**************************
initialization function
**************************/


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
	api.renderUsersQuery(req,function(data){
		res.json(200,data);
	});
}

function renderHubsQuery(req,res){
	var a = api.renderHubsQuery(req,function(data){
		res.json(200,data);
	});
}

function renderDevicesQuery(req,res){
	var a = api.renderDevicesQuery(req,function(data){
		res.json(200,data);
	});
}

function renderRoomsQuery(req,res){
	var a = api.renderRoomsQuery(req,function(data){
		res.json(200,data);
	});
}

function renderSessionsQuery(req,res){
	var a = api.renderSessionsQuery(req,function(data){
		res.json(200,data);
	});
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
