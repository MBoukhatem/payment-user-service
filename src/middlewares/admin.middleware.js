const requireAdmin = (req, res, next) => {
  const role = req.headers['x-user-role']
  if (role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' })
  }
  next()
}

module.exports = { requireAdmin }
