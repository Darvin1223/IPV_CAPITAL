class Trasaciones {

    showTransacionesUser(req,res){
        res.render('layouts/transaciones');
    }

    // Transaciones
    showTransacionesAdmin(req,res){
        res.render('layouts/admin/transaciones')
    }
}

module.exports = new Trasaciones();