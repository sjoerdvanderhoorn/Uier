module.exports = (req, res, next) => {
	console.log("isAllowed?", req.get('authorization'))
  if (req.get('authorization') === 'LET THE RIGHT ONE IN') {
    return next()
  }
  return res.status(401).end()
}