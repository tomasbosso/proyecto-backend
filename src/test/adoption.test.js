const request = require('supertest')
const app = require('../app')

describe('Adoption Router Tests', () => {

    it('GET /api/adoptions', async () => {

        const response = await request(app)
            .get('/api/adoptions')

        expect(response.statusCode).toBeDefined()
    })

})