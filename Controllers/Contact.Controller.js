const nodemailer = require("nodemailer");

class Contact {
    Contact(req,res){
        const {name, email, message} = req.body;
        const myEmail = process.env.EMAIL_USER;
        
        let transporter = nodemailer.createTransport({
            host: "mail.necodt.com",
            port: 465,
            secure: true,
            auth: {
                user:"info@necodt.com",
                pass: "Necodt1996"
            }
        });

        try{
            transporter.sendMail({
                from:  email,
                to: `${myEmail}`,
                subject: "Deseo comunicame con ustedes 👻",
                text: `Mi nombre es ${name} este es el mensaje: ${message}`
            });
            return res.status(200).render('index',{
                alert: true,
                alertIcon: 'success',
                alertTitle:'Mensaje enviado',
                alertMessage: "Se ha enviado el mensaje",
                ruta: '/',
                title: "Titulo",
                layout:false
            })
        }catch(e){
            return res.status(404).render('index',{
                alert: true,
                alertIcon: 'error',
                alertTitle:'Mensaje no enviado',
                alertMessage: "No se ha podido enviar el mensaje",
                ruta: '/',
                title: "Titulo",
                layout:false
            })
        }
        
        
    }
    ContactMini(req,res){
        const {name, email, options} = req.body;
        const myEmail = process.env.EMAIL_USER;
        
        let transporter = nodemailer.createTransport({
            host: "mail.necodt.com",
            port: 465,
            secure: true,
            auth: {
                user:"info@necodt.com",
                pass: "Necodt1996"
            }
        });

        try{
            transporter.sendMail({
                from:  email,
                to: `${myEmail}`,
                subject: "Deseo comunicame con ustedes 👻",
                text: `Mi nombre es ${name} y quisiera ${options}`
            });

            return res.status(200).render('index',{
                alert: true,
                alertIcon: 'success',
                alertTitle:'Mensaje enviado',
                alertMessage: "Se ha enviado el mensaje",
                ruta: '/',
                title: "Titulo",
                layout:false
            })
        }catch(e){
            return res.status(404).render('index',{
                alert: true,
                alertIcon: 'error',
                alertTitle:'Mensaje no enviado',
                alertMessage: "No se ha podido enviar el mensaje",
                ruta: '/',
                title: "Titulo",
                layout:false
            })
        }
        
        
    }

}

module.exports = new Contact();