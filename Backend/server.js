require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const eventsRouter = require('./routes/events')
const app = express()
app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())
app.use('/api/events', eventsRouter)

const PORT = process.env.PORT || 5000

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')

    app.listen(PORT, () => {
      console.log(`API listening at http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('Unable to connect to MongoDB:', error.message)
    process.exit(1)
  }
}
app.use((error, req, res, _next) => {
  if (error.name === 'ValidationError') {
    return res.status(400).json({ message: error.message })
  }

  console.error(error)
  return res.status(500).json({ message: 'Server error' })
})
app.get('/', (req, res) => {
  res.json({
    message: 'Event Planning API',
    endpoints: {
      health: '/api/health',
      events: '/api/events',
    },
  })
})
startServer()