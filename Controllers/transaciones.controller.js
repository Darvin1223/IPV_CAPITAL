class Trasaciones {

    showTransacionesUser(req,res){
        res.render('layouts/transaciones',{
            rol:"user"
        });
    }

    // Transaciones
    showTransacionesAdmin(req,res){
        res.render('layouts/admin/transaciones',{
            rol:"user"
        })
    }
}

module.exports = new Trasaciones();