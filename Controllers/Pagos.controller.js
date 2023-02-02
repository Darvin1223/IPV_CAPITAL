class Pagos {

    showPaysAdmin(req,res){
        res.render('layouts/admin/pagos',{
            title: "Darvin Rodriguez | IPV CAPITAL - Admin Panel",
            rol: 'Administrador'
        })
    }
}

module.exports = new Pagos();