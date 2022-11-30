import app from '../index';
import request from 'supertest';
import mongoose from "mongoose";

describe("Category Route Test", () => {

    let category_id;

    beforeEach(async () => {

        await mongoose.connect(global.__MONGO_URI__);
    })

    afterEach(async () => {
        await mongoose.connection.close()
    })

    test('/get', async () => {
        const { status, _body: body } = await request(app)
            .get('/categories')


        expect(status).toBe(404)
        expect(body).toStrictEqual({ "error": "Not found" });
    });

    test('/post', async () => {
        const category = {
            name: "Random Category"
        }
        const { status, _body: body } = await request(app)
            .post('/categories/').send(category)

        expect(status).toBe(200)
        expect(body.category.name).toBe('Random Category')
        category_id = body.category._id;
    })

    test('/get category after post', async () => {
        const { status, _body: body } = await request(app)
            .get(`/categories/${category_id}`)


        expect(status).toBe(200)
        expect(body.category._id).toBe(category_id)
    })

})
