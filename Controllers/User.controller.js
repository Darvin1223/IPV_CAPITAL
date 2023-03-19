const conexion = require("../Database/database");

class User {
    showUsersAdmin(req,res){
         const id = req.session.id_user;
         const queryUsers = "SELECT * FROM `usuario`";
         const queryUsersEliminados = "SELECT * FROM user_eliminados";
         const queryUserInactivos = "SELECT * FROM `usuario` WHERE estatus_id = 6";
         const queryUserProcesando = "SELECT * From usuario WHERE estatus_id = 3";
        conexion.query("SELECT * FROM `usuario` INNER JOIN rol ON usuario.rol_id = rol.id_rol INNER JOIN estatus ON usuario.estatus_id = estatus.id_status WHERE usuario.id = ?",[id], (err,results) =>{
            if(err){
                console.error(err)
            }else{
                conexion.query(`${queryUsers}`,(err,usersResults)=>{
                    if(err){
                        console.error(err)
                    }else{
                        conexion.query(queryUserInactivos,(errorInactivos,resultsUsersInactivos)=>{
                            if(errorInactivos){
                                console.error(errorInactivos)
                            }else{
                                conexion.query(queryUserProcesando,(errorusersProcesando,usersProcesando) =>{
                                    if(errorusersProcesando){
                                        console.log(`Hubo un error: ${errorusersProcesando}`);
                                    }else{
                                        conexion.query(queryUsersEliminados, (errorEliminados, resultsEliminados)=>{
                                            if(errorEliminados){
                                                console.error(errorEliminados)
                                            }else{
                                                res.render('layouts/admin/users',{
                                                    title: "Usuarios | IPV CAPITAL - Admin Panel",
                                                    // rol: 'Administrador',
                                                    results:results,
                                                    Users:usersResults,
                                                    UsersInactivos:resultsUsersInactivos,
                                                    usersProcesando:usersProcesando,
                                                    UserEliminados: resultsEliminados
                                                })
                                            }
                                        })
                                    }
                                })
                                
                            }
                        })
                       
                    }
                })
              
            }
        })
       
    }
    getUserData(req,res){
        const id = req.query.id;
        const query = "SELECT * FROM usuario WHERE id = ?";
        // const queryPais = "SELECT * FROM `usuario`  WHERE usuario.id = ?";
        const queryUser = "SELECT * FROM `usuario` INNER JOIN `documentos` ON documentos.usuario_id = usuario.id INNER JOIN pais ON usuario.pais_id = pais.id INNER JOIN tipo_documento ON documentos.tipo_id = tipo_documento.id WHERE usuario.id = ?";
        conexion.query(queryUser,[id],(err,result)=>{
            if(err){
                console.log(err)
            }else{
                res.status(200).json(result)
            }
        })
    }
    eliminarUser(req,res){
        const id = req.query.id;
        const id_admin = req.session.id_user;
        const {razones} = req.body;
        const query = "SELECT * FROM usuario WHERE id = ?";
        const queryDelete = "DELETE FROM usuario WHERE id  = ?";
        const queryInsert = "INSERT INTO user_eliminados SET ?";
        conexion.query(query,[id_admin],(err,resultadmin)=>{
            if(err){
                console.error(err)
            }else{
                conexion.query(query,[id],(error,resultUser)=>{
                    if(error){
                        console.error(error)
                    }else{
                        conexion.query(queryInsert, {
                            razones:razones,
                            nombre_eliminado:resultUser[0].nombre,
                            apellido_eliminado:resultUser[0].apellido,
                            Eliminado_Por:resultadmin[0].email,
                            Telefono:resultUser[0].telefono,
                            Correo:resultUser[0].email
                        }, errorInsert =>{
                            if(errorInsert){
                                console.error(errorInsert)
                            }else{
                                conexion.query(queryDelete,[id], errDelete =>{
                                    if(errDelete){
                                        console.error(errDelete)
                                    }else{
                                        return res.redirect("/admin/users")
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    }
}

module.exports = new User();