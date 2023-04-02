const conexion = require("./../Database/database");
const otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer");
const mysql2 = require('../Database/mysql2');

class TimeController{

    async UsuariosInactivos(){

        let meses = 3;
    
        let usuarios_inactivos = await mysql2.ejecutar_query_con_array(`SELECT id as id_usuario, timestampdiff(MONTH,ultimo_login,now()) AS meses_inactivo FROM usuario WHERE ultimo_login IS NOT NULL AND timestampdiff(MONTH,ultimo_login,now()) >= ? AND estatus_id != 6`,[meses])
    
        if(usuarios_inactivos.length == 0) return 0;

        usuarios_inactivos.forEach(async usuarios => {
            await mysql2.ejecutar_query_con_array(`UPDATE usuario SET estatus_id = 6 WHERE id = ?`,[usuarios.id_usuario])
        });


    }
}

let main = new TimeController()

//Tiempo
let cinco_minutos = 300000;
let pruebas_rapidas = 1000;

setInterval(main.UsuariosInactivos,cinco_minutos);


module.exports = new TimeController()


