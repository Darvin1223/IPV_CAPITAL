const conexion = require("../Database/database");

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

    reqUpdateeWallet(req,res){

        const {id,wallet} = req.body;
        const tipo_solicitud = 1;
        const queryReq = "INSERT INTO `solicitud` SET ?";
        const query = "SELECT * FROM usuario WHERE id = ?";

        conexion.query(query, [id], (errorUser, result) => {
            if(errorUser){
                console.log(errorUser);
            }else{
                const fullName = `${result[0].nombre} ${result[0].apellido}`;
                const email = result[0].email;
                conexion.query(queryReq, {
                    fullName_solicitud:fullName,
                    tipo_solicitud:tipo_solicitud,
                    email_solicitud:email,
                    usuario_id: id,
                    datos_json: JSON.stringify([wallet])
                }, err =>{
                    if(err){
                        console.log(err);
                    }else{
                        res.redirect('/profile')
                    }
                })
            }
        })



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
}

module.exports = new Wallet();