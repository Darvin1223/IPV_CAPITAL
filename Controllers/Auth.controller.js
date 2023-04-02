const conexion = require("./../Database/database"),
  bcryptjs = require("bcryptjs"),otpGenerator = require("otp-generator");

class Auth {
  async login(req, res) {
    const { email, password } = req.body;
    const time = 3600000;
    email.toLowerCase();
    if (email && password) {
      conexion.query("SELECT * FROM usuario WHERE email = ?", [email], async (err, result) => {   
     if(result == []){
      
     }
        //verificando password
        const verifyPassword = await bcryptjs.compare( password, result[0].password);
        // console.log(verifyPassword)
        if(result.length == 0 || verifyPassword === false){
            return res.status(404).render("login",{
              alert: true,
              alertIcon: 'error',
              alertTitle:'La contraseña no es correcta',
              alertMessage: "Ingrese la contraseña correcta",
              ruta: '/login',
              title: "Titulo",
              layout:false
            });
        }else{
            req.session.loggedin = true;
            req.session.cookie.expires = new Date() + time;
            req.session.cookie.maxAge = time;
            req.session.rol = result[0].rol_id;
            req.session.id_user = result[0].id;

            conexion.query(`UPDATE usuario SET ? WHERE id = ?`, [{estatus_id:1,ultimo_login: new Date()},result[0].id], (error,sql) =>{})

            if(result[0].rol_id == 1){
              return res.status(200).redirect("/admin/dashboard");
            }else if(result[0].rol_id == 2)
            return res.status(200).redirect("/admin");
        }

      });
    } else {
      return res.render("login",{
        alert: true,
        alertIcon: 'error',
        alertTitle:'Debe agregar un email y contraseña',
        alertMessage: "Por favor llene los campos",
        ruta: '/login',
        title: "Titulo",
        layout:false
      });
    }
  }
  async sign_up(req, res) {

     const { Name, lastName, email, telefono, password, ConfirmPAssword } =
      req.body;
    const rol = 2,
      estatus = 5;
    email.toLowerCase();
    const codigoReferido = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
    let date = new Date();
    const date_creation = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
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
          fecha_creacion:date_creation,
          codigo_referido:codigoReferido,
          rol_id: rol,
          estatus_id: estatus
        },
        async (err,sql) => {
          if (err) {
            console.log(err);
            return res.redirect("/sign-up");
          } else {

            let {insertId} = sql;

            if(req.session.referido != undefined){
              conexion.query(`INSERT INTO codigo_referido SET ?`,{user_id: insertId, codigo_referido:req.session.referido }, (error, insert) =>{console.log(error)})
            }



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
