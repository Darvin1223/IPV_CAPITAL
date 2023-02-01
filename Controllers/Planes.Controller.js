class Planes {

    showPlanesUser(req,res){
        res.render('layouts/planesAdmin',{
            title: "planes Admin | IPV CAPITAL - Admin Panel",
        })
    }

}

module.exports = new Planes();