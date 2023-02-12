const conexion = require("../Database/database");

class Retiro {

    showRetirosUser(req,res){
        const id = req.session.id_user;
        const generalQuery = "SELECT * FROM `usuario` INNER JOIN rol ON usuario.rol_id = rol.id_rol INNER JOIN estatus ON usuario.estatus_id = estatus.id_status WHERE usuario.id = ?";
       conexion.query(generalQuery,[id],(err,results)=>{
        if(err){
            console.error(err)
        }else{
            res.render('layouts/retiros',{
                title: "Retiros User | IPV CAPITAL - Admin Panel",
                results:results
            })
        }
       })
    }

    showRetiroCapitalUser(req,res){
        const id = req.session.id_user;
        const generalQuery = "SELECT * FROM `usuario` INNER JOIN rol ON usuario.rol_id = rol.id_rol INNER JOIN estatus ON usuario.estatus_id = estatus.id_status WHERE usuario.id = ?";

        conexion.query(generalQuery,[id],(err,results)=>{
            if(err){
                console.error(err)
            }else{
                res.render('layouts/retiro_capital',{
                    title: "Retiros de capital | IPV CAPITAL - Admin Panel",
                    results:results
                })
            }
        })
      
    }

    /* Admin */
    showRetirosAdmin(req,res){
        const id = req.session.id_user;
        const generalQuery = "SELECT * FROM `usuario` INNER JOIN rol ON usuario.rol_id = rol.id_rol INNER JOIN estatus ON usuario.estatus_id = estatus.id_status WHERE usuario.id = ?";
        conexion.query(generalQuery,[id],(err,results)=>{
            if(err){
                console.error(err);
            }else{
                res.render('layouts/admin/retiros',{
                    title: "Retiros de capital | IPV CAPITAL - Admin Panel",
                    results:results
                })
            }
        })
        
    }
}

module.exports = new Retiro();