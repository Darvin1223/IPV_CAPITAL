const conexion = require("../Database/database");
const mysql2 = require('../Database/mysql2');
const moment = require('moment');

class User {
  showUsersAdmin(req, res) {
    moment.locale('es-do');

    const id = req.session.id_user;
    const queryUsers = "select * from usuario inner join estatus on estatus.id_status = estatus_id order by ultimo_login desc LIMIT 10";
    const queryUsersEliminados =
      "SELECT user_eliminados.nombre, user_eliminados.apellido,user_eliminados.fecha_eliminacion, user_eliminados.razones, user_eliminados.telefono, user_eliminados.email, usuario.nombre as nombre_eliminado, usuario.apellido as apellido_eliminado FROM user_eliminados INNER JOIN usuario ON user_eliminados.admin_id = usuario.id";

    const queryUserInactivos = 'SELECT * FROM `usuario` INNER JOIN estatus ON usuario.estatus_id = estatus.id_status WHERE estado = "Inactivos"';
    const queryUserProcesando = "SELECT * From usuario WHERE estatus_id = 3";
    const generalQuery =
      "SELECT * FROM `usuario` INNER JOIN rol ON usuario.rol_id = rol.id_rol INNER JOIN estatus ON usuario.estatus_id = estatus.id_status WHERE usuario.id = ?";
    const querySolicitudes = "SELECT * FROM `solicitud`";
    conexion.query(generalQuery, [id], (err, results) => {
      if (err) {
        console.error(err);
      } else {
        conexion.query(`${queryUsers}`, (err, usersResults) => {
          if (err) {
            console.error(err);
          } else {
            conexion.query(
              queryUserInactivos,
              (errorInactivos, resultsUsersInactivos) => {
                if (errorInactivos) {
                  console.error(errorInactivos);
                } else {
                  conexion.query(
                    queryUserProcesando,
                    (errorusersProcesando, usersProcesando) => {
                      if (errorusersProcesando) {
                        console.log(`Hubo un error: ${errorusersProcesando}`);
                      } else {
                        conexion.query(
                          queryUsersEliminados,
                          (errorEliminados, resultsEliminados) => {
                            if (errorEliminados) {
                              console.error(errorEliminados);
                            } else {
                              conexion.query(
                                querySolicitudes,
                                (errorsSolicitudes, resultsSolocitudes) => {
                                  if (errorsSolicitudes) {
                                    console.log(errorsSolicitudes);
                                  } else {
                                    res.render("layouts/admin/users", {
                                      title:
                                        "Usuarios | IPV CAPITAL - Admin Panel",
                                      // rol: 'Administrador',
                                      results: results,
                                      Users: usersResults,
                                      UsersInactivos: resultsUsersInactivos,
                                      usersProcesando: usersProcesando,
                                      UserEliminados: resultsEliminados,
                                      solicitudes: resultsSolocitudes,
                                      moment
                                    });
                                  }
                                }
                              );
                            }
                          }
                        );
                      }
                    }
                  );
                }
              }
            );
          }
        });
      }
    });
  }
  getUserData(req, res) {



    const id = req.params.id;


    const query = "SELECT * FROM usuario WHERE id = ?";
    // const queryPais = "SELECT * FROM `usuario`  WHERE usuario.id = ?";
    const queryUser =
      "SELECT * FROM usuario INNER JOIN documentos ON documentos.usuario_id = usuario.id INNER JOIN pais ON usuario.pais_id = pais.id_pais INNER JOIN tipo_documento ON documentos.tipo_id = tipo_documento.id WHERE usuario.id = ?";

    conexion.query(queryUser, [id], (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(result)
        res.send(result);
    }
    });


}
  async eliminarUser(req, res) {
    const id = req.query.id;
    const id_admin = req.session.id_user;
    const date = new Date();
    const id_status = 7;
    const fecha_eliminacion = `${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`;
    const { razones } = req.body;
    const query = "SELECT * FROM usuario WHERE id = ?";
    // const queryUpdateStatus = "UPDATE `usuario` SET estatus_id = ? WHERE id  = ?";
    const queryUpdateStatus = "UPDATE usuario SET estatus_id = ? WHERE id = ?";
    const queryInsert = "INSERT INTO user_eliminados SET ?";


    let permisos_usuarios = await mysql2.ejecutar_query_con_array(`SELECT * FROM usuario INNER JOIN rol ON usuario.rol_id = id_rol WHERE id = ?`,[id_admin]);
    permisos_usuarios = permisos_usuarios[0];

    if(id_admin == null || id_admin == undefined) return res.redirect('/admin');
    if(permisos_usuarios['rol'] != "Administrador") return res.redirect('/admin');


    let Informacion_usuario_a_eliminar = await mysql2.ejecutar_query_con_array(query,[id]);
    Informacion_usuario_a_eliminar = Informacion_usuario_a_eliminar[0];

    let fecha_actual = new Date();

    let {email, password, nombre, apellido, telefono, edad, fecha_nacimiento, fecha_creacion, ultimo_login, codigo_referido, pais_id, rol_id, estatus_id, wallet_id, id_pais, update_profile_date} = Informacion_usuario_a_eliminar;

    let editar_estado_usuario = await mysql2.ejecutar_query_con_array(`UPDATE usuario SET estatus_id = ? WHERE id = ?`,[0,id]);

    let insertar_usuario_eliminados = await mysql2.ejecutar_query_con_array(`INSERT INTO user_eliminados (fecha_eliminacion, razones, user_id, admin_id, email, password, nombre, apellido, telefono, edad, fecha_nacimiento, fecha_creacion, ultimo_login, codigo_referido, pais_id, rol_id, estatus_id, wallet_id, id_pais, update_profile_date) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) `,[fecha_actual,razones,id,id_admin,email, password, nombre, apellido, telefono, edad, fecha_nacimiento, fecha_creacion, ultimo_login, codigo_referido, pais_id,rol_id, estatus_id, wallet_id, id_pais, update_profile_date])


    res.redirect('/admin/users');

  }

  inactivosUsers(req, res) {
    // Queries
    const queryUsers = "SELECT * FROM `usuario`";
    const currentDate = new Date();

    const getData = () => {
      conexion.query(queryUsers, (error, results) => {
        if (error) {
          console.error(error);
        } else {
          results.forEach((result) => {
            const dateData = new Date(result.fecha_creacion);
            console.log(dateData);
            const deferentOfData = currentDate.getTime() - dateData.getTime();

            const diasTranscurridos = Math.floor(
              deferentOfData / (1000 * 60 * 60 * 24)
            );
            return diasTranscurridos;
          });
        }
      });
    };

    const isInactive = async () => {
        console.log("Esto se esta ejecutando")
      const diferenceOfDays = await getData();
      if (diferenceOfDays >= 15) {
        console.log("Han pasado 15 días desde la fecha dada.");
      } else {
        console.log("No han pasado 15 días desde la fecha dada.");
      }
    };

    setInterval(isInactive, 1000);
    inactivosUsers();
  }

  async SaveReferido(req,res){

    let codigo_referido = req.params.codigo;

    req.session.referido = codigo_referido;
    req.session.save()

    return res.redirect('/sign-up');

  }



}

module.exports = new User();
