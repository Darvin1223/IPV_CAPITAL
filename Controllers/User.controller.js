const conexion = require("../Database/database");

class User {
  showUsersAdmin(req, res) {
    const id = req.session.id_user;
    const queryUsers = "SELECT * FROM `usuario`";
    const queryUsersEliminados =
      "SELECT * FROM `user_eliminados` INNER JOIN usuario ON user_eliminados.user_id = usuario.id";

    const queryUserInactivos = "SELECT * FROM `usuario` WHERE estatus_id = 6";
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
    const id = req.query.id;
    const query = "SELECT * FROM usuario WHERE id = ?";
    // const queryPais = "SELECT * FROM `usuario`  WHERE usuario.id = ?";
    const queryUser =
      "SELECT * FROM `usuario` INNER JOIN `documentos` ON documentos.usuario_id = usuario.id INNER JOIN pais ON usuario.pais_id = id_pais INNER JOIN tipo_documento ON documentos.tipo_id = tipo_documento.id WHERE usuario.id = ?";
    conexion.query(query, [id], (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.status(200).json(result);
      }
    });
  }
  eliminarUser(req, res) {
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
    conexion.query(query, id_admin, (errorResultAdmin, resultAdmin) => {
      if (errorResultAdmin) {
        console.log(errorResultAdmin);
      } else {
        console.log(resultAdmin[0]);
        conexion.query(query, id, (errorResultUser, resultUser) => {
          if (errorResultUser) {
            console.log(errorResultUser);
          } else {
            console.log(resultUser[0]);
            conexion.query(
              queryUpdateStatus,
              [{ estatus_id: id_status }, id],
              (errorChangeOfStatus) => {
                if (errorChangeOfStatus) {
                  console.error(errorChangeOfStatus);
                } else {
                  console.log(resultUser[0].estatus_id);
                  conexion.query(
                    queryInsert,
                    {
                      razones: razones,
                      fecha_eliminacion: fecha_eliminacion,
                      user_id: id,
                      admin_id: id_admin,
                    },
                    (errorInsertDelete) => {
                      if (errorInsertDelete) {
                        console.log(errorInsertDelete);
                      } else {
                        res.redirect("/admin/users");
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
}

module.exports = new User();
