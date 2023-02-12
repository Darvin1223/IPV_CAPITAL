class Trasaciones {

    showTransacionesUser(req,res){
        res.render('layouts/transaciones',{
            rol:"user"
        });
    }

    // Transaciones
    showTransacionesAdmin(req,res){
        const id = req.session.id_user;
        const generalQuery = "SELECT * FROM `usuario` INNER JOIN rol ON usuario.rol_id = rol.id_rol INNER JOIN estatus ON usuario.estatus_id = estatus.id_status WHERE usuario.id = ?";
        conexion.query(generalQuery, [id],(err,results)=>{
            if(err){
                console.error(err)
            }else{
                res.render('layouts/admin/transaciones',{
                    results:results
                })
               
            }
        })
       
    }
}

module.exports = new Trasaciones();