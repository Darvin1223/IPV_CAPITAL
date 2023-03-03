const conexion = require("../Database/database");

class Capital{

    showCapitalesAdmin(req,res){
        const id = req.session.id_user;
        const generalQuery = "SELECT * FROM `usuario` INNER JOIN rol ON usuario.rol_id = rol.id_rol INNER JOIN estatus ON usuario.estatus_id = estatus.id_status WHERE usuario.id = ?";
        const retiroQueryCapital = "SELECT * FROM `usuario` INNER JOIN estatus ON estatus.id_status = usuario.estatus_id INNER JOIN retiro_capital ON retiro_capital.usuario_id = usuario.id WHERE usuario.id";
        conexion.query(generalQuery,[id],(err,results)=>{
            if(err){
                console.error(err)
            }else{
                res.render('layouts/admin/capital',{
                    title: "Retiros de capital | IPV CAPITAL - Admin Panel",
                    results:results
                })
            }
        })
       
    }
}

module.exports = new Capital();