const assert = require('chai').assert
const createRequest = require('../index.js').createRequest
const testServer = require('./helpers/helpers')

describe('createRequest', () => {
  before(() => {
    testServer.startTestServer()
  })

  const jobID = '278c97ffadb54a5bbb93cfec5f7b5503'

  context('when specifying a coin and market', () => {
    const req = {
      id: jobID,
      data: {
        url: 'http://localhost:8080/success',
        endpoint: 'pricemulti',
        coin: 'BTC',
        market: 'EUR'
      }
    }

    it('returns data to the node', (done) => {
      createRequest(req, (statusCode, data) => {
        assert.equal(statusCode, 200)
        assert.equal(data.jobRunID, jobID)
        assert.isNotEmpty(data.data)
        done()
      })
    })
  })

  context('when using default parameters', () => {
    const req = {
      id: jobID,
      data: {
        url: 'http://localhost:8080/success'
      }
    }

    it('returns data to the node', (done) => {
      createRequest(req, (statusCode, data) => {
        assert.equal(statusCode, 200)
        assert.equal(data.jobRunID, jobID)
        assert.isNotEmpty(data.data)
        done()
      })
    })
  })

  context('when the endpoint fails once', () => {
    const req = {
      id: jobID,
      data: {
        url: 'http://localhost:8080/failsOnce'
      }
    }

    it('returns data to the node', (done) => {
      createRequest(req, (statusCode, data) => {
        assert.equal(statusCode, 200)
        assert.equal(data.jobRunID, jobID)
        assert.isNotEmpty(data.data)
        done()
      })
    })
  })

  context('when the endpoint always fails', () => {
    const req = {
      id: jobID,
      data: {
        url: 'http://localhost:8080/alwaysFails'
      }
    }

    it('returns an error to the node', (done) => {
      createRequest(req, (statusCode, data) => {
        assert.equal(statusCode, 500)
        assert.equal(data.status, 'errored')
        done()
      })
    })
  })

  context('when the error is in a successful response', () => {
    const req = {
      id: jobID,
      data: {
        url: 'http://localhost:8080/errorInBody'
      }
    }

    it('returns an error to the node', (done) => {
      createRequest(req, (statusCode, data) => {
        assert.equal(statusCode, 200)
        assert.equal(data.status, 'errored')
        done()
      })
    })
  })

  context('when the endpiont 404s', () => {
    const req = {
      id: jobID,
      data: {
        url: 'http://localhost:8080/404'
      }
    }

    it('returns an error to the node', (done) => {
      createRequest(req, (statusCode, data) => {
        assert.equal(statusCode, 404)
        assert.equal(data.status, 'errored')
        done()
      })
    })
  })

  context('when the endpiont 404s only once', () => {
    const req = {
      id: jobID,
      data: {
        url: 'http://localhost:8080/404sOnce'
      }
    }

    it('returns data to the node', (done) => {
      createRequest(req, (statusCode, data) => {
        assert.equal(statusCode, 200)
        assert.equal(data.jobRunID, jobID)
        assert.isNotEmpty(data.data)
        done()
      })
    })
  })

  after(() => {
    testServer.stopTestServer()
  })
})
