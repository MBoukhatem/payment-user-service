const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const userRoutes = require('./routes/user.routes')

const app = express()
const PORT = process.env.PORT || 3002

app.use(helmet())
app.use(cors({ origin: true, credentials: true }))
app.use(express.json())

// Routes
app.use('/users', userRoutes)

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'user', timestamp: new Date().toISOString() })
})

// Error handler
app.use((err, _req, res, _next) => {
  console.error('User service error:', err)
  const status = err.status || 500
  res.status(status).json({ error: err.message || 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`User service running on http://localhost:${PORT}`)
})

module.exports = app
