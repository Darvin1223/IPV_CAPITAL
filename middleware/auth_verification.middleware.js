const verifyLoggedIn = (req,res,next)=>{
    const {loggedin, rol} = req.session;

    if(loggedin === true && (rol == 1 || rol == 2)){
        next();
    }else{
        res.redirect('/login');
    }
};


module.exports = verifyLoggedIn;
