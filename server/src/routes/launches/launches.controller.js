const { getAllLaunches, scheduleNewLaunch, existsLaunchWithId, abortLaunchById } = require('../../models/launches.model');
const { getPagination } = require('../../../services/query');
const { listen } = require('../../app');

async function httpGetAllLaunches(req, res){
    let { skip, limit } = getPagination(req.query);
    return res.status(200).json(await getAllLaunches(skip, limit));
}

async function httpAddNewLaunch(req, res){
    let launch = req.body;
    if(!launch.mission || !launch.rocket || !launch.launchDate || !launch.target){
        return res.status(400).json({
            error: 'Missing required launch property'
        })
    }

    launch.launchDate = new Date(launch.launchDate);
    if (isNaN(launch.launchDate)) {
        return res.status(400).json({
        error: 'Invalid launch date',
        });
    }
    
    await scheduleNewLaunch(launch)
    return res.status(201).json(launch)
}

async function httpAbortLaunch(req, res){
    const launchId = Number(req.params['id']);
    let isLaunchExist = await existsLaunchWithId(launchId)
    if(!isLaunchExist){
        return res.status(404).json({ error: 'Not Found'})
    } else {
        return res.status(200).json(await abortLaunchById(launchId))
    }
}

module.exports = { httpGetAllLaunches, httpAddNewLaunch, httpAbortLaunch }