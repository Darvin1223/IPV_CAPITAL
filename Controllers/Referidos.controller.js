const conexion = require("../Database/database");
const mysql2 = require('../Database/mysql2');


class Referidos {

   async showReferidosUser(req,res){
        const id = req.session.id_user;
        const generalQuery = "SELECT * FROM `usuario` INNER JOIN rol ON usuario.rol_id = rol.id_rol INNER JOIN estatus ON usuario.estatus_id = estatus.id_status WHERE usuario.id = ?";

        let data_user = await mysql2.ejecutar_query_con_array(`SELECT * FROM usuario WHERE id = ?`,[id]);
        data_user = data_user[0];

        let codigo_referido = data_user['codigo_referido'];

        let usuarios_referidos = await mysql2.ejecutar_query_con_array(`SELECT * FROM codigo_referido INNER JOIN usuario ON codigo_referido.codigo_referido = usuario.codigo_referido WHERE codigo_referido.codigo_referido = ?`,[codigo_referido]);


        conexion.query(generalQuery, [id],(err,results)=>{
            if(err){
                console.error(err)
            }else{
                res.render('layouts/referidos',{
                    title: "Referidos User | IPV CAPITAL - Admin Panel",
                    results:results,
                    usuarios_referidos
                })
            }
        })
    }

    async MostrarBonoReferido(req,res){

        const id_user = req.session.id_user;
        const id_cliente = req.params.id;

        //Referencias por bonos
        let data_user = await mysql2.ejecutar_query_con_array(`SELECT * FROM usuario WHERE id = ?`,[id_user]);
        data_user = data_user[0];
        let codigo_referido = data_user['codigo_referido'];

        let ganancia = await mysql2.ejecutar_query_con_array(`SELECT IFNULL( ROUND(SUM(capital + capital * tasa_interes/100 * IF(UNIX_TIMESTAMP(NOW())>UNIX_TIMESTAMP(fecha_expiracion), TIMESTAMPDIFF(MONTH, fecha_inicio, fecha_expiracion), TIMESTAMPDIFF(MONTH, fecha_inicio, now())) / 12 * 10 / 100),2),0) as ganancia FROM codigo_referido INNER JOIN usuario ON codigo_referido.user_id = usuario.id JOIN planes_activos ON planes_activos.user_id = codigo_referido.user_id JOIN plan_inversion ON planes_activos.plan_id = plan_inversion.plan_id WHERE codigo_referido.codigo_referido = ? AND disponibilidad = 1 AND codigo_referido.user_id = ?`,[codigo_referido,id_cliente])

        res.send(ganancia[0])

    }




}
module.exports = new Referidos();