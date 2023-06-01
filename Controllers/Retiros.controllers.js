const conexion = require("../Database/database");
const mysql2 = require('../Database/mysql2');
const moment = require('moment');

function encontrarMontoParaCompletar(jsonArray, cantidadEspecifica) {
  jsonArray.sort((a, b) => a.monto - b.monto);

  let montoActual = 0;
  const planesUtilizados = [];

  for (let i = 0; i < jsonArray.length; i++) {
    montoActual += jsonArray[i].monto;
    planesUtilizados.push(jsonArray[i]);

    if (montoActual >= cantidadEspecifica) {

      console.log(montoActual);

      //const montoNecesario = montoActual - jsonArray[i].monto;
      let montoNecesario = montoActual - cantidadEspecifica;
      console.log(montoNecesario)

      const cantidadSacadaPorPlan = {};

      for (const plan of planesUtilizados) {
        cantidadSacadaPorPlan[plan.id_plan] = plan.monto;
      }

      return {
        montoNecesario,
        cantidadSacadaPorPlan,
      };
    }
  }

  return null;
}

function completarMontoSolicitado(montoSolicitado, planes) {
  // Calcula la suma de todos los montos de los planes
  const sumaMontos = planes.reduce((acumulador, plan) => acumulador + plan.monto, 0);

  // Verifica si la suma de los montos no alcanza el monto solicitado
  if (sumaMontos < montoSolicitado) {
    return "No es posible alcanzar la cantidad solicitada con los planes proporcionados.";
  }

  // Ordenar los planes de menor a mayor monto
  planes.sort((a, b) => a.monto - b.monto);

  // Variable para almacenar los planes seleccionados con las cantidades individuales
  const planesSeleccionados = [];

  // Calcular el monto necesario por plan
  const montoNecesarioPorPlan = montoSolicitado / planes.length;

  // Recorrer los planes y asignar el monto necesario por plan
  for (const plan of planes) {
    const montoSacado = Math.min(plan.monto, montoNecesarioPorPlan);
    planesSeleccionados.push({ id_plan: plan.id_plan, monto: montoSacado });
  }

  return planesSeleccionados;
}





function encontrarMontoParaCompletar_2(jsonArray, cantidadEspecifica) {
  // Ordenar el array en base al monto en orden ascendente
  jsonArray.sort((a, b) => a.monto - b.monto);

  let montoActual = 0;
  const planesUtilizados = [];

  for (let i = 0; i < jsonArray.length; i++) {
    montoActual += jsonArray[i].monto;
    planesUtilizados.push(jsonArray[i]);

    // Si el monto actual supera o iguala la cantidad específica, se encontró el monto necesario
    if (montoActual >= cantidadEspecifica) {
      const montoNecesario = montoActual - cantidadEspecifica;

      return {
        montoNecesario,
        planesUtilizados,
      };
    }
  }

  // Si no se encontró un monto suficiente, devolver null o un mensaje indicativo
  return null;
}


function encontrarMontoParaCompletar_unico(jsonArray, cantidadEspecifica) {
  jsonArray.sort((a, b) => a.monto - b.monto);

  let montoActual = 0;
  let planValido = null;

  for (let i = 0; i < jsonArray.length; i++) {
    montoActual += jsonArray[i].monto;

    if (montoActual >= cantidadEspecifica) {
      planValido = jsonArray[i];
      break;
    }
  }

  return planValido;
}

function encontrarMontoExacto(jsonArray, cantidadEspecifica) {
  // Filtrar los planes cuyos montos sean menores o iguales a la cantidad específica
  const planesValidos = jsonArray.filter((plan) => plan.monto <= cantidadEspecifica);

  // Recorrer los planes válidos y verificar si alguno tiene un monto igual a la cantidad específica
  for (let i = 0; i < planesValidos.length; i++) {
    if (planesValidos[i].monto === cantidadEspecifica) {
      return cantidadEspecifica;
    }
  }

  // Si no se encuentra un monto exacto en un solo plan, buscar en otros planes
  for (let i = 0; i < jsonArray.length; i++) {
    if (jsonArray[i].monto < cantidadEspecifica) {
      const montoFaltante = cantidadEspecifica - jsonArray[i].monto;
      const montoEncontrado = encontrarMontoExacto(jsonArray, montoFaltante);

      if (montoEncontrado !== null) {
        return montoEncontrado + jsonArray[i].monto;
      }
    }
  }

  // Si no se encuentra un monto exacto en ningún plan, devolver null o un mensaje indicativo
  return null;
}

function sacarCantidadConPlanes(cantidad, planes) {
  // Ordenar los planes de menor a mayor monto
  planes.sort((a, b) => a.monto - b.monto);

  // Variable para almacenar los planes seleccionados
  const planesSeleccionados = [];

  let montoAcumulado = 0;
  let indicePlan = 0;

  while (montoAcumulado < cantidad && indicePlan < planes.length) {
    const plan = planes[indicePlan];
    const montoDisponible = plan.monto;
    const cantidadSacar = Math.min(montoDisponible, cantidad - montoAcumulado);

    if (cantidadSacar > 0) {
      planesSeleccionados.push({ id_plan: plan.id_plan, monto: cantidadSacar });
      montoAcumulado += cantidadSacar;
    }

    indicePlan++;
  }

  // Redondear el monto acumulado a 2 decimales
  montoAcumulado = Number(montoAcumulado.toFixed(2));

  if (montoAcumulado < cantidad) {
    return "No es posible completar la cantidad solicitada con los planes existentes.";
  }

  return planesSeleccionados;
}



class Retiro {


  async showRetirosUser(req,res){
        const id = req.session.id_user;
        const generalQuery = "SELECT * FROM `usuario` INNER JOIN rol ON usuario.rol_id = rol.id_rol INNER JOIN estatus ON usuario.estatus_id = estatus.id_status WHERE usuario.id = ?";

        const retiros_pendientes = await mysql2.ejecutar_query_con_array(`SELECT ROUND(monto,2) as monto,estatus.estado FROM solicitud_retiros inner join usuario on usuario.id = solicitud_retiros.id_user join estatus on solicitud_retiros.estado = estatus.id_status WHERE id_user = ? AND estatus.estado = ?`,[id,'Pendiente']);

        let balance_para_retiro = await mysql2.ejecutar_query_con_array(`SELECT ROUND(SUM(capital * tasa_interes/100 * IF(UNIX_TIMESTAMP(NOW())>UNIX_TIMESTAMP(fecha_expiracion), TIMESTAMPDIFF(DAY, fecha_inicio, fecha_expiracion), TIMESTAMPDIFF(DAY, fecha_inicio, now())) / 365 - capital_cobrada),2) as ganancia FROM planes_activos INNER JOIN plan_inversion ON plan_inversion.plan_id = planes_activos.plan_id WHERE user_id = ?`,[id]);
        balance_para_retiro = balance_para_retiro[0]['ganancia'] != null ? balance_para_retiro[0]['ganancia'] : 0;

        let historial_retiros = await mysql2.ejecutar_query_con_array(`select monto,fecha_solicitud,estatus.estado from solicitud_retiros inner join estatus on id_status = solicitud_retiros.estado WHERE estatus.estado = 'Recibido'`);


       conexion.query(generalQuery,[id],(err,results)=>{
        if(err){
            console.error(err)
        }else{
            res.render('layouts/retiros',{
                title: "Retiros User | IPV CAPITAL - Admin Panel",
                results:results,
                retiros_pendientes,
                balance_para_retiro,
                historial_retiros,
                moment
            })
        }
       })
    }


    //Solicitar retiros
    async SolicitarRetiro_Planes(req,res){

    }


    async Comprobar_Tipo_Retiros(req,res){

      let {producto} = req.body;

      switch (producto) {

        case "Planes":
        let cantidad = req.body['monto'];
        let origen = req.body['origen'];
        let producto = req.body['producto'];

        console.log(req.body);

        const id_user = req.session.id_user;
        const planes_total = await mysql2.ejecutar_query_con_array(`SELECT planes_activos.planesActivos_id as id_plan, ROUND(capital * tasa_interes/100 * IF(UNIX_TIMESTAMP(NOW())>UNIX_TIMESTAMP(fecha_expiracion), TIMESTAMPDIFF(DAY, fecha_inicio, fecha_expiracion), TIMESTAMPDIFF(DAY, fecha_inicio, now())) / 365 - capital_cobrada,2) as monto FROM planes_activos INNER JOIN plan_inversion ON plan_inversion.plan_id = planes_activos.plan_id WHERE planes_activos.user_id = ?`,[id_user]);
        const resultado = sacarCantidadConPlanes(cantidad,planes_total);

        //Obtener Id Estado
        let obtener_id_estado = await mysql2.ejecutar_query_con_array(`SELECT * FROM estatus WHERE estado = ?`,['Pendiente']);
        obtener_id_estado = obtener_id_estado[0]['id_status'];

        if(resultado != null){

            let json_insert = JSON.stringify(resultado);
            var insert = await mysql2.ejecutar_query_con_array(`INSERT INTO solicitud_retiros (id_user, monto, producto, origen, json_solicitud_retiros, fecha_solicitud, estado) VALUES (?,?,?,?,?,?,?)`,[id_user,cantidad,producto,origen,json_insert, new Date(),obtener_id_estado])

            resultado.forEach(async function(plan_foreach) {

                let obtener_balance = await mysql2.ejecutar_query_con_array(`SELECT capital_cobrada FROM ipv_capital.planes_activos WHERE planesActivos_id = ?`,[plan_foreach.id_plan]);
                obtener_balance = obtener_balance[0]['capital_cobrada'];

                await mysql2.ejecutar_query_con_array(`UPDATE planes_activos SET capital_cobrada = ? WHERE planesActivos_id = ?`,[obtener_balance + plan_foreach.monto,plan_foreach.id_plan]);
            });

            res.redirect('/admin')

        }

        break;




      }

    }




async AceptarRetiro(req,res){

    let id_retiros_solicitud = req.params.id;
    //Obtener id del usuario
    const id_user_session = req.session.id_user;
    //Obtener Permisos
    let permisos = await mysql2.ejecutar_query_con_array(`select rol from usuario inner join rol on rol_id = id_rol where id = ?`,[id_user_session]);
    permisos = permisos[0];
    //Si no es admin mandarlo para el lobby
    if(permisos['rol'] != "Administrador") return res.redirect('/admin');
    //Obtener informacion solicitud
    let obtener_retiro = await mysql2.ejecutar_query_con_array(`SELECT * FROM solicitud_retiros WHERE id_solicitud_retiro = ?`,[id_retiros_solicitud]);
    obtener_retiro = obtener_retiro[0];
    //Obtener Datos
    let {id_solicitud_retiro,id_user, monto, producto, origen, json_solicitud_retiros, fecha_solicitud, estado} = obtener_retiro;
    //Obtener id del estado
    let id_estado = await mysql2.ejecutar_query_con_array(`SELECT * FROM estatus WHERE estado = ?`,['Recibido']);
    id_estado = id_estado[0]['id_status'];
    //Editar estado de la solicitud
    let editar_solicitud = await mysql2.ejecutar_query_con_array(`UPDATE solicitud_retiros SET estado=? WHERE id_solicitud_retiro = ?`,[id_estado,id_solicitud_retiro]);
    //Insertar en pagos
    let insertar_pagos = await mysql.ejecutar_query('INSERT INTO pagos (id_retiro, fecha_pago, estatus_id) VALUES (?,?,?)',[id_solicitud_retiro,new Date(),id_estado])

    res.redirect('/admin/retiros');
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
  async  showRetirosAdmin(req,res){
        const id = req.session.id_user;
        const generalQuery = "SELECT * FROM `usuario` INNER JOIN rol ON usuario.rol_id = rol.id_rol INNER JOIN estatus ON usuario.estatus_id = estatus.id_status WHERE usuario.id = ?";

        //Historial
        const historial_retiros = await mysql2.ejecutar_query_con_array(`SELECT ROUND(monto,2) as monto,estatus.estado,solicitud_retiros.fecha_solicitud FROM solicitud_retiros inner join usuario on usuario.id = solicitud_retiros.id_user join estatus on solicitud_retiros.estado = estatus.id_status WHERE estatus.estado = ?`,['Recibido']);

        //Retiros totales
        let retiros_totales = await mysql2.ejecutar_query_con_array(`SELECT IFNULL(SUM(monto), 0) AS total_retiros FROM solicitud_retiros INNER JOIN estatus ON solicitud_retiros.estado = estatus.id_status JOIN usuario ON usuario.id = solicitud_retiros.id_user JOIN wallet ON usuario.wallet_id = wallet.id_wallet WHERE estatus.estado = 'Pendiente'`,[]);
        retiros_totales = retiros_totales[0];

        let data_retiros_pendientes = await mysql2.ejecutar_query(`select * from solicitud_retiros inner join estatus on solicitud_retiros.estado = id_status join usuario on usuario.id = id_user join wallet on usuario.wallet_id = wallet.id_wallet where estatus.estado = "Pendiente"`);

        console.log(retiros_totales)
        console.log(data_retiros_pendientes);


        conexion.query(generalQuery,[id],(err,results)=>{
            if(err){
                console.error(err);
            }else{
                res.render('layouts/admin/retiros',{
                    title: "Retiros de capital | IPV CAPITAL - Admin Panel",
                    results:results,
                    retiros_totales,
                    data_retiros_pendientes
                })
            }
        })

    }

    async Aceptar_Retiro(req,res){

      let id_retiro = req.params.id;
      let id_user = req.session.id_user;

      //Obtener fecha
      let fecha = new Date();

      let permisos = await mysql2.ejecutar_query_con_array(`select rol from usuario inner join rol on rol_id = id_rol where id = ?`,[id_user]);
      permisos = permisos[0];

      if(permisos['rol'] != "Administrador") return res.redirect('/admin');

      //Obtener Informacion
      let obtener_informacion_solicitud = await mysql2.ejecutar_query_con_array(`select * from solicitud_retiros where id_solicitud_retiro = ?`,[id_retiro]);
      obtener_informacion_solicitud = obtener_informacion_solicitud[0];
      //Obtener Id Estado
      let obtener_id_estado = await mysql2.ejecutar_query_con_array(`SELECT * FROM estatus WHERE estado = ?`,['Recibido']);
      obtener_id_estado = obtener_id_estado[0];
      //Actualizar Estado del retiro
      let actualizacion = await mysql2.ejecutar_query_con_array(`UPDATE solicitud_retiros SET estado = ? WHERE id_solicitud_retiro = ?`,[obtener_id_estado['id_status'],id_retiro]);
      //Insertar en retiros
      var array_insert_retiros = [obtener_informacion_solicitud['id_user'],id_user,'',obtener_informacion_solicitud['monto'],new Date(),obtener_id_estado['id_status']];
      let insertar_retiro = await mysql2.ejecutar_query_con_array(`INSERT INTO retiros (id_user, confirmado_por, planes, monto, fecha_retiro, estatus_id) VALUES (?,?,?,?,?,?)`,array_insert_retiros);
      //Insertar Pago
      var array_insert_pago = [insertar_retiro['insertId'],fecha,obtener_id_estado['id_status']];
      let insertar_pago = await mysql2.ejecutar_query_con_array(`INSERT INTO pagos (id_retiro, fecha_pago, estatus_id) VALUES (?,?,?)`,array_insert_pago)




      res.redirect('/admin/retiros');
    }


    async RechazarRetiro(req,res){

      let id_retiro = req.params.id;
      let id_user = req.session.id_user;

      //Obtener fecha
      let fecha = new Date();

      let permisos = await mysql2.ejecutar_query_con_array(`select rol from usuario inner join rol on rol_id = id_rol where id = ?`,[id_user]);
      permisos = permisos[0];

      if(permisos['rol'] != "Administrador") return res.redirect('/admin');

      //Obtener Informacion
      let obtener_informacion_solicitud = await mysql2.ejecutar_query_con_array(`select * from solicitud_retiros where id_solicitud_retiro = ?`,[id_retiro]);
      obtener_informacion_solicitud = obtener_informacion_solicitud[0];

      let {json_solicitud_retiros} = obtener_informacion_solicitud;


      JSON.parse(json_solicitud_retiros).forEach(async function(planes_foreach) {
          let informacion_plan = await mysql2.ejecutar_query_con_array(`SELECT capital_cobrada FROM planes_activos WHERE planesActivos_id = ?`,[planes_foreach.id_plan]);
          informacion_plan = informacion_plan[0]['capital_cobrada'];

          let nuevo_valor = informacion_plan - planes_foreach.monto;

          let actualizar_planes = await mysql2.ejecutar_query_con_array(`UPDATE planes_activos SET capital_cobrada = ? WHERE planesActivos_id = ?`,[nuevo_valor,planes_foreach.id_plan])
      });


      let delete_solicitud = await mysql2.ejecutar_query_con_array(`DELETE FROM solicitud_retiros where id_solicitud_retiro = ?`,[id_retiro]);

      res.redirect('/admin/retiros');
    }



}

module.exports = new Retiro();
