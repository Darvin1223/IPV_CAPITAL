const conexion = require("../Database/database");
const mysql2 = require('../Database/mysql2');
const moment = require('moment');
class Wallet {

    registerWallet(req,res){
        const {id,wallet} = req.body;
        const queryAddWallet = "INSERT INTO wallet SET ?";
        conexion.query(queryAddWallet,{
            haash_wallet:wallet,
            user_id:id
        }, err =>{
            if(err){
                console.log(err)
            }else{
                res.redirect("/profile");
            }
        })
    }

    async reqUpdateeWallet(req,res){

        const {id,wallet} = req.body;

        let obtener_datos = await mysql2.ejecutar_query_con_array(`select id_wallet,haash_wallet from usuario inner join wallet on id = user_id where id =?`,[id])
        obtener_datos = obtener_datos[0];

        let {id_wallet, haash_wallet} = obtener_datos;


        let insert_data = {
          id_user:id,
          old_wallet:haash_wallet,
          new_wallet: wallet
        }


        let insertar_solicitud = await mysql2.InsertarDatos(`solicitud_wallet`,insert_data);



        res.redirect("/profile");
    }


    updateWallet(req,res){

        console.log(`Actualizando Billetera`)


        const query = "UPDATE wallet SET ? WHERE user_id = ?";
        const {id,wallet} = req.body;
        conexion.query(query, [{haash_wallet:wallet}, id], error,sql =>{
            if(error){
                console.log(error);
            }else{
                console.log(error)
                res.redirect("/profile");
            }
        });
    }

    updateWalletAdmin(req,res){
        const query = "INSERT INTO `wallet` SET ? WHERE user_id = ?";
        const {id,wallet} = req.body;
        conexion.query(query, [{haash_wallet:wallet}, id], error =>{
            if(error){
                console.log(error);
            }else{
                res.redirect("/profile");
            }
        });
    }


    async AceptarWallet(req,res){

      let id_peticion = req.params.id;
      const id_admin = req.session.id_user;

      let permisos_usuarios = await mysql2.ejecutar_query_con_array(`SELECT * FROM usuario INNER JOIN rol ON usuario.rol_id = id_rol WHERE id = ?`,[id_admin]);
      permisos_usuarios = permisos_usuarios[0];

      if(permisos_usuarios['rol'] != "Administrador") return res.redirect('/admin');


      let data = await mysql2.ejecutar_query_con_array(`select * from solicitud_wallet where id_cambio_wallet = ?`,[id_peticion]);
      data = data[0];


      let {id_cambio_wallet, id_user, old_wallet, new_wallet} = data;


      let editar_informacion = await mysql2.ejecutar_query_con_array(`UPDATE wallet SET haash_wallet=? WHERE user_id = ?`,[new_wallet,id_user]);
      let eliminar = await mysql2.ejecutar_query_con_array(`DELETE FROM solicitud_wallet WHERE id_cambio_wallet = ?`,[id_peticion]);

      res.redirect('/admin/users');
    }

    async RechazarWallet(req,res){

      let id_peticion = req.params.id;
      const id_admin = req.session.id_user;

      let permisos_usuarios = await mysql2.ejecutar_query_con_array(`SELECT * FROM usuario INNER JOIN rol ON usuario.rol_id = id_rol WHERE id = ?`,[id_admin]);
      permisos_usuarios = permisos_usuarios[0];

      if(permisos_usuarios['rol'] != "Administrador") return res.redirect('/admin');


      let data = await mysql2.ejecutar_query_con_array(`select * from solicitud_wallet where id_cambio_wallet = ?`,[id_peticion]);
      data = data[0];

      let {id_cambio_wallet, id_user, old_wallet, new_wallet} = data;

      let eliminar = await mysql2.ejecutar_query_con_array(`DELETE FROM solicitud_wallet WHERE id_cambio_wallet = ?`,[id_peticion]);

      res.redirect('/admin/users');
    }



}

module.exports = new Wallet();
