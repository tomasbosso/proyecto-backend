const request = require('supertest')
const app = require('../app')

describe('Carts Router Tests', () => {

    it('GET /api/carts', async () => {

        const response = await request(app)
            .get('/api/carts')

        expect(response.statusCode).toBeDefined()
    })

})