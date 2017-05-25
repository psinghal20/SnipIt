var express = require('express');
var fileupload = require('express-fileupload');
var app = express();

app.use(fileupload());

app.set('view engine', 'pug');
app.set('views','./views');

app.get('/',function(req,res){
	res.render('upload');
});

app.post('/upload',function(req,res){
	if(!req.files){
		return res.status(400).send('No files were uploaded');	
	}

	var sampleFile = req.files.sampleFile;
	sampleFile.mv('uploads/'+sampleFile.name,function(err){
		if(err){
			return res.status(500).send(err);
		}
		res.send('file uploaded');
	});

});

app.listen(2200);
