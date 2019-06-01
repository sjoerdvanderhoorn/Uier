const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json({ limit: "10mb", extended: true })); // Extend to avoid "PayloadTooLargeError" and ensure screenshots can be saved
app.use(cors());

const mongodb_conn_module = require('./mongodbConnModule');
var db = mongodb_conn_module.connect();


// --- TEST ---

var Test = require("../models/test");

app.get('/test', (req, res) => {
    Test.find({}, 'name purpose urlDomain urlPath created updated steps.name', function(error, data) {
        if (error) { console.error(error); }
        res.send(data);
    }).sort({ _id: -1 })
})
app.post('/test', (req, res) => {
    var record = new Test({
        name: req.body.name,
        purpose: req.body.purpose,
        urlDomain: req.body.urlDomain,
        urlPath: req.body.urlPath,
        steps: req.body.steps,
        created: new Date()
    })
    record.save(function(error) {
        if (error) {
            console.log(error)
        }
        res.send({
            success: true,
            _id: record._id
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
            record.urlDomain = req.body.urlDomain;
            record.urlPath = req.body.urlPath;
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
    Run.deleteMany({
        test: req.params.id
    }, function(err, test) {
        if (err) {
            res.send(err);
        } else {
            Test.remove({
                _id: req.params.id
            }, function(err, test) {
                if (err)
                    res.send(err)
                res.send({
                    success: true
                })
            })
        }
    });
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
    Run.find({}, 'created status start end urlDomain test', function(error, data) {
        if (error) { console.error(error); }
        res.send(data);
    }).populate('test', 'name purpose urlPath').sort({ _id: -1 })
})
app.post('/run', (req, res) => {
    var record = new Run({
        test: req.body.test,
        status: req.body.status,
        urlDomain: req.body.urlDomain,
        steps: req.body.steps,
        created: new Date()
    })
    record.save(function(error) {
        if (error) {
            console.log(error)
        }
        res.send({
            success: true,
            _id: record._id
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
            record.urlDomain = req.body.urlDomain;
            record.steps = req.body.steps;
            record.status = req.body.status;
            record.start = req.body.start;
            record.end = req.body.end;
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
    }).populate('test', '')
})
app.get('/run_first', (req, res) => {
    Run.findOne({ status: "new" }, '', function(error, data) {
        if (error) { console.error(error); }
        res.send(data);
    }).sort({ created: 1 }).populate('test', '')
})



// --- COLLECTION ---

var Collection = require("../models/collection");

app.get('/collection', (req, res) => {
    Collection.find({}, 'name description created updated tests.test', function(error, data) {
        if (error) { console.error(error); }
        res.send(data);
    }).sort({ _id: -1 })
})
app.post('/collection', (req, res) => {
    var record = new Collection({
        name: req.body.name,
        description: req.body.description,
        created: new Date()
    })
    record.save(function(error) {
        if (error) {
            console.log(error)
        }
        res.send({
            success: true,
            _id: record._id
        })
    })
})
app.put('/collection/:id', (req, res) => {
    var db = req.db;
    Collection.findById(req.params.id, function(error, record) {
        if (error) { console.error(error); }
        if (record) {
            record.name = req.body.name;
            record.description = req.body.description;
            record.tests = req.body.tests;
            record.updated = new Date();
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
app.delete('/collection/:id', (req, res) => {
    var db = req.db;
    Collection.remove({
        _id: req.params.id
    }, function(err, collection) {
        if (err)
            res.send(err)
        res.send({
            success: true
        })
    })
})
app.get('/collection/:id', (req, res) => {
    var db = req.db;
    Collection.findById(req.params.id, function(error, collection) {
        if (error) { console.error(error); }
        res.send(collection)
    }).populate('tests.test', '')
})


app.listen(process.env.PORT || 8081);