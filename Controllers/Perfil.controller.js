const conexion = require("../Database/database"),bcryptjs = require("bcryptjs"), nodemailer = require("nodemailer");
const mysql2 = require('../Database/mysql2');

// id_pais
class Profile {


    async userProfile(req,res){

        const id = req.session.id_user;
        let paises = await mysql2.ejecutar_query(`SELECT * FROM pais`);

        const generalQuery = "SELECT * FROM usuario INNER JOIN rol ON usuario.rol_id = rol.id_rol  JOIN estatus ON usuario.estatus_id = estatus.id_status  JOIN pais ON usuario.pais_id = pais.id_pais JOIN wallet ON usuario.id = wallet.user_id WHERE usuario.id = ?";
     
        let data_join = await mysql2.ejecutar_query_con_array(generalQuery,[id]);
        let data = await mysql2.ejecutar_query_con_array(`SELECT * FROM usuario INNER JOIN rol ON usuario.rol_id = rol.id_rol  JOIN estatus ON usuario.estatus_id = estatus.id_status  JOIN pais ON usuario.pais_id = pais.id_pais WHERE usuario.id = ?`,[id]);

        let results = [];

        if(data_join.length > 0){
            results = data_join;
        }

        else{
            results = data;
        }
           
        

                res.render('layouts/userPorfile',{
                    title: `IPV CAPITAL - Admin Panel`,
                    results:results,
                    paises
                })
            
     
      
    }


    async EditProfile(req,res){

        const id = req.session.id_user;

        let {nombre,apellido,email,pais,telefono} = req.body;
        
        let update = await mysql2.ejecutar_query_con_array(`UPDATE usuario SET email = ?, nombre = ?, apellido = ?, telefono = ?, pais_id = ?, update_profile_date = ? WHERE id = ?`,[email,nombre,apellido,telefono,pais, new Date(),id])

        res.redirect('/profile')

    }


    resetPasswordAdmin(req,res){
        const {id,old_password,password,repeatPassword} = req.body;
        console.log(id,old_password,password,repeatPassword);
        const query = "SELECT * FROM usuario WHERE id = ?";
        const updateQuery = "UPDATE usuario SET password = ?";
        // Verificando Que las contraseña sean iguales.
        conexion.query(query,[id],async (error, results) =>{
            if(results.length == 0){
                return await res.render("layouts/userPorfile",{
                    alert: true,
                    alertIcon: 'error',
                    alertTitle: "Datos no encontrados",
                    alertMessage: "Hubo un problema para encontrar los datos en la base de datos",
                    ruta:"/profile",
                    title: "Titulo",
                    results:results
                })
            }else{
                // const verifyPassword = await bcryptjs.compare( old_password, results[0].password);
                const verifyPassword = "safsa";
                if(verifyPassword === false){
                    return await res.render("layouts/userPorfile",{
                        alert: true,
                        alertIcon: 'error',
                        alertTitle: "Contraseña actual no conincide",
                        alertMessage: "La contraseña actual no conincide, por favor escriba de nuevo",
                        ruta:"/profile",
                        title: "Titulo",
                        results:results
                    })
                }
                const passwordHaash = "asfsaf";

                if(password != repeatPassword){
                    return await res.render("layouts/userPorfile",{
                        alert: true,
                        alertIcon: 'error',
                        alertTitle: "Contraseña Nueva no conincide",
                        alertMessage: "La contraseña nueva no conincide, por favor escriba de nuevo",
                        ruta:"/profile",
                        title: "Titulo",
                        results:results
                    })
                }
                conexion.query(updateQuery, [passwordHaash],async err =>{
                    if(err){
                        return await res.render("layouts/userPorfile",{
                            alert: true,
                            alertIcon: 'error',
                            alertTitle: "Error al actualizar",
                            alertMessage:  `${err}`,
                            ruta:"/profile",
                            title: "Titulo",
                            results:results
                        })
                    }else{
                        return await res.render("layouts/userPorfile",{
                            alert: true,
                            alertIcon: 'success',
                            alertTitle: "Contraseña actualizada",
                            alertMessage:  `La contraseña fue actualizada`,
                            ruta:"/profile",
                            title: "Titulo",
                            results:results
                        })
                    }
                
                })

            }
        });
    }





    resetPassword(req,res){
        const {id,old_password,password,repeatPassword} = req.body;
        const tipo_solicitud = 0;
        const queryReq = "INSERT INTO `solicitud` SET ?";
        const query = "SELECT * FROM usuario WHERE id = ?";

        console.log(id,old_password,password,repeatPassword);
        conexion.query(query, [id], (errorUser, result) =>{
            if(errorUser){
                console.log(errorUser)
            }else{
                const fullName = `${result[0].nombre} ${result[0].apellido}`;
                const email = result[0].email;

                conexion.query(queryReq,{
                    fullName_solicitud:fullName,
                    tipo_solicitud:tipo_solicitud,
                    email_solicitud:email,
                    usuario_id: id
                },err =>{
                    if(err){
                        console.log(err);
                    }else{
                        return res.redirect('/profile');
                    }
                });
            }
        })
       
    }
}

module.exports = new Profile();