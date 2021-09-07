const mongoose = require('mongoose');
const {MONGO_URL} = require('../config');


mongoose.connection.once('open',()=>{
    console.log('MongoDB Connection is ready!')
})

mongoose.connection.on('error', (error)=>{
    console.error('MongoDB Error', error)
})

async function mongoConect(){
    await mongoose.connect(MONGO_URL)
}

async function mongoDisConnect(){
    // await mongoose.connection.close()
    await mongoose.disconnect()
}

module.exports = { mongoConect, mongoDisConnect }