const settings = require('../../settings');
const Knex = require('knex');
const morgan = require('morgan');
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');
const promiseRouter = require('express-promise-router');
const knexConfig = require('../knexfile');
const registerApi = require('./api');
const { Model } = require('objection');

// Initialize knex.
const knex = Knex(knexConfig.development);

// Bind all Models to a knex instance. If you only have one database in
// your server this is all you have to do. For multi database systems, see
// the Model.bindKnex method.
Model.knex(knex);

const router = promiseRouter()
  .use(cors({
    origin: settings.shared.client_url,
    allowedHeaders: ['Set-Cookie', 'Cookie', 'Content-Type', 'Authorization', 'Access-Control-Allow-Credentials', 'Access-Control-Allow-Origin', 'Host', 'Origin', 'Referer'],
    credentials: true,
  }))

const app = express()
  .use(bodyParser.json({ limit: "50mb", extended: true })) // Extend to avoid "PayloadTooLargeError" and ensure screenshots can be saved
  .use(morgan('dev'))
  .use(session({
    name: "uier",
    secret: settings.shared.server_session_secret,
    resave: true,
    saveUninitialized: false,
    // store: new FileStore(), //https://github.com/valery-barysok/session-file-store/blob/master/examples/express-example/app.js
  }))
  .use(router)
  .set('json spaces', 2)

// Register our REST API.
registerApi(router);

// Error handling. The `ValidationError` instances thrown by objection.js have a `statusCode`
// property that is sent as the status code of the response.
//
// NOTE: This is not a good error handler, this is the simplest one. See the error handing
//       recipe for a better handler: http://vincit.github.io/objection.js/#error-handling
app.use((err, req, res, next) => {
  if (err) {
    res.status(err.statusCode || err.status || 500).send(err.data || err.message || {});
  } else {
    next();
  }
});

const server = app.listen(settings.shared.server_port, () => {
  console.log('Example app listening at port %s', server.address().port);
});