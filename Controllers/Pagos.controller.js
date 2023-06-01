const conexion = require("../Database/database");
const mysql2 = require('../Database/mysql2');

class Pagos {

  async showPaysAdmin(req,res){
        const id = req.session.id_user;
        const generalQuery = "SELECT * FROM `usuario` INNER JOIN rol ON usuario.rol_id = rol.id_rol INNER JOIN estatus ON usuario.estatus_id = estatus.id_status WHERE usuario.id = ?";

        let total_pago = await mysql2.ejecutar_query(`select IFNULL(sum(monto),0) as monto from pagos inner join retiros on id_retiro = id_retiros join estatus on estatus.id_status = retiros.estatus_id WHERE estado = "Recibido"`)
        total_pago = total_pago[0]['monto'];

        let total_pago_mes_anterior = await mysql2.ejecutar_query(`select IFNULL(sum(monto),0) as monto from pagos inner join retiros on id_retiro = id_retiros join estatus on estatus.id_status = retiros.estatus_id WHERE estado = "Recibido" AND fecha_pago >= DATE_FORMAT(NOW() - INTERVAL 2 MONTH, '%Y-%m-01') AND fecha_pago < DATE_FORMAT(NOW() - INTERVAL 1 MONTH, '%Y-%m-01')`);
        total_pago_mes_anterior = total_pago_mes_anterior[0]['monto'];

        conexion.query(generalQuery,[id],(err,results)=>{
            if(err){
                console.error(err)
            }else{
                res.render('layouts/admin/pagos',{
                    title: " | IPV CAPITAL - Admin Panel",
                    results:results,
                    total_pago,
                    total_pago_mes_anterior
                })
            }
        })

    }
}

module.exports = new Pagos();
