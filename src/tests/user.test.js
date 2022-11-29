import app from '../index';
import request from 'supertest';
import mongoose from "mongoose";
import User from "../models/User";

describe("User Route Test", () => {

    let user_id;
    let userslength = 0
    beforeAll(async () => {

        mongoose.connect(global.__MONGO_URI__);
        userslength = await User.countDocuments();
    })

    afterAll(() => {
        mongoose.connection.close()
    })

    test('/get', async () => {
        const { status, _body: body } = await request(app).get('/users/')

        expect(status).toBe(200)
        expect(body.users).toHaveLength(userslength)
    });

    test('/post', async () => {
        const user = {
            username: 'Jorge prueba',
            birthdate: "2022-04-23T18:25:43.511Z",
            email: "Broxd@hotmail.com",
            password: "123456"
        }
        const { status, _body: body } = await request(app)
            .post('/users/').send(user)

        expect(status).toBe(200)
        expect(body.user.username).toBe('Jorge prueba')
        user_id = body._id;
    })

    test('/get', async () => {
        const { status, _body: body } = await request(app)
            .get('/users/')
            .send({ _id: user_id })


        expect(status).toBe(200)
        expect(body._id).toBe(user_id)
    })

    test('/', async () => {
        const { status, _body: body } = await request(app).get('/users/')

        expect(status).toBe(200)
        expect(body.users).toHaveLength(userslength + 1)
    });
})
