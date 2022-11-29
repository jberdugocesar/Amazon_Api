import app from '../index';
import request from 'supertest';
import mongoose from "mongoose";
import Category from "../models/Category";

describe("Category Route Test", () => {

    let user_id;
    let userslength = 0
    beforeAll(async () => {

        mongoose.connect(global.__MONGO_URI__);
        userslength = await Category.countDocuments();
    })

    afterAll(() => {
        mongoose.connection.close()
    })

    test('/get', async () => {
        const { status, _body: body } = await request(app).get('/categories/')

        expect(status).toBe(200)
        expect(body.users).toHaveLength(userslength)
    });

    test('/post', async () => {
        const category = {
            name: "Anime"
        }
        const { status, _body: body } = await request(app)
            .post('/categories/').send(category)

        expect(status).toBe(200)
        expect(body.category.name).toBe('Anime')
        user_id = body._id;
    })

    test('/get', async () => {
        const { status, _body: body } = await request(app)
            .get('/categories/')
            .send({ _id: user_id })


        expect(status).toBe(200)
        expect(body._id).toBe(user_id)
    })

    test('/', async () => {
        const { status, _body: body } = await request(app).get('/categories/')

        expect(status).toBe(200)
        expect(body.users).toHaveLength(userslength + 1)
    });
})
