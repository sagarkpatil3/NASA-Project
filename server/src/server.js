const http = require('http');
require('dotenv').config();
const app = require('./app');
const mongoose = require('mongoose');
const { loadPlanetData } = require('./models/planets.model');
const { loadLaunchData } = require('./models/launches.model');

const {MONGO_URL} = require('../config');
const {mongoConect} = require('../services/mongo')
const PORT = process.env.PORT || 8000;

const server = http.createServer(app);


async function startServer(){
    await mongoConect();
    await loadPlanetData();
    await loadLaunchData();
    server.listen(PORT, ()=>{
        console.log(`Server is Running on Port: ${PORT}`)
    })
}

startServer();