class Referidos {

    showReferidosUser(req,res){
        res.render('layouts/referidos',{
            title: "Referidos User | IPV CAPITAL - Admin Panel",
        })
    }
}
module.exports = new Referidos();