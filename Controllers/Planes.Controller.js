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

    async AddPlan(req,res){

        //Obtener id del usuario
        const id_user = req.session.id_user;
        //Obtener informacion del formulario
        let {inver_text,name_plan_input} = req.body;
        //Obtener Datos del plan
        let plan_info = await mysql2.ejecutar_query_con_array(`SELECT * FROM plan_inversion WHERE plan_id = ?`,[name_plan_input])
        plan_info = plan_info[0];
        //Fecha actual
        let fecha_actual = new Date();
        //Nueva fecha
        let nueva_fecha = new Date();
        nueva_fecha.setMonth(nueva_fecha.getMonth() + plan_info.duracion_meses);
        //Obtener el maximo de planes
        let maximo_planes = plan_info.maximo_plan_activo;
        //Obtener cuantos planes tiene el usuario
        let plan_count = await mysql2.ejecutar_query_con_array(`SELECT COUNT(*) as total_planes_en_linea FROM planes_activos WHERE plan_id = ? AND user_id = ?`,[plan_info.plan_id,id_user]);
        plan_count = plan_count[0]['total_planes_en_linea'];

        if(plan_count >= maximo_planes){
            console.log('CODIGO DE NO PERMIDO')
        }

        else{
            console.log('CODIGO QUE SI PERMITE');
        }

        res.send(req.body);
    }



}

module.exports = new Planes();