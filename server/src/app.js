const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

const mongodb_conn_module = require('./mongodbConnModule');
var db = mongodb_conn_module.connect();


// --- TEST ---

var Test = require("../models/test");

app.get('/test', (req, res) => {
    Test.find({}, 'name purpose url created updated', function(error, data) {
        if (error) { console.error(error); }
        res.send(data);
    }).sort({ _id: -1 })
})
app.post('/test', (req, res) => {
    var db = req.db;
    var name = req.body.name;
    var purpose = req.body.purpose;
    var url = req.body.url;
    var steps = req.body.steps;
    var record = new Test({
        name: name,
        purpose: purpose,
        url: url,
        steps: steps,
        created: new Date()
    })
    record.save(function(error) {
        if (error) {
            console.log(error)
        }
        res.send({
            success: true
        })
    })
})
app.put('/test/:id', (req, res) => {
    var db = req.db;
    Test.findById(req.params.id, function(error, record) {
        if (error) { console.error(error); }
        if (record) {
            record.name = req.body.name;
            record.purpose = req.body.purpose;
            record.url = req.body.url;
            record.steps = req.body.steps;
            record.updated = new Date()
            record.save(function(error) {
                if (error) {
                    console.log(error)
                }
                res.send({
                    success: true
                })
            })
        }
    })
})
app.delete('/test/:id', (req, res) => {
    var db = req.db;
    Test.remove({
        _id: req.params.id
    }, function(err, test) {
        if (err)
            res.send(err)
        res.send({
            success: true
        })
    })
})
app.get('/test/:id', (req, res) => {
    var db = req.db;
    Test.findById(req.params.id, function(error, test) {
        if (error) { console.error(error); }
        res.send(test)
    })
})


// --- RUN ---

var Run = require("../models/run");

app.get('/run', (req, res) => {
    Run.find({}, '', function(error, data) {
        if (error) { console.error(error); }
        res.send(data);
    }).populate('test', 'name').sort({ _id: -1 })
})
app.post('/run', (req, res) => {
    var db = req.db;
    var test = req.body.test;
    var status = req.body.status;
    var url = req.body.url;
    var steps = req.body.steps;
    var record = new Run({
        test: test,
        status: status,
        url: url,
        steps: steps,
        created: new Date()
    })
    record.save(function(error) {
        if (error) {
            console.log(error)
        }
        res.send({
            success: true
        })
    })
})
app.put('/run/:id', (req, res) => {
    var db = req.db;
    Run.findById(req.params.id, function(error, record) {
        if (error) { console.error(error); }
        if (record) {
            record.name = req.body.name;
            record.purpose = req.body.purpose;
            record.url = req.body.url;
            record.steps = req.body.steps;
            record.updated = new Date()
            record.save(function(error) {
                if (error) {
                    console.log(error)
                }
                res.send({
                    success: true
                })
            })
        }
    })
})
app.delete('/run/:id', (req, res) => {
    var db = req.db;
    Run.remove({
        _id: req.params.id
    }, function(err, run) {
        if (err)
            res.send(err)
        res.send({
            success: true
        })
    })
})
app.get('/run/:id', (req, res) => {
    var db = req.db;
    Run.findById(req.params.id, function(error, run) {
        if (error) { console.error(error); }
        res.send(run)
    })
})


app.listen(process.env.PORT || 8081);