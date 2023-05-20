const conexion = require("../Database/database");
const mysql2 = require('../Database/mysql2');


class Retiro {

    showRetirosUser(req,res){
        const id = req.session.id_user;
        const generalQuery = "SELECT * FROM `usuario` INNER JOIN rol ON usuario.rol_id = rol.id_rol INNER JOIN estatus ON usuario.estatus_id = estatus.id_status WHERE usuario.id = ?";
       conexion.query(generalQuery,[id],(err,results)=>{
        if(err){
            console.error(err)
        }else{
            res.render('layouts/retiros',{
                title: "Retiros User | IPV CAPITAL - Admin Panel",
                results:results
            })
        }
       })
    }

   async showRetiroCapitalUser(req,res){


        const id = req.session.id_user;
        const generalQuery = "SELECT * FROM `usuario` INNER JOIN rol ON usuario.rol_id = rol.id_rol INNER JOIN estatus ON usuario.estatus_id = estatus.id_status WHERE usuario.id = ?";

        let planes_usuario = await mysql2.ejecutar_query_con_array(`SELECT planes_activos.capital as monto, plan_inversion.nombre as nombre_plan,fecha_inicio,fecha_expiracion FROM planes_activos INNER JOIN usuario ON usuario.id = planes_activos.user_id JOIN plan_inversion ON planes_activos.plan_id = plan_inversion.plan_id WHERE usuario.id = ? AND disponible = 1`,[id]);
        let planes = await mysql2.ejecutar_query(`SELECT * FROM plan_inversion`);

        let solicitudes_retiros = await mysql2.ejecutar_query_con_array(`SELECT * FROM solicitud_retiros WHERE id_user = ? AND estado = 0`,[id]);
        let solicitudes_retiros_cobrados = await mysql2.ejecutar_query_con_array(`SELECT * FROM solicitud_retiros WHERE id_user = ? AND estado = 1`,[id]);


        conexion.query(generalQuery,[id],(err,results)=>{
            if(err){
                console.error(err)
            }else{
                res.render('layouts/retiro_capital',{
                    title: "Retiros de capital | IPV CAPITAL - Admin Panel",
                    results:results,
                    planes_usuario,
                    planes,
                    solicitudes_retiros,
                    solicitudes_retiros_cobrados
                })
            }
        })


      
    }

    /* Admin */
    showRetirosAdmin(req,res){
        const id = req.session.id_user;
        const generalQuery = "SELECT * FROM `usuario` INNER JOIN rol ON usuario.rol_id = rol.id_rol INNER JOIN estatus ON usuario.estatus_id = estatus.id_status WHERE usuario.id = ?";
        conexion.query(generalQuery,[id],(err,results)=>{
            if(err){
                console.error(err);
            }else{
                res.render('layouts/admin/retiros',{
                    title: "Retiros de capital | IPV CAPITAL - Admin Panel",
                    results:results
                })
            }
        })
        
    }
}

module.exports = new Retiro();