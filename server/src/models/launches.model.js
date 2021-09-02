const launches = new Map();
let latestLaunchNumber = 100;
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

function existsLaunchWithId(launchId){
    return launches.has(launchId)
}

function getAllLaunches(){
    return Array.from(launches.values());
}

function addNewLaunch(newLaunch){
    latestLaunchNumber++;
    launches.set(latestLaunchNumber, Object.assign(newLaunch, {
        flightNumber: latestLaunchNumber,
        customers: ['ZTM', 'NASA'],
        upcoming: true,
        success: true
    }))
}

function abortLaunchById(launchId){
    const aborted = launches.get(launchId)
    aborted.upcoming = false;
    aborted.success = false;
    return aborted;
}

module.exports = {
    getAllLaunches: getAllLaunches,
    addNewLaunch: addNewLaunch,
    existsLaunchWithId,
    abortLaunchById,
}