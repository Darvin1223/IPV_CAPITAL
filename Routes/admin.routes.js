const Route = require("express").Router();
const multer = require('multer');
const path = require('path');
// const {} = require('uuid')
const {v4: uuidv4 } = require('uuid');

// Configuration of folders and destinations.
const storageDocuments = multer.diskStorage({
    destination: 'public/dni',
    filename: (req,file,cb) => {
        cb(null, uuidv4() + path.extname(file.originalname).toLowerCase());
    }
});

// Update file.
const updateDocuments = multer({
    storage: storageDocuments,
    dest: 'public/admin/dni'
})
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
Route.get('/trasaciones', TransacionesController.showTransacionesUser);
Route.get('/trasacionesAdmin', TransacionesController.showTransacionesAdmin);
Route.get('/planes-admin', PlanesAdminController.showPlanesUser);
Route.get('/retiros-user', RetirosAdminController.showRetirosUser);
Route.get('/retiro-capital-user', RetirosAdminController.showRetiroCapitalUser);
Route.get('/referidos-user', ReferidosAdminController.showReferidosUser);
Route.get('/profile', UserProfileController.userProfile);
Route.get('/opt-validacion', AdminController.opt_account_page);

/* POST */
Route.post('/verification-account', updateDocuments.array('dni', 2), (req,res,next)=>{AdminController.verific_acount_page(req,res,next)});
Route.post("/opt-code", AdminController.opt_verification);


module.exports = Route;