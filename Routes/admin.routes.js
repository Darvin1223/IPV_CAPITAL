const Route = require("express").Router();


const {AdminController, TransacionesController,PlanesAdminController, RetirosAdminController, ReferidosAdminController, UserProfileController, UsersController, GananciasController, PagosController,CapitalController,DepositosController} =  require("./../Controllers");

Route.get('/admin', AdminController.index);
Route.get('/admin/dashboard', AdminController.indexAdmin);
Route.get('/admin/planes', PlanesAdminController.showPlanesAdmin);
Route.get('/admin/users', UsersController.showUsersAdmin);
Route.get('/admin/ganancias', GananciasController.showGananciasAdmin);
Route.get('/admin/retiros', RetirosAdminController.showRetirosAdmin);
Route.get('/admin/pagos', PagosController.showPaysAdmin);
Route.get('/admin/capital-admin', CapitalController.showCapitalesAdmin);
Route.get('/admin/depositos-admin', DepositosController.showDepositosAdmin)
Route.get('/verification-account', AdminController.verific_acount_page);
Route.get('/trasaciones', TransacionesController.showTransacionesUser);
Route.get('/trasacionesAdmin', TransacionesController.showTransacionesAdmin);
Route.get('/planes-admin', PlanesAdminController.showPlanesUser);
Route.get('/retiros-user', RetirosAdminController.showRetirosUser);
Route.get('/retiro-capital-user', RetirosAdminController.showRetiroCapitalUser);
Route.get('/referidos-user', ReferidosAdminController.showReferidosUser);
Route.get('/profile', UserProfileController.userProfile);





module.exports = Route;