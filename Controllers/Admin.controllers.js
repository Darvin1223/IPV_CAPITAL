class Admin {

    index(req,res){
        res.render('layouts/index')
    }
    verific_acount_page(req,res){
        res.render('verific-account',{
            layout:false
        })
    }

}

module.exports = new Admin();