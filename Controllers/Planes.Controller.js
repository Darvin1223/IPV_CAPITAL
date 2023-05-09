const conexion = require("../Database/database");
const mysql2 = require('../Database/mysql2');


function compararFechasEnPorcentaje(fechaInicio, fechaFin) {
    const tiempoTotal = fechaFin - fechaInicio;
    const tiempoActual = Date.now() - fechaInicio;
    const porcentaje = Math.floor((tiempoActual / tiempoTotal) * 100);
    return Math.min(porcentaje, 100);
  }

function obtenerTiempoEnMilisegundos(fecha) {
  const fechaEnMilisegundos = new Date(fecha).getTime();
  return fechaEnMilisegundos;
}


class Planes {

    

   async showPlanesUser(req,res){
        const id = req.session.id_user;
        const generalQuery = "SELECT * FROM `usuario` INNER JOIN rol ON usuario.rol_id = rol.id_rol INNER JOIN estatus ON usuario.estatus_id = estatus.id_status WHERE usuario.id = ?";

        let planes_usuario = await mysql2.ejecutar_query_con_array(`SELECT planes_activos.capital as monto, plan_inversion.nombre as nombre_plan,fecha_inicio,fecha_expiracion FROM planes_activos INNER JOIN usuario ON usuario.id = planes_activos.user_id JOIN plan_inversion ON planes_activos.plan_id = plan_inversion.plan_id WHERE usuario.id = ? and cobrado = 0`,[id]);
        let planes = await mysql2.ejecutar_query(`SELECT * FROM plan_inversion`);

        conexion.query(generalQuery,[id],(err,results)=>{
            if(err){
                console.error(err)
            }else{
                res.render('layouts/planesAdmin',{
                    title: "planes Admin | IPV CAPITAL - Admin Panel",
                    obtenerTiempoEnMilisegundos,
                    compararFechasEnPorcentaje,
                    results:results,
                    planes_usuario,
                    planes
                })
            }
        })
       
    }
    showPlanesAdmin(req,res){
        const id = req.session.id_user;
        conexion.query("SELECT * FROM `usuario` INNER JOIN rol ON usuario.rol_id = rol.id_rol INNER JOIN estatus ON usuario.estatus_id = estatus.id_status WHERE usuario.id = ?",[id],(err,results)=>{
            if(err){
                console.error(err)
            }else{
                res.render('layouts/admin/planes',{
                    title: "planes Admin | IPV CAPITAL - Admin Panel",
                    results:results
                })
            }
        })
        
    }

}

module.exports = new Planes();