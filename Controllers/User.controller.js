class User {
    showUsersAdmin(req,res){
         res.render('layouts/admin/users',{
            title: "Usuarios | IPV CAPITAL - Admin Panel",
            rol: 'Administrador'
        })
    }
}

module.exports = new User();