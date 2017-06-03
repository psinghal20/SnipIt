var bcrypt = require('bcrypt');
var models = require('./../models/model');

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
		models.get_user_data(user.userid,function(err,result){
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
		models.insert_user_data(user.userid,user.passwordhash,function(err,result){
			if(err){
				console.log(err);
				res.render('login',{message:'User already exists!'});
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
	models.get_user_upload_data(req.session.user.userid,function(err,upload_result){
			if(err){
				res.render('upload');
			}
			else{
				models.get_star_data(req.session.user.userid,function(err,star_result){
					if(err){
						console.log(err);
					}
					else{
						res.render('upload',{userid:req.session.user.userid,upload_result:upload_result,star_result:star_result});
					}
				});
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

	models.upload_file(req.session.user.userid,sampleFile,function(err){
		
		if(err){
			return res.status(500).send(err);
		}
		models.insert_upload_data(req.session.user.userid,sampleFile.name,function(err,result){
			
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
	
	models.get_file_data(req.session.user.userid,filename,function(err,contents){
					res.render('files',{contents:contents,file:filename});
	});
}

exports.delete_get = function(req,res){
	
	var filename = req.params.filename;
	
	models.delete_file(req.session.user.userid,filename,function(err){
		if(err){
				console.log(err);
			}
		models.delete_upload_data(req.session.user.userid,filename,function(err,result){
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
	
	models.get_file_data(req.session.user.userid,filename,function(err,contents){
		res.render('edit',{contents:contents,file:filename});
	});
}

exports.edit_post = function(req,res){
	var filename = req.params.filename;
	models.write_file_data(req.session.user.userid,filename,req.body.editarea,function(err){
		if(err){
			console.log(err);
		}
		console.log('written');
		res.redirect('/protected_page/'+filename);
	});
}

exports.download_get = function(req,res){
	var filename = req.params.filename;
	var fileuser = req.params.fileuser;
	if(fileuser){
		res.download('uploads/'+fileuser+'/'+filename);
	}
	else{
		res.download('uploads/'+req.session.user.userid+'/'+filename);
	}
}

exports.search_get = function(req,res){
	var keyword = req.query.keyword;
	models.search_file_data(keyword,function(err,result){
		if (err) {
			console.log(err);
		}
		else{
			if(result.length<=0){
				res.send("Zero results");
			}
			else{
				console.log(result);
				res.render('search',{result:result,keyword:keyword});
			}
		}
	});
}

exports.search_result_get = function(req,res){
	var fileuser = req.params.fileuser;
	var filename =req.params.filename;
	models.get_file_data(fileuser,filename,function(err,contents){
		if(err){
			console.log(err);
		}
		else{
			res.render('files',{file:filename,fileuser:fileuser,contents:contents})
		}
	});
}

exports.star_get = function(req,res){
	var fileuser = req.params.fileuser;
	var filename =req.params.filename;
	var userid = req.session.user.userid;
	models.insert_star_data(userid,fileuser,filename,function(err,result){
		 if(err){
		 	console.log(err);
		 }
		 else{
		 	models.update_star_count(fileuser,filename,function(err,result){
		 		if(err){
		 			console.log(err);
		 		}
		 		else{
		 			console.log(result);
		 			console.log('starred');
		 			res.redirect('/search/'+fileuser+'/'+filename);
		 		}
		 	});
		 }
	});
}
