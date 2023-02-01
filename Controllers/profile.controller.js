class Profile {
    userProfile(req,res){
        res.render('layouts/userPorfile',{
            title: "Darvin Rodriguez | IPV CAPITAL - Admin Panel",
        })
    }
}

module.exports = new Profile();