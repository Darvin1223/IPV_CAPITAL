///No sabia donde ponerlo xd (Funciones de tiempo)
let TimeController = require('./Time.controllers');

let UsuarioGenerador = require('./Procedural');



module.exports = {
    HomeController: require('./Homecontroller'),
    AdminController: require("./Admin.controllers"),
    TransacionesController: require("./transaciones.controller"),
    PlanesAdminController: require("./Planes.Controller"),
    RetirosAdminController: require("./Retiros.controllers"),
    ReferidosAdminController: require("./Referidos.controller"),
    UserProfileController: require("./Perfil.controller"),
    UsersController: require("./User.controller"),
    GananciasController: require("./ganancias.controller"),
    PagosController: require("./Pagos.controller"),
    CapitalController: require("./Capital.controller"),
    DepositosController: require('./Depositos.controller'),
    AuthController: require("./Auth.controller"),
    WalletController: require("./wallet.controller"),
    TimeController: require('./Time.controllers'),
    ContactController: require("./Contact.Controller"),
    ReviewController: require('./Preview.controller.js')
};
