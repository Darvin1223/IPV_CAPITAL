class Profile {
    userProfile(req,res){
        res.render('layouts/userPorfile',{
            title: "Darvin Rodriguez | IPV CAPITAL - Admin Panel",
            rol: 'user'
        })
    }
}

module.exports = new Profile();