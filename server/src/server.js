const http = require('http');
const app = require('./app');
const mongoose = require('mongoose');
const { loadPlanetData } = require('./models/planets.model');
const {MONGO_URL} = require('../config');
const PORT = process.env.PORT || 8000;


const server = http.createServer(app);

mongoose.connection.once('open',()=>{
    console.log('MongoDB Connection is ready!')
})

mongoose.connection.on('error', (error)=>{
    console.error('MongoDB Error', error)
})

async function startServer(){
    await mongoose.connect(MONGO_URL)
    await loadPlanetData();
    server.listen(PORT, ()=>{
        console.log(`Server is Running on Port: ${PORT}`)
    })
}

startServer();