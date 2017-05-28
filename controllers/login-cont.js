var bcrypt = require('bcrypt');
var fs = require('fs');
var mkdir = require('make-dir');
var fse = require('fs-extra');
var connection = require('./../config');


exports.login_get = function(req,res){
	res.render('login');
}

exports.login_post = function(req,res){
	if (!req.body.userid || !req.body.password) {
		res.status("400");
		res.send('Invalid Details');
	}
	else{
		var user = {
			userid:req.body.userid,
			password:req.body.password
		}
		connection.query('SELECT * FROM users where userid = ?',[user.userid],function(err,result){
			if(err){
				res.render('login',{message:'Invalid Credentials!'});
			}
			else{
				if(result.length>0){
					if(bcrypt.compareSync(user.password, result[0].password)){
						req.session.user = user;
						console.log('user auth');
						res.redirect('/protected_page');
					}	
				}else{
				res.render('login',{message:'Invalid Credentials!'});
				}
			}
		});
	}
}

exports.signup_get = function(req,res){
	res.render('signup');
}

exports.signup_post = function(req,res){
	if(!req.body.userid || !req.body.password){
		res.status("400");
		res.send("Invalid details!");
	}
	else{
		var salt = bcrypt.genSaltSync(10);
		var hash = bcrypt.hashSync(req.body.password, salt);
		var user = {
			userid:req.body.userid,
			passwordhash:hash,
		}
		connection.query("INSERT INTO users (userid,password) VALUES ('"+user.userid+"','"+user.passwordhash+"')",function(err,result){
			if(err){
				console.log(err);
				res.render('signup',{message:'User already exists!'});
			}else{
				req.session.user = user;
				res.redirect('/protected_page');
			}
		});
	}
}

exports.logout_get = function(req,res){
	req.session.destroy(function(){
		console.log('user logged out');
	});
	res.redirect('/login');
}

exports.checksignin = function (req,res,next){
	if(req.session.user){
		next();
	}else{
		var err=new Error("not logged in!");
		console.log(req.session.user);
		next(err);
	}
}

exports.protected_page_get = function(req,res){
	connection.query('SELECT * FROM uploads where userid = ?',[req.session.user.userid],function(err,result){
			if(err){
				res.render('upload');
			}
			else{
				
				res.render('upload',{userid:req.session.user.userid,result:result});
			}
	});
}

exports.protected_page_middleware = function(err,req,res,next){
	console.log(err);
	res.redirect('/login');
}

exports.upload_post = function(req,res){
	
	if(!req.files){
		return res.status(400).send('No files were uploaded');	
	}

	var sampleFile = req.files.sampleFile;

	mkdir('uploads/'+req.session.user.userid);

	sampleFile.mv('uploads/'+req.session.user.userid+'/'+sampleFile.name,function(err){
		
		if(err){
			return res.status(500).send(err);
		}
		
		var stats = fs.statSync('uploads/'+req.session.user.userid+'/'+sampleFile.name);
		
		connection.query("INSERT INTO uploads (userid,filename,filesize,filepath) VALUES ('"+req.session.user.userid+"','"+sampleFile.name+"','"+stats.size+"','"+"uploads/"+req.session.user.userid+'/'+sampleFile.name+"')",function(err,result){
			
			if(err){
				console.log(err);
				res.redirect('/protected_page');
			}else{
				console.log('file uploaded');
				res.redirect('/protected_page');
			}
		
		});
	
	});

}

exports.file_get = function(req,res){
	
	var filename = req.params.file;
	
	fs.readFile('uploads/'+req.session.user.userid+'/'+filename,'utf8',function(err,contents){
					res.render('files',{contents:contents,file:filename});
	});
	
}

exports.delete_get = function(req,res){
	
	var filename = req.params.filename;
	
	connection.query("DELETE FROM uploads WHERE userid = '"+req.session.user.userid+"' AND filename = '"+filename+"'",function(err,result){
		
		fs.unlink('uploads/'+req.session.user.userid+'/'+filename,function(err){
			if(err){
				console.log(err);
			}
			console.log('removed');
			
			res.redirect('/protected_page');
		
		});
	
	});	

}

exports.edit_get = function(req,res){
	var filename = req.params.filename;
	
	fs.readFile('uploads/'+req.session.user.userid+'/'+filename,'utf8',function(err,contents){
		res.render('edit',{contents:contents,file:filename});
	});
}

exports.edit_post = function(req,res){
	var filename = req.params.filename;
	fs.writeFile('uploads/'+req.session.user.userid+'/'+filename,req.body.editarea,'utf8',function(err){
		if(err){
			console.log(err);
		}
		console.log('written');
		res.redirect('/protected_page');
	});
}

exports.download_get = function(req,res){
	var filename = req.params.filename;
	res.download('uploads/'+req.session.user.userid+'/'+filename);
}