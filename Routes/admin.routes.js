const Route = require("express").Router();


const {AdminController, TransacionesController,PlanesAdmin, RetirosAdmin, ReferidosAdmin, UserProfile} =  require("./../Controllers");

Route.get('/admin', AdminController.index);
Route.get('/admin-admin', AdminController.indexAdmin);
Route.get('/verification-account', AdminController.verific_acount_page);
Route.get('/trasaciones', TransacionesController.showTransacionesUser);
Route.get('/trasacionesAdmin', TransacionesController.showTransacionesAdmin);
Route.get('/planes-admin', PlanesAdmin.showPlanesUser);
Route.get('/retiros-user', RetirosAdmin.showRetirosUser);
Route.get('/retiro-capital-user', RetirosAdmin.showRetiroCapitalUser);
Route.get('/referidos-user', ReferidosAdmin.showReferidosUser);
Route.get('/profile', UserProfile.userProfile);





module.exports = Route;