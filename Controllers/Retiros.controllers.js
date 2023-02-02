class Retiro {

    showRetirosUser(req,res){
        res.render('layouts/retiros',{
            title: "Retiros User | IPV CAPITAL - Admin Panel",
            rol:"user"
        })
    }

    showRetiroCapitalUser(req,res){
        res.render('layouts/retiro_capital',{
            title: "Retiros de capital | IPV CAPITAL - Admin Panel",
            rol:"user"
        })
    }

    /* Admin */
    showRetirosAdmin(req,res){
        res.render('layouts/admin/retiros',{
            title: "Retiros de capital | IPV CAPITAL - Admin Panel",
            rol:"Administrador"
        })
    }
}

module.exports = new Retiro();