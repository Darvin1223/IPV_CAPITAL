const conexion = require("./../Database/database");
const otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer");
const mysql2 = require('../Database/mysql2');

//Minutos A Milisegundos
async function obtener_tiempo(minutos){
        return minutos * 60000;
}

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

//Controlador
let main = new TimeController()

//Establecer Tiempo
setInterval(main.UsuariosInactivos,obtener_tiempo(5));


module.exports = new TimeController()


