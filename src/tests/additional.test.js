import app from '../index';
import request from 'supertest';
import mongoose from "mongoose";

const { ForTestOnly } = require('../tests/utils/utils');
describe("Additional Tests", () => {

    let new_user_id, new_token, product_id, category_id, new_category_id, new_category;

    beforeAll(async () => {
        await mongoose.connect(global.__MONGO_URI__);
        ({ product_id, new_user_id, new_token, category_id, new_category_id, new_category } = await ForTestOnly());
    })

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close()
    })

    test('/Get reseña de un usuario de cierta puntuacion', async () => {
        const { status, _body: body } = await request(app)
            .get(`/reviews/user/${new_user_id}?rating=1`)

        expect(status).toBe(200)
        expect(body.reviews).toHaveLength(2);
    });

    test('/Get reseña de un producto de cierta puntuacion', async () => {
        const { status, _body: body } = await request(app)
            .get(`/reviews/product/${product_id}?rating=3`)

        expect(status).toBe(200)
        expect(body.reviews).toHaveLength(1);
    });

    test('/Get productos de un usuario de cierta categoria', async () => {
        const { status, _body: body } = await request(app)
            .get(`/products/user/${new_user_id}?category_id=${new_category_id}`)

        expect(status).toBe(200)
        expect(body.products).toHaveLength(3);
    });

    test('/Get productos segun nombre de cierta categoria', async () => {
        const { status, _body: body } = await request(app)
            .get(`/products/user/${new_user_id}?category_name=${new_category.name}`);

        expect(status).toBe(200)
        expect(body.products).toHaveLength(3);
    });






})
