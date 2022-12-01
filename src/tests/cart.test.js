import app from '../index';
import request from 'supertest';
import mongoose from "mongoose";

const { ForTestOnly } = require('../tests/utils/utils');
describe("Cart Get Test", () => {

    let new_user_id, new_token;

    beforeEach(async () => {
        await mongoose.connect(global.__MONGO_URI__);
        ({ new_user_id, new_token } = await ForTestOnly());
    })

    afterEach(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close()
    })

    test('/get request failure', async () => {
        const { status, _body: body } = await request(app).get(`/carts/BadString`)

        expect(status).toBe(401)
    });

    test('/get request sucess', async () => {
        const { status, _body: body } = await request(app).get(`/carts/${new_user_id}`).set('Authorization', `Bearer ${new_token}`);

        expect(status).toBe(200);
    });

    test('/get method sucess', async () => {
        const { status, _body: body } = await request(app).get(`/carts/${new_user_id}`).set('Authorization', `Bearer ${new_token}`);

        expect(status).toBe(200)
        expect(body.cart.user).toBe(new_user_id);
    });

    test('/get method failure', async () => {
        const { status, _body: body } = await request(app).get(`/carts/000000000000000000000000`).set('Authorization', `Bearer ${new_token}`);

        expect(status).toBe(500)
        expect(body).toStrictEqual({ error: "User not found" });
    });

})

describe("Cart /post Add Product Test", () => {

    let new_user_id, product_id, new_token;

    beforeEach(async () => {
        await mongoose.connect(global.__MONGO_URI__);
        ({ new_user_id, product_id, new_token } = await ForTestOnly());
    })

    afterEach(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close()
    })

    test('/post add product request failure', async () => {

        const { status, _body: body } = await request(app)
            .post(`/carts/${new_user_id}`);

        expect(status).toBe(401);
    })

    test('/post add product request success', async () => {

        const { status, _body: body } = await request(app)
            .post(`/carts/${new_user_id}?product_id=${product_id}`).set('Authorization', `Bearer ${new_token}`);
        expect(status).toBe(200);
    })

    test('/post add product method success', async () => {

        const { status, _body: body } = await request(app)
            .post(`/carts/${new_user_id}?product_id=${product_id}`).set('Authorization', `Bearer ${new_token}`);

        expect(status).toBe(200);
        expect(body.cart.products).toHaveLength(2);

    })

    test('/post add product method failure', async () => {

        const { status, _body: body } = await request(app)
            .post(`/carts/${new_user_id}?product_id=${product_id}`).set('Authorization', `Bearer ${new_token}`);

        expect(status).toBe(200);
        expect(body.cart.products).toHaveLength(2);

    })

})

describe("Cart /delete Remove Product Test", () => {

    let new_user_id, new_product_id, new_token;

    beforeEach(async () => {
        await mongoose.connect(global.__MONGO_URI__);
        ({ new_user_id, new_product_id, new_token } = await ForTestOnly());
    })

    afterEach(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close()
    })

    test('/delete remove product request failure', async () => {

        const { status, _body: body } = await request(app)
            .delete(`/carts/${new_user_id}`);

        expect(status).toBe(401);
    })

    test('/post remove product request success', async () => {

        const { status, _body: body } = await request(app)
            .delete(`/carts/${new_user_id}?product_id=${new_product_id}`).set('Authorization', `Bearer ${new_token}`);
        expect(status).toBe(200);
    })

    test('/post remove product method success', async () => {

        const { status, _body: body } = await request(app)
            .delete(`/carts/${new_user_id}?product_id=${new_product_id}`).set('Authorization', `Bearer ${new_token}`);

        expect(status).toBe(200);
        expect(body.cart.products).toHaveLength(0);

    })

    test('/post remove product method failure', async () => {

        const { status, _body: body } = await request(app)
            .delete(`/carts/${new_user_id}?product_id=${new_product_id}`).set('Authorization', `Bearer ${new_token}`);

        expect(status).toBe(200);
        expect(body.cart.products).toHaveLength(0);

    })

})