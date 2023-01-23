const Route = require("express").Router();


const {HomeController} =  require("./../Controllers");

Route.get('/', HomeController.index);







module.exports = Route;