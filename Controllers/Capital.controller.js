const conexion = require("../Database/database");
const mysql2 = require('../Database/mysql2');
const moment = require('moment');

class Capital{

  async showCapitalesAdmin(req,res){
        const id = req.session.id_user;
        const generalQuery = "SELECT * FROM `usuario` INNER JOIN rol ON usuario.rol_id = rol.id_rol INNER JOIN estatus ON usuario.estatus_id = estatus.id_status WHERE usuario.id = ?";
        const retiroQueryCapital = "SELECT * FROM `usuario` INNER JOIN estatus ON estatus.id_status = usuario.estatus_id INNER JOIN retiro_capital ON retiro_capital.usuario_id = usuario.id WHERE usuario.id";

        let pendientes = await mysql2.ejecutar_query_con_array(`SELECT id_solicitud_retiro_capital, CONCAT(usuario.nombre, ' ', apellido) AS nombre_completo, email,capital,haash_wallet FROM solicitud_retiro_capital INNER JOIN estatus ON estado_id = estatus.id_status JOIN planes_activos ON id_plan = planes_activos.planesActivos_id INNER JOIN plan_inversion ON planes_activos.plan_id = plan_inversion.plan_id JOIN usuario ON usuario.id = id_user JOIN wallet ON wallet.id_wallet = wallet_id WHERE estado = "Pendiente"`);

        let historial_retiros = await mysql2.ejecutar_query_con_array(`SELECT id_solicitud_retiro_capital,fecha,plan_inversion.nombre,capital,estatus.estado,haash_wallet FROM solicitud_retiro_capital inner join estatus on id_status = estado_id join planes_antiguos on id_plan = id_plan_activo join plan_inversion on plan_inversion.plan_id = planes_antiguos.plan_id join usuario on solicitud_retiro_capital.id_user = usuario.id join wallet on wallet_id = id_wallet WHERE estado = "Recibido"`);

        moment.locale('es-do');
        

        conexion.query(generalQuery,[id],(err,results)=>{
            if(err){
                console.error(err)
            }else{
                res.render('layouts/admin/capital',{
                    title: "Retiros de capital | IPV CAPITAL - Admin Panel",
                    results:results,
                    pendientes,
                    historial_retiros,
                    moment
                })
            }
        })

    }


    async AceptarRetiroCapital(req,res){

      const id_user_session = req.session.id_user;
      let id_solicitud = req.params.id;

      let permisos = await mysql2.ejecutar_query_con_array(`select rol from usuario inner join rol on rol_id = id_rol where id = ?`,[id_user_session]);
      permisos = permisos[0];

      if(permisos['rol'] != "Administrador") return res.redirect('/admin');

      let obtener_datos = await mysql2.ejecutar_query_con_array(`SELECT * FROM solicitud_retiro_capital WHERE id_solicitud_retiro_capital = ?`,[id_solicitud]);
      obtener_datos = obtener_datos[0];

      let {id_solicitud_retiro_capital, id_user, id_plan, monto_capital, estado_id} = obtener_datos;

      //Obtener Id Estado
      let obtener_id_estado = await mysql2.ejecutar_query_con_array(`SELECT * FROM estatus WHERE estado = ?`,['Recibido']);
      obtener_id_estado = obtener_id_estado[0];

      //Obtener Informacion Del Plan
      let obtener_informacion_plan = await mysql2.ejecutar_query_con_array(`SELECT * FROM planes_activos WHERE planesActivos_id = ?`,[id_plan]);
      obtener_informacion_plan = obtener_informacion_plan[0];
      console.log(obtener_informacion_plan);
      //Obtener Informacion Plan Activo
      let {planesActivos_id, plan_id, user_id, capital, capital_cobrada, fecha_inicio, fecha_expiracion, disponible, cobrado} = obtener_informacion_plan;
      //Insertar En Planes Antiguos

      let json_datos_antiguos = {plan_id, id_plan_activo:planesActivos_id, user_id, capital, capital_cobrada, fecha_inicio, fecha_expiracion, disponible, cobrado};
      //Insertar Datos Antiguos
      let insertar_datos_antiguos = await mysql2.InsertarDatos('planes_antiguos',json_datos_antiguos);
      //Actualizar solicitud
      let actualizar_estado = await mysql2.ejecutar_query_con_array(`UPDATE solicitud_retiro_capital SET estado_id=? WHERE id_solicitud_retiro_capital = ?`,[obtener_id_estado.id_status,id_solicitud_retiro_capital]);
      //Eliminar Planes De Activos
      let eliminar_plan_activos = await mysql2.ejecutar_query_con_array(`DELETE FROM planes_activos WHERE planesActivos_id = ?`,[id_plan]);

      res.redirect('/admin/capital-admin');
    }


    async RechazarRetiroCapital(req,res){

      const id_user_session = req.session.id_user;
      let id_solicitud = req.params.id;

      let permisos = await mysql2.ejecutar_query_con_array(`select rol from usuario inner join rol on rol_id = id_rol where id = ?`,[id_user_session]);
      permisos = permisos[0];

      if(permisos['rol'] != "Administrador") return res.redirect('/admin');

      //Eliminar Planes De Activos
      let eliminar_plan_activos = await mysql2.ejecutar_query_con_array(`DELETE FROM solicitud_retiro_capital WHERE id_solicitud_retiro_capital = ?`,[id_solicitud]);

      res.redirect('/admin/capital-admin');
    }




}

module.exports = new Capital();
