/* const faker = require('faker');
const mysql2 = require('../Database/mysql2');


class Generacion{

    generarCorreoAleatorio(){
        var caracteres = 'abcdefghijklmnopqrstuvwxyz0123456789';
        var longitud = 10;
        var correo = '';
        
        for (var i = 0; i < longitud; i++) {
          var indice = Math.floor(Math.random() * caracteres.length);
          correo += caracteres.charAt(indice);
        }
        
        correo += '@gmail.com'; // Puedes cambiar el dominio si lo deseas
        
        return correo;
    }


    generarContrasenaAleatoria(longitud) {
        var caracteres = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+';
        var contrasena = '';
        
        for (var i = 0; i < longitud; i++) {
          var indice = Math.floor(Math.random() * caracteres.length);
          contrasena += caracteres.charAt(indice);
        }
        
        return contrasena;
    }

    generarDatosUsuarioAleatorios() {
        const nombre = faker.name.firstName();
        const apellido = faker.name.lastName();
        const telefono = faker.phone.phoneNumber();
        const fechaNacimiento = faker.date.past().toISOString().split('T')[0];
      
        return {
          nombre,
          apellido,
          telefono,
          fechaNacimiento
        };
    }

      generarNumeroAleatorio() {
        const longitud = 10;
        let numero = '';
      
        for (let i = 0; i < longitud; i++) {
          numero += Math.floor(Math.random() * 10);
        }
      
        return numero;
      }


    async cuentas(req,res){

        var estatus_id = 2;
        var rol_id = 2;
        var id_pais = 18;

        var insertar_wallet = await mysql2.ejecutar_query_con_array('INSERT INTO wallet (haash_wallet,user_id) VALUES (?,?)',[generarNumeroAleatorio(),0]);

        let id_wallet = insertar_wallet.insertId;

        console.log(id_wallet)

    }


}

this.cuentas(); */