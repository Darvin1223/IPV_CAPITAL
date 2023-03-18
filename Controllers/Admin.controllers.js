const conexion = require("./../Database/database");
const otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer");
const mysql2 = require('../Database/mysql2');

class Admin {
  index(req, res) {
    const id = req.session.id_user;
   
    conexion.query(
      "SELECT * FROM `usuario` INNER JOIN rol ON usuario.rol_id = rol.id_rol INNER JOIN estatus ON usuario.estatus_id = estatus.id_status WHERE usuario.id = ?",
      [id],
      (err, results) => {
   
        conexion.query("SELECT * FROM pais", (error, paises) => {
          if (err) {
            console.log(err);
          } else {
            res.render("layouts/index", {
              title: "Dashboard | IPV CAPITAL - Admin Panel",
              results: results,
              paises: paises,
              
            });
          }
        });
      }
    );
  }
  indexAdmin(req, res) {
    const id = req.session.id_user;
    const queryUsers = "SELECT * FROM `usuario`";
    // const planesActivos = "SELECT * FROM `plan_inversion` INNER JOIN estatus On plan_inversion.estado_id = estatus.id_status;";
    conexion.query(
      "SELECT * FROM `usuario` INNER JOIN rol ON usuario.rol_id = rol.id_rol INNER JOIN estatus ON usuario.estatus_id = estatus.id_status WHERE usuario.id = ?",
      [id],
      (err, results) => {
        let planes = [];
       
       if(err){
        console.log(err)
       }else{
        conexion.query(`${queryUsers}`, (error,resultsUsers)=>{
          if(error){
            console.log(error)
          }else{
            // conexion.query(`${planesActivos}`, (errorEstado,resultsPlanesActivos)=>{
              // if(errorEstado){
              //   console.error(`Hubo un error ${errorEstado}`)
              // }else{
                res.render("layouts/admin/index", {
                  title: "Dashboard | IPV CAPITAL - Admin Panel",
                  results:results,
                  Users:resultsUsers,
                  // PlanesActivos:resultsPlanesActivos
                });
              // }
            // })
           
          }
        })
      
       }
      }
    );
    
  }

  verific_acount_page(req, res) {
    const { fecha_nacimiento, pais, edad, id,code_id,email} = req.body;
    const imagenes = [];
    const elements = req.files;
    const queryDocument = "INSERT INTO documentos SET ?";
    const tipoDocumento = 1;
    let urls_imagenes = [];
    const code = otpGenerator.generate(4, {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
      });

      const add_code = (code) =>{
        conexion.query("INSERT INTO codigo_verificacion SET ?", {codigo:code,user_id:id},(err)=>{
          if(err){
            console.log(err)
          }else{
            console.log("Agregado")
          }
        })
      }
      
    conexion.query("SELECT * FROM usuario WHERE id = ?", [id], async(err,result)=>{
        await add_code(code)
      if(err){
        console.log(err)
      }else{
        const getData = (fecha_nacimiento, pais, edad, id, code, imagenes) => {
          let email = "";
             result.forEach(element =>{
               return email = element.email;
             })
            
          let url_documento_dni, nombre_documento;
          elements.forEach((img) => {
            url_documento_dni = `/dni/${img.filename}`;
            nombre_documento = img.filename;
            urls_imagenes.push(url_documento_dni);
            imagenes.push(nombre_documento);
          });

          urls_imagenes = JSON.stringify(urls_imagenes)
          imagenes = JSON.stringify(imagenes)
        const  datos = {
            fecha_nacimiento:fecha_nacimiento,
            pais:pais,
            edad:edad,
            id:id,
            email:email,
            code:code,
            imagenes:imagenes,
            url_documento_dni:urls_imagenes,
            nombre_documento:nombre_documento
          };
         
          conexion.query(queryDocument,{nombre_documento:imagenes,url_documento:urls_imagenes,tipo_id:tipoDocumento,usuario_id:id}, err =>{
            if(err){
              console.log(err)
            }else{
              conexion.query("UPDATE `usuario` SET ? WHERE id = ?",[{edad:edad,fecha_nacimiento:fecha_nacimiento,pais_id:pais}, id],err =>{
            
                if(err){
                  console.log(`Hubo un erro ${err}`)
                }else{
                   res.redirect(`/opt-validacion?id=${id}`);
                  return {msg:"Datos fue agregados",datos:datos}; 
                }
              })
            }
          })
        
    
     
        };
    
        const send_mail = async () =>{
    
            let datos = await getData(fecha_nacimiento, pais, edad, id, code, imagenes);
           
           
            let transporter = nodemailer.createTransport({
                host: "mail.necodt.com",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                  user: 'pruebas@necodt.com', // generated ethereal user
                  pass: 'Pruebas123', // generated ethereal password
                },tls: {
                    rejectUnauthorized: false
                }
              });
              try {
                let mail = transporter.sendMail({
                    from: `IPV_CAPITAL 👻 pruebas@necodt.com`, // sender address
                    to: `${email}`, // list of receivers
                    // to: `${datos.email}`, // list of receivers
                    subject: "Codigo de verificacion ✔", // Subject line
                    text: `Este es tu codigo de vereificacion: ${code}`, 
                    
                  });
                 
              } catch (error) {
                console.log(error)
              }
             
        }    
        send_mail()
      }
    })

 
    

  }

  opt_account_page(req,res){

    const id = req.query.id;
    

    conexion.query("SELECT * FROM `usuario` INNER JOIN rol ON usuario.rol_id = rol.id_rol INNER JOIN estatus ON usuario.estatus_id = estatus.id_status WHERE usuario.id = ?",[id],(err,results)=>{
      if(err){
        console.log(err)
      }else{
        console.log(results)
        res.render("opt_verificacion", {
          title: "Dashboard | IPV CAPITAL - Admin Panel",
          results: results,
          layout:false
        });
      }
    })
  }

  opt_verification(req,res){
    const {id,code} = req.body;
    console.log(id)
    let codigo = 0, status= 3;
    conexion.query("SELECT * FROM `usuario` INNER JOIN codigo_verificacion ON usuario.id = codigo_verificacion.user_id WHERE usuario.id = ?",[id],(err,result)=>{
      if(err){
        console.log(err)
      }else{
        result.forEach(element =>{
          codigo = Number(element.codigo)
        })
        console.log(codigo, code)
        if(Number(code) == codigo){
          conexion.query("UPDATE `usuario` SET ? WHERE id = ?",[{estatus_id:status},id],err=>{
            if(err){
              console.log(err)
            }else{
              return res.redirect('/admin')
            }
          })
        }else{
          console.log("codigo no coinciden")
        }
      }
    })
  }


  //Areas No Definidas (Por ahora)

  async CalcularInteres(req,res){







  }


}

module.exports = new Admin();
