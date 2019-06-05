// https://itnext.io/wiring-up-an-api-server-with-express-and-swagger-9bffe0a0d6bd

const makeApp = require('./makeApp')


makeApp()
  .then(app => app.listen(3000))
  .then(() => {
    console.log('Server started')
  })
  .catch(err => {
    console.error('caught error', err)
  })