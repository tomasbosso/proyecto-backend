const request = require('supertest')
const app = require('../app')

describe('Products Router Tests', () => {

    jest.setTimeout(10000)

    it('GET /', async () => {

        const response = await request(app)
            .get('/')

        expect(response.statusCode).toBe(200)
    })

})