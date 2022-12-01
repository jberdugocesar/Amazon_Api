import app from '../index';
import request from 'supertest';
import mongoose from "mongoose";



describe("Additional Tests", () => {


    beforeAll(async () => {

        await mongoose.connect(global.__MONGO_URI__);
    })

    afterAll(async () => {
        await mongoose.connection.close()
    })

    test('/get reviews of user with certain rating', async () => {


        const { status, _body: body } = await request(app)
            .get(`/reviews/${user_id}?rating={}`)


        expect(status).toBe(200)
        expect(body.reviews).toBe({ rating: 5 });
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
