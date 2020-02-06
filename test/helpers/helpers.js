const express = require('express')
const app = express()
const port = process.env.PORT || 8080

const successPayload = {
  EUR: 10,
  USD: 8,
  error: ''
}
const errorPayload = {
  error: 'there was a problem'
}

let failCount = 0

const startTestServer = () => {
  app.get('/success', (req, res) => {
    res.status(200).json(successPayload)
  })

  app.get('/failsOnce', (req, res) => {
    if (failCount > 0) {
      res.status(200).json(successPayload)
    } else {
      res.status(500).send()
    }
    failCount++
  })

  app.get('/alwaysFails', (req, res) => {
    res.status(500).send()
  })

  app.get('/errorInBody', (req, res) => {
    res.status(200).json(errorPayload)
  })

  app.get('/404', (req, res) => {
    res.status(404).json(errorPayload)
  })

  app.get('/404sOnce', (req, res) => {
    if (failCount > 0) {
      res.status(200).json(successPayload)
    } else {
      res.status(404).send()
    }
    failCount++
  })

  app.listen(port)
}

const stopTestServer = () => {
  process.exit()
}

exports.startTestServer = startTestServer
exports.stopTestServer = stopTestServer
