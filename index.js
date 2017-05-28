var express = require('express');
var app = express();
var fileupload = require('express-fileupload');
var http = require('http').Server(app);
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var routes = require('./routes/login.js');

app.use(fileupload());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
	secret:"secret",
	resave:true,
	saveUninitialized:true
}));

app.use(express.static('public'))
app.use('/',routes);

app.set('view engine', 'pug');
app.set('views','./views');

http.listen(3340,function(){
	console.log('listening on *:3340');
});