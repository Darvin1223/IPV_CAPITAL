class Capital{

    showCapitalesAdmin(req,res){
        res.render('layouts/admin/capital',{
            title: "Retiros de capital | IPV CAPITAL - Admin Panel",
            rol:"Administrador"
        })
    }
}

module.exports = new Capital();