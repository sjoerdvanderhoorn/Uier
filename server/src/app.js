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

var Test = require("../models/test");

app.get('/tests', (req, res) => {
  Test.find({}, 'name purpose url steps', function (error, tests) {
	  if (error) { console.error(error); }
	  res.send({
			tests: tests
		})
	}).sort({_id:-1})
})

app.post('/add_test', (req, res) => {
	var db = req.db;
	var name = req.body.name;
	var purpose = req.body.purpose;
	var url = req.body.url;
	var steps = req.body.steps;
	var new_test = new Test({
		name: name,
		purpose: purpose,
		url: url,
		steps: steps
	})

	new_test.save(function (error) {
		if (error) {
			console.log(error)
		}
		res.send({
			success: true
		})
	})
})

app.put('/tests/:id', (req, res) => {
	var db = req.db;
	Test.findById(req.params.id, 'name purpose url steps', function (error, test) {
	  if (error) { console.error(error); }

	  test.name = req.body.name
	  test.purpose = req.body.purpose
	  test.url = req.body.url
	  test.steps = req.body.steps
	  test.save(function (error) {
			if (error) {
				console.log(error)
			}
			res.send({
				success: true
			})
		})
	})
})

app.delete('/tests/:id', (req, res) => {
	var db = req.db;
	Test.remove({
		_id: req.params.id
	}, function(err, test){
		if (err)
			res.send(err)
		res.send({
			success: true
		})
	})
})

app.get('/test/:id', (req, res) => {
	var db = req.db;
	Test.findById(req.params.id, 'name purpose url steps', function (error, test) {
	  if (error) { console.error(error); }
	  res.send(test)
	})
})

app.listen(process.env.PORT || 8081)
