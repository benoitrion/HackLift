/* eslint-disable linebreak-style */
import express from 'express';
import bodyParser from 'body-parser';
import {CarController} from './controllers/cars'
import {TripsController} from './controllers/trips'
import {validateBody} from './middlewares/schemaMiddleware'
import {carSchema} from './schemas/cars'
import {coordinateSchema} from './schemas/coordinate'
import {authMiddleware} from './middlewares/authMiddleware'
import {requestLogger} from './middlewares/requestsLogger'

/**
 * This is rather empty ....
 */

// create express app
var app = express()
var server = require('http').Server(app)
var io = require('socket.io')(server)

io.on('connection', function (socket) {
    var cars = setInterval(function() {
        var cars = CarController.getAll()
        socket.broadcast.emit('cars', cars)
    }, 1000);
    var trips = setInterval(function() {
        var trips = TripsController.getAll()
        socket.broadcast.emit('trips', trips)
    }, 5000);
})

// create application/json parser
var jsonParser = bodyParser.json()

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html')
})

// GET /hello gets hello world
app.get('/hello', authMiddleware, requestLogger, (req, res) => res.send('Hello, world'))

// GET /hello gets hello world
app.post('/hello', authMiddleware, requestLogger, jsonParser, function (req, res) {
    if(!req.body) return res.sendStatus(400)
    res.send('Hello, '+ req.body.username)
})

// GET /cars return all the cars
app.get('/cars', requestLogger, function(req, res) {
    res.sendFile(__dirname + '/public/cars.html')
})

// GET /cars/:id return the car with the id the user passes, eg: /car/52
app.get('/cars/:id', authMiddleware, requestLogger, function(req, res) {
    var carJson = JSON.stringify(CarController.getById(req.params.id))
    res.send(carJson)
})

// POST /cars takes a car object and create a new car
app.post('/cars', jsonParser, authMiddleware, requestLogger, function(req, res) {
    if(!req.body) return res.sendStatus(400)
    validateBody(carSchema)
    CarController.create(req.body)
    res.sendStatus(200)
})

// PATCH /cars updates a car
app.patch('/cars/:id', jsonParser, authMiddleware, requestLogger, function(req, res) {
    if(!req.body) return res.sendStatus(400)
    req.body.uuid = req.params.id
    CarController.update(req.body)
    res.sendStatus(200)
})

// GET /trips return all the trips
app.get('/trips', requestLogger, function(req, res) {
    res.sendFile(__dirname + '/public/trips.html')
})

// POST /trips creates a new trip
app.post('/trips', jsonParser, authMiddleware, requestLogger, function(req, res) {
    if(!req.body) return res.sendStatus(400)
    validateBody(coordinateSchema)
    TripsController.create(req.body)
    res.sendStatus(200)
})

server.listen(8080, () => console.log('HackLift app listening on port 8080'))