const { getAllLaunches, addNewLaunch, existsLaunchWithId, abortLaunchById } = require('../../models/launches.model');

function httpGetAllLaunches(req, res){
    return res.status(200).json(getAllLaunches());
}

function httpAddNewLaunch(req, res){
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
    
    addNewLaunch(launch)
    return res.status(201).json(launch)
}

function httpAbortLaunch(req, res){
    const launchId = Number(req.params['id']);
    if(!existsLaunchWithId(launchId)){
        return res.status(404).json({ error: 'Not Found'})
    } else {
        return res.status(200).json(abortLaunchById(launchId))
    }
}

module.exports = { httpGetAllLaunches, httpAddNewLaunch, httpAbortLaunch }