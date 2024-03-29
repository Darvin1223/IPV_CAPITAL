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

// Configuration of folders and destinations.
const storageComprobante = multer.diskStorage({
    destination: './public/comprobante',
    filename: (req,file,cb) => {
        cb(null, uuidv4() + path.extname(file.originalname).toLowerCase());
    }
});

// Update file.
const updateDocuments = multer({
    storage: storageDocuments,
    dest: 'public/admin/dni'
})

var upload_comprobante = multer({ storage: storageComprobante });


const {AdminController,ReviewController, TransacionesController,PlanesAdminController, RetirosAdminController, ReferidosAdminController, UserProfileController, UsersController, GananciasController, PagosController,CapitalController,DepositosController,WalletController} =  require("./../Controllers");
const PerfilController = require("../Controllers/Perfil.controller.js");

Route.get('/admin', verifyLoggedIn, AdminController.index);
Route.get('/admin/dashboard', verifyLoggedIn, AdminController.indexAdmin);
Route.get('/admin/planes', verifyLoggedIn, PlanesAdminController.showPlanesAdmin);
Route.get('/admin/users', verifyLoggedIn, UsersController.showUsersAdmin);
Route.get('/admin/ganancias', verifyLoggedIn, GananciasController.showGananciasAdmin);
Route.get('/admin/retiros', verifyLoggedIn, RetirosAdminController.showRetirosAdmin);

//Solicitar Retiros
Route.post('/admin/solicitar-retiro',verifyLoggedIn, RetirosAdminController.Comprobar_Tipo_Retiros);
Route.get('/admin/retiros/aceptar/:id', verifyLoggedIn, RetirosAdminController.Aceptar_Retiro);
Route.get('/admin/retiros/rechazar/:id', verifyLoggedIn, RetirosAdminController.RechazarRetiro);

//Solicitar Retiros CAPITAL
Route.get('/retirar_capital/:id', verifyLoggedIn, RetirosAdminController.RetirarCapital);
Route.get('/aceptar-capital/:id', verifyLoggedIn, CapitalController.AceptarRetiroCapital);

//Planes
Route.get('/admin/planes/aceptar/:id', verifyLoggedIn, PlanesAdminController.AceptarPlanes);
Route.get('/admin/planes/rechazar/:id', verifyLoggedIn, PlanesAdminController.RechazarPlanes);

Route.get('/admin/pagos', verifyLoggedIn, PagosController.showPaysAdmin);
Route.get("/admin/userData/:id", UsersController.getUserData);
Route.get('/admin/capital-admin', verifyLoggedIn, CapitalController.showCapitalesAdmin);
Route.get('/admin/depositos-admin', verifyLoggedIn, DepositosController.showDepositosAdmin)
Route.get('/trasaciones', verifyLoggedIn, TransacionesController.showTransacionesUser);
Route.get('/trasacionesAdmin', verifyLoggedIn, TransacionesController.showTransacionesAdmin);
Route.get('/planes-admin', verifyLoggedIn, PlanesAdminController.showPlanesUser);
Route.get('/retiros-user', verifyLoggedIn, RetirosAdminController.showRetirosUser);
Route.get('/retiro-capital-user', verifyLoggedIn, RetirosAdminController.showRetiroCapitalUser);
Route.get('/referidos-user', verifyLoggedIn, ReferidosAdminController.showReferidosUser);
Route.get('/get_capital_referido/:id', verifyLoggedIn, ReferidosAdminController.MostrarBonoReferido);
Route.get('/profile', verifyLoggedIn, UserProfileController.userProfile);
Route.get('/opt-validacion', verifyLoggedIn, AdminController.opt_account_page);


/* POST */
Route.post('/eliminar-user', verifyLoggedIn,UsersController.eliminarUser);
Route.post('/verification-account', updateDocuments.array('dni', 2), (req,res,next)=>{AdminController.verific_acount_page(req,res,next)});
Route.post("/opt-code", AdminController.opt_verification);

Route.post('/update-profile', verifyLoggedIn, PerfilController.EditProfile);

Route.post("/profile/updatePassword", verifyLoggedIn, UserProfileController.resetPasswordAdmin);
Route.post("/profile/updatePasswordUser", verifyLoggedIn, UserProfileController.resetPassword);
Route.post('/profile/addWallet',verifyLoggedIn,WalletController.registerWallet);
Route.post("/profile/reqUpdateWallet", verifyLoggedIn,WalletController.reqUpdateeWallet);
Route.post("/profile/updateWallet", verifyLoggedIn, WalletController.updateWallet);
Route.post("/profile/updateWalletAdmin", verifyLoggedIn,WalletController.updateWalletAdmin);
Route.post("/admin/users/delete-user", verifyLoggedIn, UsersController.eliminarUser);
//Billetera
Route.get('/admin/billetera/aceptar/:id', verifyLoggedIn, WalletController.AceptarWallet);
Route.get('/admin/billetera/rechazar/:id', verifyLoggedIn, WalletController.RechazarWallet);



//
Route.post('/planes-admin/add', verifyLoggedIn, upload_comprobante.single('file_upload'), function (req, res) {
    PlanesAdminController.AddPlan(req,res)
})

//Review Basica

Route.get('/review/admin/:id', verifyLoggedIn, ReviewController.Index);




module.exports = Route;
