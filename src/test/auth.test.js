const request = require('supertest')
const app = require('../app')

describe('Auth Router Tests', () => {

    it('POST /api/auth/register', async () => {

        const mockUser = {
            first_name: 'Tomás',
            last_name: 'Bosso',
            email: 'test@test.com',
            password: '123456'
        }

        const response = await request(app)
            .post('/api/auth/register')
            .send(mockUser)

        expect(response.statusCode).toBeDefined()
    })

})