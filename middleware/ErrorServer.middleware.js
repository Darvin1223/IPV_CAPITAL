
const errorServer = (error,req,res,next)=>{
    console.log(error.stack);
    res.status(500).send(`Hay un error en el servidor ${error}`);
    next();
};

module.exports = errorServer;