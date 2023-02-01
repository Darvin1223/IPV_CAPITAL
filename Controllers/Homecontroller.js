class Home {

    index(req,res){
        res.render('index',{
            layout:false
        })
    }
}

module.exports = new Home();