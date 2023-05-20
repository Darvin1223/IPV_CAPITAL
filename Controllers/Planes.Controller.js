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
    async showPlanesAdmin(req,res){
        const id = req.session.id_user;

        let json_data = [];
        let testing_array = [];

        let planes_usadas = await mysql2.ejecutar_query(`SELECT plan_inversion.nombre, count(*) as total FROM planes_activos INNER JOIN plan_inversion ON planes_activos.plan_id = plan_inversion.plan_id`);


        
        await planes_usadas.forEach(async plan => {
            
            let data_info = await mysql2.ejecutar_query_con_array(`SELECT plan_inversion.nombre as nombre_plan,usuario.nombre,usuario.email FROM planes_activos INNER JOIN usuario ON usuario.id = planes_activos.user_id JOIN plan_inversion ON plan_inversion.plan_id = planes_activos.plan_id WHERE disponible = 1 AND plan_inversion.nombre = ?`,[plan.nombre]); 



            let new_json = {
                nombre: plan.nombre,
                data_info:JSON.stringify(data_info)
            }


            testing_array.push(5);
            await json_data.push(new_json);


        });

        console.log(await json_data)
        console.log(testing_array)


        conexion.query("SELECT * FROM `usuario` INNER JOIN rol ON usuario.rol_id = rol.id_rol INNER JOIN estatus ON usuario.estatus_id = estatus.id_status WHERE usuario.id = ?",[id],(err,results)=>{
            if(err){
                console.error(err)
            }else{
                res.render('layouts/admin/planes',{
                    title: "planes Admin | IPV CAPITAL - Admin Panel",
                    results:results,
                    planes_usadas
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
            
        }

        else{
            console.log('CODIGO QUE SI PERMITE');

            let json = {
                id_user: id_user,
                fecha_inicial: fecha_actual,
                fecha_final: nueva_fecha,
                capital: inver_text,
                documento_pago: req.file['filename']
            }

            let insertar = await mysql2.ejecutar_query_con_array(`INSERT INTO solicitud_planes (id_user, json_solicitud_planes) VALUES (?,?)`,[id_user,JSON.stringify(json)]);
        }

        

        res.redirect('/planes-admin');
    }



}

module.exports = new Planes();