const conexion = require("../Database/database");
const mysql2 = require('../Database/mysql2');
const moment = require('moment');


class Gnancias {

    async showGananciasAdmin(req,res){
        const id = req.session.id_user;
        const generalQuery = "SELECT * FROM `usuario` INNER JOIN rol ON usuario.rol_id = rol.id_rol INNER JOIN estatus ON usuario.estatus_id = estatus.id_status WHERE usuario.id = ?";

        moment.locale('es-do');

        //Ganancias Totales
        let ganancias_totales = await mysql2.ejecutar_query(`SELECT ROUND(SUM(capital * tasa_interes/100 * IF(UNIX_TIMESTAMP(NOW())>UNIX_TIMESTAMP(fecha_expiracion), TIMESTAMPDIFF(DAY, fecha_inicio, fecha_expiracion), TIMESTAMPDIFF(DAY, fecha_inicio, now())) / 365 - capital_cobrada),2) as ganancia FROM planes_activos INNER JOIN plan_inversion ON plan_inversion.plan_id = planes_activos.plan_id`);
        ganancias_totales = ganancias_totales[0]['ganancia'];
        //Ganancias Mensuales
        let ganancias_mensuales = await mysql2.ejecutar_query(`SELECT IFNULL(ROUND(SUM(capital * tasa_interes/100 * IF(UNIX_TIMESTAMP(NOW())>UNIX_TIMESTAMP(fecha_expiracion), TIMESTAMPDIFF(DAY, fecha_inicio, fecha_expiracion), TIMESTAMPDIFF(DAY, fecha_inicio, now())) / 365 - capital_cobrada),2),0) as ganancia FROM planes_activos INNER JOIN plan_inversion ON plan_inversion.plan_id = planes_activos.plan_id WHERE MONTH(NOW()) = MONTH(CURDATE())`);
        ganancias_mensuales = ganancias_mensuales[0]['ganancia'];
        //Historial De retiros
        let historial = await mysql2.ejecutar_query(`SELECT fecha_retiro,planes,monto,estado,haash_wallet,t2.email as confirmado_por FROM retiros INNER JOIN usuario ON usuario.id = retiros.id_user JOIN wallet ON usuario.wallet_id = wallet.id_wallet JOIN estatus ON estatus.id_status = retiros.estatus_id JOIN usuario t2 ON retiros.confirmado_por = t2.id`);


        conexion.query(generalQuery,[id],(err,results)=>{
            if(err){
                console.error(err)
            }else{
                res.render('layouts/admin/ganancias',{
                    title: "Ganancias ",
                    results:results,
                    ganancias_totales,
                    ganancias_mensuales,
                    historial,
                    moment
                })
            }
        })

    }


}

module.exports = new Gnancias();
