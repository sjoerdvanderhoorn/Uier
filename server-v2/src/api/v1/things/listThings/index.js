const {
  name,
  version,
  description
} = require('../../../../../package.json')
const ping = (req, res) => {
  res.json({
    name,
    description,
    version,
    uptime: process.uptime()
  })
}
module.exports = ping