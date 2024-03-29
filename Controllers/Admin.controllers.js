const conexion = require("./../Database/database");
const otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer");
const mysql2 = require('../Database/mysql2');

function calcularPorcentaje(cantidad, porcentaje) {
  return (cantidad * porcentaje) / 100;
}

class Admin {



 async index(req, res) {
    const id = req.session.id_user;


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


  async indexAdmin(req, res) {
    const id = req.session.id_user;
    const queryUsers = "select * from usuario inner join estatus on estatus.id_status = estatus_id order by ultimo_login desc LIMIT 10";

     //Balance para retiro
  let balance_para_retiro = await mysql2.ejecutar_query_con_array(`SELECT ROUND(SUM(capital + capital * tasa_interes/100 * IF(UNIX_TIMESTAMP(NOW())>UNIX_TIMESTAMP(fecha_expiracion), TIMESTAMPDIFF(DAY, fecha_inicio, fecha_expiracion), TIMESTAMPDIFF(DAY, fecha_inicio, now())) / 365),2) as ganancia FROM planes_activos INNER JOIN plan_inversion ON plan_inversion.plan_id = planes_activos.plan_id WHERE NOW() > fecha_expiracion`,[id]);
  balance_para_retiro = balance_para_retiro[0]['ganancia'] != null ? balance_para_retiro[0]['ganancia'] : 0;
    //Planes activos
  let planes_totales = await mysql2.ejecutar_query(`SELECT COUNT(*) as total FROM planes_activos WHERE disponible = 1`);
  planes_totales = planes_totales[0]['total'];
  //Inversion Total
  let inversion_total = await mysql2.ejecutar_query(`select ifnull((SUM(capital)),0) as inversion_total from planes_activos`);
  inversion_total = inversion_total[0]['inversion_total'];
  //Ganancias Totales
  let ganancias_totales = await mysql2.ejecutar_query(`SELECT ifnull(ROUND(SUM(capital * tasa_interes/100 * IF(UNIX_TIMESTAMP(NOW())>UNIX_TIMESTAMP(fecha_expiracion), TIMESTAMPDIFF(DAY, fecha_inicio, fecha_expiracion), TIMESTAMPDIFF(DAY, fecha_inicio, now())) / 365 - capital_cobrada),2),0) as ganancia FROM planes_activos INNER JOIN plan_inversion ON plan_inversion.plan_id = planes_activos.plan_id`);
  ganancias_totales = ganancias_totales[0]['ganancia'];
  //Retiros totales
  let retiros_totales = await mysql2.ejecutar_query(`select ifnull(sum(monto),0) as total_retiros from solicitud_retiros inner join estatus on solicitud_retiros.estado = id_status join usuario on usuario.id = id_user join wallet on usuario.wallet_id = wallet.id_wallet where estatus.estado = "Pendiente"`);
  retiros_totales = retiros_totales[0]['total_retiros'];
  //Pagos totales
  let pagos_totales = await mysql2.ejecutar_query(`select IFNULL(sum(monto),0) as monto from pagos inner join retiros on pagos.id_retiro = retiros.id_retiros join estatus on pagos.estatus_id = estatus.id_status`);
  pagos_totales = pagos_totales[0]['monto'];


    // const planesActivos = "SELECT * FROM `plan_inversion` INNER JOIN estatus On plan_inversion.estado_id = estatus.id_status;";
    conexion.query(
      "SELECT * FROM `usuario` INNER JOIN rol ON usuario.rol_id = rol.id_rol INNER JOIN estatus ON usuario.estatus_id = estatus.id_status WHERE usuario.id = ?",
      [id],
      (err, results) => {
        let planes = [];

        if (err) {
          console.log(err);
        } else {
          conexion.query(`${queryUsers}`, (error, resultsUsers) => {
            if (error) {
              console.log(error);
            } else {
              // conexion.query(`${planesActivos}`, (errorEstado,resultsPlanesActivos)=>{
              // if(errorEstado){
              //   console.error(`Hubo un error ${errorEstado}`)
              // }else{
              res.render("layouts/admin/index", {
                title: "Dashboard | IPV CAPITAL - Admin Panel",
                results: results,
                Users: resultsUsers,
                balance_para_retiro,
                planes_totales,
                inversion_total,
                ganancias_totales,
                retiros_totales,
                pagos_totales
                // PlanesActivos:resultsPlanesActivos
              });
              // }
              // })
            }
          });
        }
      }
    );
  }

  verific_acount_page(req, res) {
    const { fecha_nacimiento, pais, edad, id, code_id, email } = req.body;
    const imagenes = [];
    const elements = req.files;
    const queryDocument = "INSERT INTO documentos SET ?";
    const tipoDocumento = 1;
    let urls_imagenes = [];
    const code = otpGenerator.generate(4, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    const add_code = (code) => {
      conexion.query(
        "INSERT INTO codigo_verificacion SET ?",
        { codigo: code, user_id: id },
        (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("Agregado");
          }
        }
      );
    };

    conexion.query(
      "SELECT * FROM usuario WHERE id = ?",
      [id],
      async (err, result) => {
        await add_code(code);
        if (err) {
          console.log(err);
        } else {
          const getData = (
            fecha_nacimiento,
            pais,
            edad,
            id,
            code,
            imagenes
          ) => {
            let email = "";
            result.forEach((element) => {
              return (email = element.email);
            });

            let url_documento_dni, nombre_documento;
            elements.forEach((img) => {
              url_documento_dni = `/dni/${img.filename}`;
              nombre_documento = img.filename;
              urls_imagenes.push(url_documento_dni);
              imagenes.push(nombre_documento);
            });

            urls_imagenes = JSON.stringify(urls_imagenes);
            imagenes = JSON.stringify(imagenes);
            const datos = {
              fecha_nacimiento: fecha_nacimiento,
              pais: pais,
              edad: edad,
              id: id,
              email: email,
              code: code,
              imagenes: imagenes,
              url: urls_imagenes,
              nombre_documento: nombre_documento,
            };

            conexion.query(
              queryDocument,
              {
                nombre_documento: imagenes,
                url: urls_imagenes,
                tipo_id: tipoDocumento,
                usuario_id: datos.id,
              },
              (err) => {
                if (err) {
                  console.log(err);
                } else {
                  conexion.query(
                    "UPDATE `usuario` SET ? WHERE id = ?",
                    [
                      {
                        edad: edad,
                        fecha_nacimiento: fecha_nacimiento,
                        pais_id: pais,
                      },
                      id,
                    ],
                    (err) => {
                      if (err) {
                        console.log(`Hubo un erro ${err}`);
                      } else {
                        res.redirect(`/opt-validacion?id=${id}`);
                        return { msg: "Datos fue agregados", datos: datos };
                      }
                    }
                  );
                }
              }
            );
          };

          const send_mail = async (email_recibe) => {
            let datos = await getData(
              fecha_nacimiento,
              pais,
              edad,
              id,
              code,
              imagenes
            );

            let transporter = nodemailer.createTransport({
              host: "mail.necodt.com",
              port: 587,
              secure: false, // true for 465, false for other ports
              auth: {
                user: "pruebas@necodt.com", // generated ethereal user
                pass: "Pruebas123", // generated ethereal password
              },
              tls: {
                rejectUnauthorized: false,
              },
            });
            try {
              console.log(email)
              let mail = transporter.sendMail({
                from: `pruebas@necodt.com`, // sender address
                to: `darvin.rod10@gmail.com`, // list of receivers
                // to: `${datos.email}`, // list of receivers
                subject: "Codigo de verificacion ✔ IPV_CAPITAL 👻", // Subject line
                text: `Este es tu codigo de vereificacion: ${code}`,
              });
            } catch (error) {
              console.log(error);
            }
          };

          try {
            send_mail(email);
          } catch (error) {
            console.log(error);
          }

        }
      }
    );
  }

  opt_account_page(req, res) {
    const id = req.query.id;

    conexion.query(
      "SELECT * FROM `usuario` INNER JOIN rol ON usuario.rol_id = rol.id_rol INNER JOIN estatus ON usuario.estatus_id = estatus.id_status WHERE usuario.id = ?",
      [id],
      (err, results) => {
        if (err) {
          console.log(err);
        } else {
          console.log(results);
          res.render("opt_verificacion", {
            title: "Dashboard | IPV CAPITAL - Admin Panel",
            results: results,
            layout: false,
          });
        }
      }
    );
  }

  opt_verification(req, res) {
    const { id, code } = req.body;
    console.log(id);
    let codigo = 0,
      status = 3;
    conexion.query(
      "SELECT * FROM `usuario` INNER JOIN codigo_verificacion ON usuario.id = codigo_verificacion.user_id WHERE usuario.id = ?",
      [id],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          result.forEach((element) => {
            codigo = Number(element.codigo);
          });
          console.log(codigo, code);
          if (Number(code) == codigo) {
            conexion.query(
              "UPDATE `usuario` SET ? WHERE id = ?",
              [{ estatus_id: status }, id],
              (err) => {
                if (err) {
                  console.log(err);
                } else {
                  return res.redirect("/admin");
                }
              }
            );
          } else {
            console.log("codigo no coinciden");
          }
        }
      }
    );
  }


  //Areas No Definidas (Por ahora)

  async CalcularInteres(req,res){





    res.send(200);
  }


}

module.exports = new Admin();
