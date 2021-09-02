const request = require('supertest');
const app = require('../../app');

describe('Test GET /launches',  ()=>{
    test('It should respond with 200 success', async ()=>{
        const response = await request(app).get('/launches').expect(200).expect('Content-Type', /json/)
    })
})

describe('Test POST /launch', () =>{
    let launchData = {
        mission:"Kepler test1",
        rocket:"Explorer Is2",
        launchDate:"June 12, 2022",
        target:"kepler - 442"
    }

    let launchDataWithoutDate = {
        mission:"Kepler test1",
        rocket:"Explorer Is2",
        target:"kepler - 442"
    }

    test('It should respond with 200 success', async()=>{
        const response = await request(app).post('/launches').send(launchData).expect('Content-Type', /json/).expect(201)

        const requestedDate = new Date(launchData.launchDate).valueOf();
        const responseDate = new Date(response.body.launchDate).valueOf();
        expect(responseDate).toBe(requestedDate);
        expect(response.body).toMatchObject(launchDataWithoutDate);
    })

    test('It should catch missing required properties', async()=>{
        let response = await request(app).post('/launches').send(launchDataWithoutDate).expect('Content-Type', /json/).expect(400)
        expect(response.body).toStrictEqual({
            error: 'Missing required launch property'
        })
    })

    test('It should catch invalid dates', async() =>{
        launchDataWithoutDate["launchDate"] = 'Hi'; 
        let response =  await request(app).post('/launches').send({
            mission:"Kepler test1",
            rocket:"Explorer Is2",
            launchDate:"Jooott",
            target:"kepler - 442"
        }).expect('Content-Type', /json/).expect(400)
        
        expect(response.body).toStrictEqual({
            error: 'Invalid launch date'
        })
    })
})