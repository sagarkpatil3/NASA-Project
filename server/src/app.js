const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const planetsRouter = require('./routes/planets/planets.router');
const lauchesRouter = require('./routes/launches/launches.router');

const app = express();
app.use(express.json())
app.use(cors({ origin: 'http://localhost:3000'}));
app.use(morgan('combined'))

app.use("/planets",planetsRouter);
app.use("/launches",lauchesRouter);

app.use(express.static(path.join(__dirname,'..', 'public')))
app.get('/*', (req, res)=>{
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
})

module.exports = app;