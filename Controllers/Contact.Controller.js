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
            res.json("Enviado")
        }catch(e){
            res.json(e);
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
            res.json("Enviado")
        }catch(e){
            res.json(e);
        }
        
        
    }

}

module.exports = new Contact();