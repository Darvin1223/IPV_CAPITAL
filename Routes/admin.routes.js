"use strict"
const Route = require("express").Router();
const multer = require('multer');
const path = require('path');
// const {} = require('uuid')
const verifyLoggedIn = require("../middleware/auth_verification.middleware.js");
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

Route.get('/admin', verifyLoggedIn, AdminController.index);
Route.get('/admin/dashboard', verifyLoggedIn, AdminController.indexAdmin);
Route.get('/admin/planes', verifyLoggedIn, PlanesAdminController.showPlanesAdmin);
Route.get('/admin/users', verifyLoggedIn, UsersController.showUsersAdmin);
Route.get('/admin/ganancias', verifyLoggedIn, GananciasController.showGananciasAdmin);
Route.get('/admin/retiros', verifyLoggedIn, RetirosAdminController.showRetirosAdmin);
Route.get('/admin/pagos', verifyLoggedIn, PagosController.showPaysAdmin);
Route.get("/admin/userData", UsersController.getUserData);
Route.get('/admin/capital-admin', verifyLoggedIn, CapitalController.showCapitalesAdmin);
Route.get('/admin/depositos-admin', verifyLoggedIn, DepositosController.showDepositosAdmin)
Route.get('/trasaciones', verifyLoggedIn, TransacionesController.showTransacionesUser);
Route.get('/trasacionesAdmin', verifyLoggedIn, TransacionesController.showTransacionesAdmin);
Route.get('/planes-admin', verifyLoggedIn, PlanesAdminController.showPlanesUser);
Route.get('/retiros-user', verifyLoggedIn, RetirosAdminController.showRetirosUser);
Route.get('/retiro-capital-user', verifyLoggedIn, RetirosAdminController.showRetiroCapitalUser);
Route.get('/referidos-user', verifyLoggedIn, ReferidosAdminController.showReferidosUser);
Route.get('/profile', verifyLoggedIn, UserProfileController.userProfile);
Route.get('/opt-validacion', verifyLoggedIn, AdminController.opt_account_page);


/* POST */
Route.post('/eliminar-user', verifyLoggedIn,UsersController.eliminarUser);
Route.post('/verification-account', updateDocuments.array('dni', 2), (req,res,next)=>{AdminController.verific_acount_page(req,res,next)});
Route.post("/opt-code", AdminController.opt_verification);


module.exports = Route;