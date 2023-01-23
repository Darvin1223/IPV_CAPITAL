const Route = require("express").Router();


const {AdminController, TransacionesController} =  require("./../Controllers");

Route.get('/admin', AdminController.index);
Route.get('/verification-account', AdminController.verific_acount_page);
Route.get('/trasaciones', TransacionesController.showTransacionesUser);
Route.get('/trasacionesAdmin', TransacionesController.showTransacionesAdmin);






module.exports = Route;