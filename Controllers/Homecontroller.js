class Home {

    index(req,res){
        res.render('index',{
            layout:false
        })
    }

    log_in(req,res){
        res.render('login',{
            layout:false
        })
    }
    log_up(req,res){
        res.render('register',{
            layout:false
        })
    }
}

module.exports = new Home();