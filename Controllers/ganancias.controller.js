class Gnancias {

    showGananciasAdmin(req,res){
        res.render('layouts/admin/ganancias',{
            title: "Ganancias ",
            rol: 'Administrador'
        })
    }
}

module.exports = new Gnancias();