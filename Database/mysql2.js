const mysql = require('mysql2/promise');
// get the promise implementation, we will use bluebird
const bluebird = require('bluebird');

class con_mysql2{


    async ejecutar_query(query){

    try {
        const connection = await mysql.createConnection({host:process.env.HOST, user: process.env.USER,password:process.env.PASSWORD, database: process.env.DATABASE, Promise: bluebird});
        const [rows, fields] = await connection.execute(query)
        connection.end();
        return rows;
    } catch (error) {
        console.log(error);
        return [];
    }


    }

    async ejecutar_query_con_array(query,array){
        try {
            const connection = await mysql.createConnection({host:process.env.HOST, user: process.env.USER,password:process.env.PASSWORD, database: process.env.DATABASE, Promise: bluebird});
            const [rows, fields] = await connection.execute(query,array)
            connection.end();
            connection.destroy();
            return rows;
        } catch (error) {
            return [];
        }
    }

   async InsertarDatos(tabla, json){

     const columnas = Object.keys(json).join(', ');
     const valores = Object.values(json)
      .map(valor => {
        if (valor instanceof Date) {
          // Formatear el valor de fecha y hora
          const fecha = valor.toISOString().replace(/T/, ' ').replace(/\..+/, '');
          return `'${fecha}'`;
        }
        return typeof valor === 'string' ? `'${valor}'` : valor;
      })
      .join(', ');

     const consulta = `INSERT INTO ${tabla} (${columnas}) VALUES (${valores});`;


      try {
          const connection = await mysql.createConnection({host:process.env.HOST, user: process.env.USER,password:process.env.PASSWORD, database: process.env.DATABASE, Promise: bluebird});
          const [rows, fields] = await connection.execute(consulta)
          connection.end();
          connection.destroy();
          return rows;
      } catch (error) {
          return [];
      }

   }


      async generarSentenciaUpdate(tabla, datos) { // Función para generar la sentencia de actualización
        // Extraer las claves y valores del objeto JSON
        const claves = Object.keys(datos);
        const valores = Object.values(datos);

        // Generar la parte SET de la sentencia de actualización
        const sets = claves.map((clave, index) => `${clave} = '${valores[index]}'`).join(', ');

        // Generar la sentencia de actualización completa
        const sentenciaUpdate = `UPDATE ${tabla} SET ${sets}`;

        try {
            const connection = await mysql.createConnection({host:process.env.HOST, user: process.env.USER,password:process.env.PASSWORD, database: process.env.DATABASE, Promise: bluebird});
            const [rows, fields] = await connection.execute(sentenciaUpdate)
            connection.end();
            connection.destroy();
            return rows;
        } catch (error) {
            return [];
        }
    }


}

module.exports = new con_mysql2();
