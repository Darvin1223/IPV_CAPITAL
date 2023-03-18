const mysql = require('mysql2/promise');
// get the promise implementation, we will use bluebird
const bluebird = require('bluebird');



class con_mysql2{

    


    async ejecutar_query(query){
        const connection = await mysql.createConnection({host:process.env.HOST, user: process.env.USER,password:process.env.PASSWORD, database: process.env.DATABASE, Promise: bluebird});
        const [rows, fields] = await connection.execute(query)
        connection.end();
        return rows;
    }
    
    async ejecutar_query_con_array(query,array){
        const connection = await mysql.createConnection({host:process.env.HOST, user: process.env.USER,password:process.env.PASSWORD, database: process.env.DATABASE, Promise: bluebird});
        const [rows, fields] = await connection.execute(query,array)
        connection.end();
        return rows;
    }

    async insertar_tabla(tabla,valores,datos){

        valores = valores.toString();

        //var `INSERT INTO ${tabla} (${valores}) VALUES ()`


    }

    async editar_tabla(tabla,valores,datos){

    }

}

module.exports = new con_mysql2();