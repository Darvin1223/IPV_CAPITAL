const conexion = require('./../Database/database');

class Admin {

    index(req,res){
        conexion.query("SELECT * FROM `usuario` INNER JOIN rol ON usuario.rol_id = rol.id INNER JOIN estatus ON usuario.estatus_id = estatus.id", (err,results)=>{
            conexion.query("SELECT * FROM pais", (error,paises)=>{
                if(err){
                    console.log(err);
                   }else{
                    res.render('layouts/index',{
                        title: "Dashboard | IPV CAPITAL - Admin Panel",
                        results:results,
                        paises:paises
                    })
                   }
            })
           
        })
    }
    indexAdmin(req,res){
        res.render('layouts/admin/index',{
            title: "Dashboard | IPV CAPITAL - Admin Panel"
        })
    }
    verific_acount_page(req,res){
        conexion.query("SELECT * FROM `usuario` INNER JOIN rol ON usuario.rol_id = rol.id INNER JOIN estatus ON usuario.estatus_id = estatus.id", (err,results)=>{
            if(err){
             console.log(err);
            }else{
                res.render('layouts/verific-account',{
                    results:results,
                    title: "Dashboard | IPV CAPITAL - Admin Panel"
                })
            }
         })
        
    }

}

module.exports = new Admin();