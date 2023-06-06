const conexion = require("../Database/database");
const mysql2 = require('../Database/mysql2');
const moment = require('moment');


class Preview{

    async Index(req,res){

      const id = req.params.id;
      const id_user = req.session.id_user;


      let permisos = await mysql2.ejecutar_query_con_array(`select rol from usuario inner join rol on rol_id = id_rol where id = ?`,[id_user]);
      permisos = permisos[0];

      if(permisos['rol'] != "Administrador") return res.redirect('/admin');

      //Codigo Richar




     //Ganancias Totales
    let ganancias_totales = await mysql2.ejecutar_query_con_array(`SELECT SUM(capital + capital * tasa_interes/100 * IF(UNIX_TIMESTAMP(NOW())>UNIX_TIMESTAMP(fecha_expiracion), TIMESTAMPDIFF(DAY, fecha_inicio, fecha_expiracion), TIMESTAMPDIFF(DAY, fecha_inicio, now()))) AS ganancias FROM planes_activos INNER JOIN plan_inversion ON plan_inversion.plan_id = planes_activos.plan_id where user_id = ?`,[id]);
    ganancias_totales = ganancias_totales[0]['ganancia'] != null ? ganancias_totales[0]['ganancia'] : 0;
    //Planes Activos
    let planes_activos = await mysql2.ejecutar_query_con_array(`SELECT COUNT(*) as planes_activos FROM planes_activos WHERE user_id = ?`,[id])
    planes_activos = planes_activos[0]['planes_activos'];
    //Inversion Total
    let inversion_total = await mysql2.ejecutar_query_con_array(`SELECT SUM(capital) as inversion_total FROM planes_activos WHERE user_id = ? AND cobrado = 0`,[id])
    inversion_total = inversion_total[0]['inversion_total'] != null ? inversion_total[0]['inversion_total'] : 0;
    //Tiempo para la siguiente inversion
    let tiempo_restante = await mysql2.ejecutar_query_con_array(`SELECT IF(TIMESTAMPDIFF(MINUTE, NOW(), fecha_expiracion) < 0, 0,TIMESTAMPDIFF(MINUTE, NOW(), fecha_expiracion)) as minutos, IF(TIMESTAMPDIFF(HOUR, NOW(),fecha_expiracion) < 0 , 0, TIMESTAMPDIFF(HOUR, NOW(),fecha_expiracion)) as horas, IF(TIMESTAMPDIFF(DAY, NOW(),fecha_expiracion) < 0, 0, TIMESTAMPDIFF(DAY, NOW(),fecha_expiracion)) as dias FROM planes_activos WHERE user_id = ? and cobrado = 0 ORDER BY fecha_inicio asc LIMIT 1`,[id])
    tiempo_restante = tiempo_restante.length > 0 ? tiempo_restante[0] : { minutos: "nulo", horas: "nulo", dias: "nulo" }
    //Ultima Transacciones
    let ultima_transacciones = await mysql2.ejecutar_query_con_array(`SELECT SUM(capital) as suma FROM planes_activos WHERE month(fecha_inicio ) = month(now()) and year(fecha_inicio) = year(now()) and user_id = ?`,[id]);
    ultima_transacciones = ultima_transacciones[0]['suma'] != null || 0 ? ultima_transacciones[0]['suma'] : 0;
    //Balance para retiro
    let balance_para_retiro = await mysql2.ejecutar_query_con_array(`SELECT ROUND(SUM(capital * tasa_interes/100 * IF(UNIX_TIMESTAMP(NOW())>UNIX_TIMESTAMP(fecha_expiracion), TIMESTAMPDIFF(DAY, fecha_inicio, fecha_expiracion), TIMESTAMPDIFF(DAY, fecha_inicio, now())) / 365 - capital_cobrada),2) as ganancia FROM planes_activos INNER JOIN plan_inversion ON plan_inversion.plan_id = planes_activos.plan_id WHERE user_id = ?`,[id]);
    balance_para_retiro = balance_para_retiro[0]['ganancia'] != null ? balance_para_retiro[0]['ganancia'] : 0;

    //Referencias por bonos
    let data_user = await mysql2.ejecutar_query_con_array(`SELECT * FROM usuario WHERE id = ?`,[id]);
    data_user = data_user[0];
    let codigo_referido = data_user['codigo_referido'];
    let ganancias_referencias = await mysql2.ejecutar_query_con_array(`SELECT IFNULL( ROUND(SUM(capital * tasa_interes/100 * IF(UNIX_TIMESTAMP(NOW())>UNIX_TIMESTAMP(fecha_expiracion), TIMESTAMPDIFF(DAY, fecha_inicio, fecha_expiracion), TIMESTAMPDIFF(DAY, fecha_inicio, now())) / 365 * 10 / 100),2),0) as ganancia FROM codigo_referido INNER JOIN usuario ON codigo_referido.user_id = usuario.id JOIN planes_activos ON planes_activos.user_id = codigo_referido.user_id JOIN plan_inversion ON planes_activos.plan_id = plan_inversion.plan_id WHERE codigo_referido.codigo_referido = ? AND disponibilidad = 1`,[codigo_referido]);
    ganancias_referencias = ganancias_referencias[0]['ganancia']
    //Actualizando Balance de retiro
    balance_para_retiro =  balance_para_retiro + ganancias_referencias

      conexion.query(
        "SELECT * FROM `usuario` INNER JOIN rol ON usuario.rol_id = rol.id_rol INNER JOIN estatus ON usuario.estatus_id = estatus.id_status WHERE usuario.id = ?",
        [id],
        (err, results) => {
          conexion.query("SELECT * FROM pais", (error, paises) => {
            if (err) {
              console.log(err);
            } else {
              res.render("layouts/index", {
                title: "Dashboard | IPV CAPITAL -- Admin Panel",
                results: results,
                paises: paises,
                ganancias_totales,
                planes_activos,
                inversion_total,
                tiempo_restante,
                ultima_transacciones,
                balance_para_retiro,
                ganancias_referencias
              });
            }
          });



        }
      );





    }

}


module.exports = new Preview();
