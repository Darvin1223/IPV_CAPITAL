const verifyRol = (req,res,next)=>{
    const {loggedin, rol} = req.session;

    if(loggedin === true && (rol === 'Administrador' || rol === 'administrador' || rol === 'ADMINISTRADOR') || (rol === 'User' || rol === 'USER' || rol === 'user')){
        next();
    }else{
        res.redirect('/login');
    }
};


module.exports = verifyRol;
