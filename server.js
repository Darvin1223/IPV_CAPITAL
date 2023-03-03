const express = require('express');
const dotenv = require("dotenv");
const cors = require('cors');
const path = require('path');
const expressLayouts = require("express-ejs-layouts");
const session = require('./middleware/sessiones.middleware');
const localIpV4Address = require("local-ipv4-address");
const errorServer = require('./middleware/ErrorServer.middleware');


// Setting the envioment
dotenv.config({
    path:`${__dirname}/env/${process.env.NODE_ENV}.env`
})

// Calling routes.
const {HomeRoutes,AdminRoutes} = require('./Routes/index');

// Setting server
const server = express();

// Setting scors
server.use(cors());


// Setting PORT AND HOST.
server.set('host', process.env.HOST || '127.0.0.1');
server.set('port', process.env.PORT || 3000);
const HOST = server.get('host');
const PORT = server.get("port");

// JSON middleware.
server.use(express.urlencoded({extended: false}));
server.use(express.json());

// View engine
server.set("view engine", 'ejs');
server.set('views', path.join(__dirname, 'views'));

// Layout
server.use(expressLayouts);
server.set('layout', 'layouts/layout');

// Sessions
server.use(session);
// Using routes
server.use(HomeRoutes,AdminRoutes);

// Error server
server.use(errorServer);
// Static files
server.use(express.static(path.join(path.join(__dirname, 'public'))));
server.use('/static', express.static('public'))

// Listen 
/* server.listen(PORT, () =>{
    console.log(`This page is runnin on local http://${HOST}:${PORT}`);
}) */

localIpV4Address().then((ipAddress)=>{
    server.listen(PORT, ()=>{
        console.log(`Page service is running on local http://${HOST}:${PORT} || Network http://${ipAddress}:${PORT}`);
    });
});