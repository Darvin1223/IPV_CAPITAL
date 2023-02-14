const Route = require("express").Router();


const {HomeController,AuthController} =  require("./../Controllers");

Route.get('/', HomeController.index);
Route.get('/login', HomeController.log_in);
Route.get('/sign-up', HomeController.log_up);
Route.get('/logout', AuthController.logout);


// Post
Route.post('/register', AuthController.sign_up);
Route.post('/sign-in', AuthController.login);






module.exports = Route;