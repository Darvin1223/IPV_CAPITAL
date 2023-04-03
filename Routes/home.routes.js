const Route = require("express").Router();


const {HomeController,AuthController, UsersController,ContactController} =  require("./../Controllers");

Route.get('/', HomeController.index);
Route.get('/login', HomeController.log_in);
Route.get('/sign-up', HomeController.log_up);
Route.get('/logout', AuthController.logout);


// Post
Route.post('/register', AuthController.sign_up);
Route.post('/sign-in', AuthController.login);
Route.post("/contat-us",ContactController.Contact);
Route.post("/contat-us-optios",ContactController.ContactMini);

//Referidos
Route.get('/register/:codigo', UsersController.SaveReferido)



module.exports = Route;