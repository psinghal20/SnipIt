var mysql = require('mysql');

var connection = mysql.createConnection({
	host:'yourhost',
	user:'username',
	password:'password',
	multipleStatements: true
});
connection.connect(function(err){
	if(err){
		throw err;
	}
	console.log("connected!");
	connection.query("CREATE DATABASE test;CREATE TABLE test.users ( id INT(255) NOT NULL AUTO_INCREMENT , userid VARCHAR(20) NOT NULL , password VARCHAR(100) NOT NULL , PRIMARY KEY (id)) ENGINE = InnoDB;CREATE TABLE test.uploads ( userid VARCHAR(20) NOT NULL, filename VARCHAR(100) NOT NULL , filesize DOUBLE NOT NULL , filepath VARCHAR(100) NOT NULL , Stars INT(100) NOT NULL DEFAULT '0' , PRIMARY KEY (userid,filename)) ENGINE = InnoDB;CREATE TABLE test.Stars ( userid VARCHAR(20) NOT NULL , filename VARCHAR(100) NOT NULL , file_user VARCHAR(20) NOT NULL , PRIMARY KEY (userid)) ENGINE = InnoDB;ALTER TABLE test.Stars ADD FOREIGN KEY fk_id(file_user,filename) REFERENCES test.uploads(userid,filename) ON DELETE CASCADE ON UPDATE CASCADE;", function (err, result) {
   		if (err){ 
   			throw err;
   		}
   		console.log("Database created");
   		process.exit(0);

	});		
	
});
