const API_URL = 'http://localhost:8000/v1'

async function httpGetPlanets() {
  let response = await fetch(`${API_URL}/planets`);
  return await response.json();
}

async function httpGetLaunches() {
  let response = await fetch(`${API_URL}/launches`);
  const fetchedLaunches = await response.json();
  return fetchedLaunches.sort((a, b) => a.flightNumber - b.flightNumber) 
}

async function httpSubmitLaunch(launch) {
  try {
    let response = await fetch(`${API_URL}/launches`, { method: 'post', headers:{
      "Content-type": "application/json"
      },
      body: JSON.stringify(launch)
    })
    return response;
  } catch (error) {
    return {
      ok: false
    }
  }
  
}

async function httpAbortLaunch(id) {
  try {
    return await fetch(`${API_URL}/launches/${id}`, { method: 'delete'})
  } catch (error) {
    return {
      ok: false
    }
  }
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};