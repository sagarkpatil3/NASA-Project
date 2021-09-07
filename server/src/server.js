const http = require('http');
const app = require('./app');
const mongoose = require('mongoose');
const { loadPlanetData } = require('./models/planets.model');
const {MONGO_URL} = require('../config');
const {mongoConect} = require('../services/mongo')
const PORT = process.env.PORT || 8000;

const server = http.createServer(app);


async function startServer(){
    await mongoConect();
    await loadPlanetData();
    server.listen(PORT, ()=>{
        console.log(`Server is Running on Port: ${PORT}`)
    })
}

startServer();