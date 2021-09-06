const launchesCollection = require('./launches.mongo');
const planets = require('./planets.mongo');

const launches = new Map();
let DEFAULT_FLIGHT_NUMBER = 100;
const launch = {
    flightNumber: 100,
    mission: "Kepler Exploration X",
    rocket: "Explorer IS1",
    launchDate: new Date('December 16, 2022'),
    target: 'Kepler-442 b',
    customers: ['ZTM', 'NASA'],
    upcoming: true,
    success: true
}

launches.set(launch.flightNumber, launch);

async function existsLaunchWithId(launchId){
    return await launchesCollection.exists({flightNumber: launchId})
}

async function getLatestFlightNumber(){
    let flightNumber = await launchesCollection.findOne().sort('-flightNumber');

    if(!flightNumber){
        return DEFAULT_FLIGHT_NUMBER;
    }

    return flightNumber.flightNumber;
}

async function getAllLaunches(){
    // return Array.from(launches.values());
    return await launchesCollection.find({});
}

async function saveLaunch(launch){
    let planet = await planets.findOne({keplerName: launch.target });

    if(!planet){
        throw new Error('No Matching Planet Found');
    }

    console.log("newLaunch", launch);

    await launchesCollection.findOneAndUpdate({flightNumber: launch.flightNumber}, {...launch}, {upsert: true})
}

async function scheduleNewLaunch(launch){
    const newFlightNumber = await getLatestFlightNumber() + 1;

    const newLaunch = Object.assign(launch, {
        customers: ['ZTM', 'NASA'],
        upcoming: true,
        success: true,
        flightNumber: newFlightNumber
    })


    await saveLaunch(newLaunch);
}

async function abortLaunchById(launchId){
    const abortLaunch = await launchesCollection.findOneAndUpdate({flightNumber: launchId}, {upcoming: false, success: false}, { new: true })
    return abortLaunch;
}

module.exports = {
    getAllLaunches: getAllLaunches,
    scheduleNewLaunch,
    existsLaunchWithId,
    abortLaunchById,
}