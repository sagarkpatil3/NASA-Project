const express = require('express');
const lauchesRouter = express.Router();
const { httpGetAllLaunches, httpAddNewLaunch, httpAbortLaunch } = require('./launches.controller');

lauchesRouter.get('/', httpGetAllLaunches);
lauchesRouter.post('/', httpAddNewLaunch);
lauchesRouter.delete('/:id', httpAbortLaunch)

module.exports = lauchesRouter;