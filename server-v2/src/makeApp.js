const express = require('express')
const SwaggerParser = require('swagger-parser')
//const swaggerRoutes = require('swagger-routes-express')
const { connector } = require('swagger-routes-express')
const api = require('./api')
const isAllowed = require('./auth/isAllowed')

const makeApp = async () => {
  const parser = new SwaggerParser()
  const apiDescription = await parser.validate('my-api.yml')
  const connect = connector(api, apiDescription,
  {
	  security:
	  {
		  'identity.basic,identity.email': isAllowed
	  }
  })
  const app = express()
  // do any other app stuff,
  // such as wire in passport, use cors etc.
  // then connect the routes
  connect(app)
  // add any error handlers last
  return app
}
module.exports = makeApp