const Route = require("express").Router();


const {HomeController} =  require("./../Controllers");

Route.get('/', HomeController.index);
Route.get('/login', HomeController.log_in);
Route.get('/sign-up', HomeController.log_up);







module.exports = Route;