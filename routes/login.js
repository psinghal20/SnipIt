var express = require('express');
var router = express.Router();
var loginCont = require('./../controllers/login-cont')

router.get('/login',loginCont.login_get);

router.post('/login',loginCont.login_post);

router.get('/signup',loginCont.signup_get);

router.post('/signup',loginCont.signup_post);

router.get('/logout',loginCont.logout_get);

router.get('/protected_page',loginCont.checksignin,loginCont.protected_page_get);

router.use('/protected_page',loginCont.protected_page_middleware);

router.post('/upload',loginCont.upload_post);

router.get('/protected_page/:file',loginCont.file_get);

router.get('/delete/:filename',loginCont.delete_get);

router.get('/edit/:filename',loginCont.edit_get);

router.post('/edit/:filename',loginCont.edit_post);

router.get('/download/:filename',loginCont.download_get);

module.exports = router;