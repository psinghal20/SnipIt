var connection = require('./../config');
var fs = require('fs');
var mkdir = require('make-dir');
var fse = require('fs-extra');

exports.get_user_data = function (userid,callback) {
	connection.query('SELECT * FROM users where userid = ?',userid,callback);
}

exports.insert_user_data = function(userid,passwordhash,callback){
	mkdir('uploads/'+userid);
	connection.query("INSERT INTO users (userid,password) VALUES ('"+userid+"','"+passwordhash+"')",callback);
}

exports.get_user_upload_data =function(userid,callback){
	connection.query('SELECT * FROM uploads where userid = ?',userid,callback);
} 

exports.upload_file = function(userid,file,callback){
	file.mv('uploads/'+userid+'/'+file.name,callback);
}

exports.insert_upload_data = function(userid,filename,callback){
	var stats = fs.statSync('uploads/'+userid+'/'+filename);
	connection.query("INSERT INTO uploads (userid,filename,filesize,filepath) VALUES ('"+userid+"','"+filename+"','"+stats.size+"','"+"uploads/"+userid+'/'+filename+"')",callback);
}

exports.get_file_data = function(userid,filename,callback){
	fs.readFile('uploads/'+userid+'/'+filename,'utf8',callback);
}

exports.delete_file = function(userid,filename,callback){
	fs.unlink('uploads/'+userid+'/'+filename,callback);
}

exports.delete_upload_data = function(userid,filename,callback){
	connection.query("DELETE FROM uploads WHERE userid = '"+userid+"' AND filename = '"+filename+"'",callback);
}

exports.write_file_data = function(userid,filename,content,callback){
	fs.writeFile('uploads/'+userid+'/'+filename,content,'utf8',callback);
}

exports.search_file_data = function(keyword,callback){
	connection.query("SELECT * FROM uploads WHERE filename LIKE '%"+keyword+"%'",callback);
}