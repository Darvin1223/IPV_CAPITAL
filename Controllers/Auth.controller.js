const conexion = require("./../Database/database"),
  bcryptjs = require("bcryptjs");

class Auth {
  async login(req, res) {
    const { email, password } = req.body;
    const time = 3600000;
    email.toLowerCase();
    if (email && password) {
      conexion.query("SELECT * FROM usuario WHERE email = ?", [email], async (err, result) => {         
        //verificando password
        const verifyPassword = await bcryptjs.compare( password, result[0].password);
        // console.log(verifyPassword)
        if(result.length == 0 || verifyPassword === false){
            return res.status(404).redirect("/login", {
                alert: "Contraseña incorrecta",
              });
        }else{
            req.session.loggedin = true;
            req.session.cookie.expires = new Date() + time;
            req.session.cookie.maxAge = time;
            req.session.rol = result[0].rol_id;
            req.session.id_user = result[0].id;
            if(result[0].rol_id == 1){
              return res.status(200).redirect("/admin/dashboard");
            }else if(result[0].rol_id == 2)
            return res.status(200).redirect("/admin");
        }

      });
    } else {
      return res.redirect("/login");
    }
  }
  async sign_up(req, res) {
    const { Name, lastName, email, telefono, password, ConfirmPAssword } =
      req.body;
    const rol = 2,
      estatus = 5;
    email.toLowerCase();
    console.log(Name,lastName,email,telefono,password,ConfirmPAssword)
    if (password != ConfirmPAssword) {
      return res.redirect("/sign-up");
    } else {
      const passwordHaash = await bcryptjs.hash(password, 8);
      conexion.query(
        "INSERT INTO usuario SET ?",
        {
          email: email,
          password: passwordHaash,
          nombre: Name,
          apellido: lastName,
          telefono: telefono,
          rol_id: rol,
          estatus_id: estatus
        },
        async (err) => {
          if (err) {
            console.log(err);
            return res.redirect("/sign-up");
          } else {
            return res.redirect("/login");
          }
        }
      );
    }
  }
  logout(req, res) {
    req.session.destroy();
    return res.redirect("/");
  }
}

module.exports = new Auth();
