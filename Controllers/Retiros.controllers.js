class Retiro {

    showRetirosUser(req,res){
        res.render('layouts/retiros',{
            title: "Retiros User | IPV CAPITAL - Admin Panel",
        })
    }

    showRetiroCapitalUser(req,res){
        res.render('layouts/retiro_capital',{
            title: "Retiros de capital | IPV CAPITAL - Admin Panel",
        })
    }
}

module.exports = new Retiro();