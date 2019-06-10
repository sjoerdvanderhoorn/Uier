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
    Test.find({}, 'name purpose browser urlDomain urlPath created updated steps.name', function(error, data) {
        if (error) { console.error(error); }
        res.send(data);
    }).sort({ _id: -1 })
})
app.post('/test', (req, res) => {
    var record = new Test({
        name: req.body.name,
        purpose: req.body.purpose,
        browser: req.body.browser,
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
            record.browser = req.body.browser;
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
    // Remove all runs
    Run.deleteMany({
        test: req.params.id
    }, function(err, test) {
        if (err) {
            res.send(err);
        } else {
            // Remove from all collections
            Collection.updateMany({ "tests.test": req.params.id }, { updated: new Date(), $pull: { tests: { test: req.params.id } } }, function(err, test) {
                if (err) {
                    res.send(err);
                } else {
                    // Remove actual test
                    Test.remove({
                        _id: req.params.id
                    }, function(err, test) {
                        if (err) {
                            res.send(err)
                        }
                        res.send({
                            success: true
                        })
                    })
                }
            })

        }
    });
})
app.get('/test/:id', (req, res) => {
    Test.findById(req.params.id, function(error, test) {
        if (error) { console.error(error); }
        res.send(test)
    })
})
app.post('/test/:id/run', (req, res) => {
    Test.findById(req.params.id, function(error, test) {
        if (error) {
            console.error(error);
        }
        Run.insertMany([{
            test: req.params.id,
            status: "new",
            browser: (req.body.browser ? req.body.browser : test.browser),
            urlDomain: (req.body.urlDomain ? req.body.urlDomain : test.urlDomain),
            steps: test.steps,
            created: new Date()
        }], function(error, test) {
            if (error) {
                console.error(error);
            }
            res.send(test)
        })
    })
})


// --- RUN ---

var Run = require("../models/run");

app.get('/run', (req, res) => {
    Run.find({}, 'created status start end browser urlDomain test', function(error, data) {
        if (error) { console.error(error); }
        res.send(data);
    }).populate('test', 'name purpose urlPath').sort({ _id: -1 })
})
app.post('/run', (req, res) => {
    var record = new Run({
        test: req.body.test,
        status: req.body.status,
        browser: req.body.browser,
        urlDomain: req.body.urlDomain,
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
            record.browser = req.body.browser;
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
    Collection.findById(req.params.id, async function(error, collection) {
        if (error) { console.error(error); }
        // Loop through collection tests and find latest run result for each test
        for (var i = 0; i < collection.tests.length; i++) {
            // await Run.findOne({ $query: { test: collection.tests[i].test, browser: collection.tests[i].browser, urlDomain: collection.tests[i].urlDomain }, $orderby: { created: -1 } }, async function(error, run) {
            Run.find()
            await Run.find({ test: collection.tests[i].test, browser: collection.tests[i].browser, urlDomain: collection.tests[i].urlDomain }, {}, { sort: { created: -1 }, limit: 1 }, async function(error, run) {
                console.log(run[0].status)
                collection.tests[i].status = await run[0].status;
                collection.tests[i].run = await run[0]._id;
            });
        }
        res.send(collection);
    })
})
app.post('/collection/:id/run', (req, res) => {
    Collection.findById(req.params.id, function(error, collection) {
        if (error) { console.error(error); }
        // Loop through all tests to create runs
        var runs = [];
        for (var i = 0; i < collection.tests.length; i++) {
            runs.push({
                test: collection.tests[i].test,
                status: "new",
                browser: collection.tests[i].browser,
                urlDomain: collection.tests[i].urlDomain,
                created: new Date()
            })
        }
        // Insert Run record for each test
        Run.insertMany(runs, function(error, test) {
            if (error) {
                console.error(error);
            }
            res.send(test)
        })

    })
})

app.listen(process.env.PORT || 8081);