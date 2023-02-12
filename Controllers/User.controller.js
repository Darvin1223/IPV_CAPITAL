const conexion = require("../Database/database");

class User {
    showUsersAdmin(req,res){
         const id = req.session.id_user;
         const queryUsers = "SELECT * FROM `usuario`";
         const queryUsersEliminados = "";
         const queryUserInactivos = "SELECT * FROM `usuario` WHERE estatus_id = 6";
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
                                res.render('layouts/admin/users',{
                                    title: "Usuarios | IPV CAPITAL - Admin Panel",
                                    // rol: 'Administrador',
                                    results:results,
                                    Users:usersResults,
                                    UsersInactivos:resultsUsersInactivos
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