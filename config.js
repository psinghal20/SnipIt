var mysql = require('mysql');

var connection = mysql.createConnection({
	host:'localhost',
	user:'akku',
	password:'1611271020',
	database:'auth'
});
connection.connect(function(err){
	if(!err){
		console.log('Database is connected');
	}else{
		console.log('Error while connecting with database');		
	}
});
module.exports = connection;