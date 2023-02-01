class Admin {

    index(req,res){
        res.render('layouts/index',{
            title: "Dashboard | IPV CAPITAL - Admin Panel",
        })
    }
    indexAdmin(req,res){
        res.render('layouts/admin/index',{
            title: "Dashboard | IPV CAPITAL - Admin Panel",
        })
    }
    verific_acount_page(req,res){
        res.render('verific-account',{
            layout:false
        })
    }

}

module.exports = new Admin();