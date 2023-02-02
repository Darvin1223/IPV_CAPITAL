const express = require('express');
const cors = require('cors');
const path = require('path');
const expressLayouts = require("express-ejs-layouts");

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


// Using routes
server.use(HomeRoutes,AdminRoutes);

// Static files
server.use(express.static(path.join(path.join(__dirname, 'public'))));
server.use('/static', express.static('public'))

// Listen 
server.listen(PORT, () =>{
    console.log(`This page is runnin on local http://${HOST}:${PORT}`);
})