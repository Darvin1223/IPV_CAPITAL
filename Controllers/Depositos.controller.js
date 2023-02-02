class Depositos{

    showDepositosAdmin(req,res){
        res.render('layouts/admin/depositos',{
            title: "Darvin Rodriguez | IPV CAPITAL - Admin Panel",
            rol: 'Administrador'
        })
    }
}

module.exports = new Depositos();