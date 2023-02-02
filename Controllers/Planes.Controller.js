class Planes {

    showPlanesUser(req,res){
        res.render('layouts/planesAdmin',{
            title: "planes Admin | IPV CAPITAL - Admin Panel",
            rol: "user"
        })
    }
    showPlanesAdmin(req,res){
        res.render('layouts/admin/planes',{
            title: "planes Admin | IPV CAPITAL - Admin Panel",
            rol: "Administrador"
        })
    }

}

module.exports = new Planes();