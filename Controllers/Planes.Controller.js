const conexion = require("../Database/database");
const mysql2 = require('../Database/mysql2');
const moment = require('moment')

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

        moment.locale('es-do');

        let json_data = [];
        let testing_array = [];

        let planes_usadas = await mysql2.ejecutar_query(`SELECT plan_inversion.plan_id,plan_inversion.nombre, COUNT(*) as total FROM planes_activos INNER JOIN plan_inversion ON planes_activos.plan_id = plan_inversion.plan_id WHERE disponible = 1 GROUP BY plan_inversion.nombre`);

        let data_planes = await mysql2.ejecutar_query(`SELECT  planesActivos_id,plan_inversion.nombre,capital,tasa_interes,min_monto,max_monto,capital_cobrada,email,telefono FROM planes_activos INNER JOIN plan_inversion ON plan_inversion.plan_id = planes_activos.plan_id JOIN usuario ON usuario.id = planes_activos.user_id WHERE disponible = 1`);

        let solicitudes_planes = await mysql2.ejecutar_query(`select id_solicitud_planes,email,telefono,codigo_referido,ultimo_login,rol,json_solicitud_planes,plan_inversion.nombre as nombre_plan from solicitud_planes inner join usuario on id_user = id join rol on rol.id_rol = usuario.rol_id join plan_inversion on plan_inversion.plan_id = id_plan`);


        conexion.query("SELECT * FROM `usuario` INNER JOIN rol ON usuario.rol_id = rol.id_rol INNER JOIN estatus ON usuario.estatus_id = estatus.id_status WHERE usuario.id = ?",[id],(err,results)=>{
            if(err){
                console.error(err)
            }else{
                res.render('layouts/admin/planes',{
                    title: "planes Admin | IPV CAPITAL - Admin Panel",
                    results:results,
                    planes_usadas,
                    data_planes,
                    solicitudes_planes,
                    moment
                })
            }
        })

    }

    async AddPlan(req,res){

        //Obtener id del usuario
        const id_user = req.session.id_user;
        //Obtener informacion del formulario
        let {inver_text,name_plan_input,id_transaccion} = req.body;
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
        //Obtener Solicitudes Maximas
        let obtener_solicitudes = await mysql2.ejecutar_query_con_array(`select COUNT(*) as cuenta from solicitud_planes WHERE id_user = ? AND id_plan = ?`,[id_user,name_plan_input])
        obtener_solicitudes = obtener_solicitudes[0]['cuenta'];

        console.log(obtener_solicitudes)

        if(obtener_solicitudes >= maximo_planes) return res.redirect('/planes-admin');

        if(plan_count >= maximo_planes){
            res.redirect('/planes-admin');
        }

        else{
            //JSON Insertar
            let json = {
                id_user: id_user,
                fecha_inicial: fecha_actual,
                fecha_final: nueva_fecha,
                capital: inver_text,
                id_transaccion: id_transaccion
            }

            let insertar = await mysql2.ejecutar_query_con_array(`INSERT INTO solicitud_planes (id_user,id_plan,json_solicitud_planes) VALUES (?,?,?)`,[id_user,name_plan_input,JSON.stringify(json)]);
        }



        res.redirect('/planes-admin');
    }


    async AceptarPlanes(req,res){

      //Obtener id del usuario
      const id_user_session = req.session.id_user;

      //Obtener Permisos
      let permisos = await mysql2.ejecutar_query_con_array(`select rol from usuario inner join rol on rol_id = id_rol where id = ?`,[id_user_session]);
      permisos = permisos[0];

      if(permisos['rol'] != "Administrador") return res.redirect('/admin');


      //Obtener ID PLAN a aceptar
      let id_plan_a_aceptar = req.params.id;
      //Obtener Informacion De la solicitud
      let solicitud = await mysql2.ejecutar_query_con_array(`select * from solicitud_planes where id_solicitud_planes = ?`,[id_plan_a_aceptar]);
      solicitud = solicitud[0];
      //Asignar Informacion Del Plan
      let {id_solicitud_planes, id_user, id_plan, json_solicitud_planes} = solicitud;
      //Obtener Monto
      let monto = JSON.parse(json_solicitud_planes)['capital'];
      //Obtener Datos del plan
      let plan_info = await mysql2.ejecutar_query_con_array(`SELECT * FROM plan_inversion WHERE plan_id = ?`,[id_plan])
      plan_info = plan_info[0];
      //Obtener Mas Datos
      let {duracion_meses} = plan_info;
      //Asignar Fechas
      let fecha_actual = new Date(); //Fecha actual
      var nuevaFecha = new Date();
      nuevaFecha.setMonth(nuevaFecha.getMonth() + duracion_meses);

      let insertar_plan = await mysql2.ejecutar_query_con_array(`INSERT INTO planes_activos (plan_id, user_id, capital, capital_cobrada, fecha_inicio, fecha_expiracion, disponible, cobrado) VALUES (?,?,?,?,?,?,?,?)`,[id_plan,id_user,monto,0,fecha_actual,nuevaFecha,1,0]);
      let eliminar_solicitud = await mysql2.ejecutar_query_con_array(`DELETE FROM solicitud_planes WHERE id_solicitud_planes = ?`,[id_plan_a_aceptar])

      res.redirect('/admin/planes');
    }

    async RechazarPlanes(req,res){

      //Obtener id del usuario
      const id_user_session = req.session.id_user;

      //Obtener ID PLAN a aceptar
      let id_plan_a_aceptar = req.params.id;

      //Obtener Permisos
      let permisos = await mysql2.ejecutar_query_con_array(`select rol from usuario inner join rol on rol_id = id_rol where id = ?`,[id_user_session]);
      permisos = permisos[0];

      if(permisos['rol'] != "Administrador") return res.redirect('/admin');

      let eliminar_solicitud = await mysql2.ejecutar_query_con_array(`DELETE FROM solicitud_planes WHERE id_solicitud_planes = ?`,[id_plan_a_aceptar])

      res.redirect('/admin/planes');



    }




}

module.exports = new Planes();
