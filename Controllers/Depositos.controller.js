const conexion = require("../Database/database");
const mysql2 = require('../Database/mysql2');
const moment = require('moment');

class Depositos{

    async showDepositosAdmin(req,res){
        const id = req.session.id_user;

        let historial = await mysql2.ejecutar_query_con_array(`select fecha_retiro,monto,estado,haash_wallet,t2.email as confirmado_por from pagos inner join retiros on id_retiro = id_retiros join estatus on estatus.id_status = retiros.estatus_id join usuario on usuario.id = id_user join usuario t2 ON retiros.confirmado_por = t2.id join wallet on wallet.id_wallet = usuario.wallet_id WHERE estado = "Recibido"`)

        moment.locale('es-do');

        const generalQuery = "SELECT * FROM `usuario` INNER JOIN rol ON usuario.rol_id = rol.id_rol INNER JOIN estatus ON usuario.estatus_id = estatus.id_status WHERE usuario.id = ?";
        conexion.query(generalQuery,[id],(err,results)=>{
            if(err){
                console.error(err);
            }else{
                res.render('layouts/admin/depositos',{
                    title: "Darvin Rodriguez | IPV CAPITAL - Admin Panel",
                    results: results,
                    historial,
                    moment
                })

            }
        })
    }
}

module.exports = new Depositos();
