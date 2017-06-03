var mysql = require('mysql');

var connection = mysql.createConnection({
	host:'yourhost',
	user:'username',
	password:'password',
	database:'database',
	multipleStatements: true
});
connection.connect(function(err){
	if(!err){
		console.log('Database is connected');
	}else{
		connection.query("CREATE DATABASE database;CREATE TABLE users ( id INT(255) NOT NULL AUTO_INCREMENT , userid VARCHAR(20) NOT NULL , password VARCHAR(100) NOT NULL , PRIMARY KEY (id)) ENGINE = InnoDB;CREATE TABLE uploads ( userid VARCHAR(20) NOT NULL, filename VARCHAR(100) NOT NULL , filesize DOUBLE(100) NOT NULL , filepath VARCHAR(100) NOT NULL , Stars INT(100) NOT NULL DEFAULT '0' , PRIMARY KEY (userid)) ENGINE = InnoDB;CREATE TABLE Stars ( userid VARCHAR(20) NOT NULL , filename VARCHAR(100) NOT NULL , file_user DOUBLE(100) NOT NULL , PRIMARY KEY (userid)) ENGINE = InnoDB;ALTER TABLE Stars ADD FOREIGN KEY (file_user,filename) REFERENCES uploads(userid,filename) ON DELETE CASCADE;"
			, function (err, result) {
    		if (err){ 
    			throw err;
    			console.log(err);
    		}
    		console.log("Database created");

		});		
	}
});
module.exports = connection;

