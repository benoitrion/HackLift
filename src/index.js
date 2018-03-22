import express from 'express';
import bodyParser from 'body-parser';
import {CarController} from './controllers/cars'
import {TripsController} from './controllers/trips'
import {validateBody} from './middlewares/schemaMiddleware'
import {carSchema} from './schemas/cars'
import {coordinateSchema} from './schemas/coordinate'

/**
 * This is rather empty ....
 */

// create express app
var app = express()

// create application/json parser
var jsonParser = bodyParser.json()

// GET /hello gets hello world
app.get('/hello', (req, res) => res.send('Hello, world'))

// GET /hello gets hello world
app.post('/hello', jsonParser, function (req, res) {
    if(!req.body) return res.sendStatus(400)
    res.send('Hello, '+ req.body.username)
})

// GET /cars return all the cars
app.get('/cars', function(req, res) {
    var carsJson = JSON.stringify(CarController.getAll())
    res.send(carsJson)
})

// GET /cars/:id return the car with the id the user passes, eg: /car/52
app.get('/cars/:id', function(req, res) {
    var carJson = JSON.stringify(CarController.getById(req.params.id))
    res.send(carJson)
})

// POST /cars takes a car object and create a new car
app.post('/cars', jsonParser, function(req, res) {
    if(!req.body) return res.sendStatus(400)
    validateBody(carSchema)
    CarController.create(req.body)
    res.sendStatus(200)
})

// PATCH /cars updates a car
app.patch('/cars/:id', jsonParser, function(req, res) {
    if(!req.body) return res.sendStatus(400)
    req.body.uuid = req.params.id
    CarController.update(req.body)
    res.sendStatus(200)
})

// GET /trips return all the trips
app.get('/trips', function(req, res) {
    var carJson = JSON.stringify(TripsController.getAll())
    res.send(carJson)
})

// POST /trips creates a new trip
app.post('/trips', jsonParser, function(req, res) {
    if(!req.body) return res.sendStatus(400)
    validateBody(coordinateSchema)
    TripsController.create(req.body)
    res.sendStatus(200)
})

app.listen(8080, () => console.log('HackLift app listening on port 8080'))