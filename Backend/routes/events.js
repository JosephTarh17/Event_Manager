const mongoose = require('mongoose')
const express = require('express')
const Event = require('../models/Event')

const router = express.Router()

// GET /api/events returns all event documents, sorted by date.
router.get('/', async (req, res, next) => {
  try {
    const events = await Event.find().sort({ date: 1 })
    res.json(events)
  } catch (error) {
    next(error)
  }
})

// POST /api/events validates and saves one event document.
router.post('/', async (req, res, next) => {
  try {
    const event = await Event.create(req.body)
    res.status(201).json(event)
  } catch (error) {
    next(error)
  }
})
router.get('/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid event ID.' })
    }

    const event = await Event.findById(req.params.id)
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' })
    }

    return res.json(event)
  } catch (error) {
    return next(error)
  }
})
router.put('/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid event ID.' })
    }

    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!event) {
      return res.status(404).json({ message: 'Event not found.' })
    }

    return res.json(event)
  } catch (error) {
    return next(error)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid event ID.' })
    }

    const event = await Event.findByIdAndDelete(req.params.id)
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' })
    }

    return res.status(204).end()
  } catch (error) {
    return next(error)
  }
})
module.exports = router