const mysql2 = require("mysql2");

const conexion = mysql2.createPool({
    connectionLimit: 4,
    host: process.env.HOST,
    user: process.env.USER,
    password:process.env.PASSWORD,
    database: process.env.DATABASE
});

try{
    conexion.getConnection(connection =>{
        console.log(`Conexion a la base de datos exitosamente!`)
    })
}catch(e){
    console.log(`Hubo un error al tratar de conectar la base de datos: ${e}`)
}

module.exports = conexion;