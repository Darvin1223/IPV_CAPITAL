const session = require('express-session');
const horas = 500000;

const generarSecrect = (num) => {
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for(let i = 0; i < num; i++){
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

const random = () =>{
    return Math.floor((Math.random() * (20 - 10 + 1)) + 10);
}

const secrect = generarSecrect(random());


const sessionExpress = session({
        // cookie:{
        //     secure: true,
        //     maxAge: horas
        // },
        secret: secrect,
        resave: true,
        saveUninitialized: true
});


module.exports = sessionExpress;