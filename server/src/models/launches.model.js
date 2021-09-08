const launchesCollection = require('./launches.mongo');
const planets = require('./planets.mongo');
const axios = require('axios');

const SPACEX_API_URL = 'https://api.spacexdata.com/v4';

const launches = new Map();
let DEFAULT_FLIGHT_NUMBER = 100;
// const launch = {
//     flightNumber: 100, //flight_number
//     mission: "Kepler Exploration X", // name
//     rocket: "Explorer IS1", // rocket.name
//     launchDate: new Date('December 16, 2022'), // date_local
//     target: 'Kepler-442 b', // not applicateble
//     customers: ['ZTM', 'NASA'], // payload.customers
//     upcoming: true, //upcoming
//     success: true //success
// }

// launches.set(launch.flightNumber, launch);

async function existsLaunchWithId(launchId){
    return await launchesCollection.exists({flightNumber: launchId})
}

async function findLaunch(filter){
    return await launchesCollection.findOne(filter);
}

async function getLatestFlightNumber(){
    let flightNumber = await launchesCollection.findOne().sort('-flightNumber');

    if(!flightNumber){
        return DEFAULT_FLIGHT_NUMBER;
    }

    return flightNumber.flightNumber;
}

async function getAllLaunches(skip, limit){
    // return Array.from(launches.values());
    return await launchesCollection.find({}, {'_id': 0, '__v':0}).sort({ flightNumber: 1 }).skip(skip).limit(limit);
}

async function saveLaunch(launch){
    await launchesCollection.findOneAndUpdate({flightNumber: launch.flightNumber}, {...launch}, {upsert: true})
}

async function scheduleNewLaunch(launch){
    let planet = await planets.findOne({keplerName: launch.target });

    if(!planet){
        throw new Error('No Matching Planet Found');
    }

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

async function populateLaunches(){
    console.log('Downloading Launch Data ....');
    try {
        const response = await axios.post(`${SPACEX_API_URL}/launches/query`, {
            query:{},
            options:{
                pagiation: false,
                populate:[
                    {
                        path:'rocket',
                        select: { name : 1 }
                    },
                    {
                        path: 'payloads',
                        select: {
                            'customers': 1
                        }
                    }
                ]
            }
        })

        if(response.status !== 200){
            console.log("Problem Downloading Laumch Data");
            throw new Error('Launch Data Download Failed')
        }

        const launchDocs= response.data.docs;
        for(const launchDoc of launchDocs){
            const payloads = launchDoc['payloads'];
            // Using FlatMap
            const customers = payloads.flatMap((payload)=>  payload['customers'])
            const launch = {
                flightNumber: launchDoc['flight_number'],
                mission: launchDoc['name'],
                rocket: launchDoc['rocket']['name'], 
                launchDate: launchDoc['date_local'],
                customers, 
                upcoming: launchDoc['upcoming'],
                success: launchDoc['success']
            }

            await saveLaunch(launch);

            // TODO: populate launches collection..
        }
    } catch (error) {
        console.log("response error", error)
    }
    

}

async function loadLaunchData(){
    const firstLaunch = await findLaunch({
        flightNumber: 19999,
        mission: 'FalconSat',
        rocket: 'Falcon 1', 
    });

    if(firstLaunch){
        return;
    } else {
        await populateLaunches()
    }
}

module.exports = {
    getAllLaunches: getAllLaunches,
    scheduleNewLaunch,
    existsLaunchWithId,
    abortLaunchById,
    loadLaunchData
}