const {
  name,
  version,
  description
} = require('../../package.json')
const things = (req, res) => {
  res.json({
    name,
    description,
    version,
    uptime: process.uptime()
  })
}
module.exports = things