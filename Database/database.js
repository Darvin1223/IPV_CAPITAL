const mysql2 = require("mysql2");

const conexion = mysql2.createPool({
    connectionLimit: 4,
    host: process.env.HOST,
    user: process.env.USER,
    password:process.env.PASSWORD,
    database: process.env.DATABASE
});


conexion.getConnection(err =>{
    if(err){
        console.error(err)
    }else{
        console.log(`Conexion a la base de datos exitosamente!`)
    }
});
module.exports = conexion;