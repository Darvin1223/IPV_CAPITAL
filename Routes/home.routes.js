const Route = require("express").Router();


<<<<<<< HEAD
const {HomeController,AuthController,ContactController} =  require("./../Controllers");
=======
const {HomeController,AuthController, UsersController} =  require("./../Controllers");
>>>>>>> 721441bb52a967d434db3d6c12e50ecd1bb78a30

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