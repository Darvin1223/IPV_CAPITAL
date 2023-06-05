const mysql2 = require("mysql2");

const conexion = mysql2.createPool({
    connectionLimit: 4,
    host: process.env.HOST,
    user: 'root',
    password:process.env.PASSWORD,
    database: process.env.DATABASE,
    port: 3306
});


conexion.getConnection(err =>{
    if(err){
        console.log(`Hubo un error en la debe ${err.message}`)
    }else{
        console.log(`Conexion a la base de datos exitosamente!`)
    }
});
module.exports = conexion;