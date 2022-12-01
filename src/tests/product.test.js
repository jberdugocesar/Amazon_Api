import app from '../index';
import request from 'supertest';
import mongoose from "mongoose";

const { ForTestOnly } = require('../tests/utils/utils');

describe("Product Get Test", () => {

    let product_id;

    beforeEach(async () => {

        await mongoose.connect(global.__MONGO_URI__);

        ({ product_id } = await ForTestOnly())
    })

    afterEach(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    })

    test('/get request failure', async () => {
        const { status, _body: body } = await request(app)
            .get(`/products/BadRequestWithThisString`);

        expect(status).toBe(400)
    })

    test('/get request success', async () => {
        const { status, _body: body } = await request(app)
            .get(`/products/${product_id}`);

        expect(status).toBe(200)
    })

    test('/get method success', async () => {
        const { status, _body: body } = await request(app)
            .get(`/products/${product_id}`);

        expect(status).toBe(200)
        expect(body.product._id).toBe(product_id);
    })

    test('/get method failure', async () => {
        const { status, _body: body } = await request(app)
            .get(`/products/000000000000000000000000`);

        expect(status).toBe(500)

    })
})
describe("Product Post Test", () => {

    let user_id, category_id, token;


    beforeEach(async () => {

        await mongoose.connect(global.__MONGO_URI__);

        ({ user_id, category_id, token } = await ForTestOnly())
    })

    afterEach(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    })


    test('/post request failure', async () => {
        const product = {
            name: 'otro producto no de prueba definitivo',
            price: "50.23",
            status: "On sell",
        }
        const { status, _body: body } = await request(app)
            .post('/products/').send(product)

        expect(status).toBe(401)
    })

    test('/post request success', async () => {
        const product = {
            name: 'otro producto no de prueba definitivo',
            price: "50.23",
            category: category_id,
            seller: user_id,
            status: "On sell",
        }
        const { status, _body: body } = await request(app)
            .post('/products/').send(product).set('Authorization', `Bearer ${token}`);

        expect(status).toBe(200)
    })

    test('/post method success ', async () => {
        const product = {
            name: 'otro producto no de prueba definitivo',
            price: "50.23",
            category: category_id,
            seller: user_id,
            status: "On sell",
        }
        const { status, _body: body } = await request(app)
            .post('/products/').send(product).set('Authorization', `Bearer ${token}`);

        expect(status).toBe(200)
        expect(body.product.name).toBe('otro producto no de prueba definitivo')
    })

    test('/post method failure', async () => {
        const product = {
            name: 'otro producto no de prueba definitivo',
            price: "50.23",
            category: "000000000000000000000000",
            seller: "000000000000000000000000",
            status: "On sell",
        }
        const { status, _body: body } = await request(app)
            .post('/products/').send(product).set('Authorization', `Bearer ${token}`);
        expect(status).toBe(500)
        expect(body).toStrictEqual({ error: "User or category not founded" });
    })

})

describe("Product Put Test", () => {

    let product_id, user_id, category_id, token;

    beforeEach(async () => {

        await mongoose.connect(global.__MONGO_URI__);

        ({ product_id, user_id, category_id, token } = await ForTestOnly())
    })

    afterEach(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    })

    test('/put request failure', async () => {
        const { status, _body: body } = await request(app)
            .put(`/products/BadRequestWithThisString`);

        expect(status).toBe(401)
    })

    test('/put request success', async () => {
        const dataProduct = {
            name: 'soy bastante nuevo y genial',
            price: "12.32",
            category: category_id,
            seller: user_id,
            status: "On sell",
        }
        const { status, _body: body } = await request(app)
            .put(`/products/${product_id}`).send(dataProduct).set('Authorization', `Bearer ${token}`);

        expect(status).toBe(200)
    })

    test('/put method success', async () => {
        const dataProduct = {
            name: 'soy completamente nuevo',
            price: "12.34",
            category: category_id,
            seller: user_id,
            status: "Already Selled",
        }
        const { status, _body: body } = await request(app)
            .put(`/products/${product_id}`).send(dataProduct).set('Authorization', `Bearer ${token}`);


        expect(status).toBe(200)
        expect(body.product.status).toBe("Already Selled");
    })

    test('/put method failure', async () => {
        const dataProduct = {
            name: "falso"
        }
        const { status, _body: body } = await request(app)
            .put(`/products/000000000000000000000000`).send(dataProduct).set('Authorization', `Bearer ${token}`);


        expect(status).toBe(500)
        expect(body).toStrictEqual({ error: "Product not founded" });

    })
})

describe("Product Delete Test", () => {

    let product_id, user_id, category_id, token;

    beforeEach(async () => {

        await mongoose.connect(global.__MONGO_URI__);

        ({ product_id, user_id, category_id, token } = await ForTestOnly())
    })

    afterEach(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();

    })

    test('/delete request failure', async () => {
        const { status, _body: body } = await request(app)
            .delete(`/products/BadRequestWithThisString`);

        expect(status).toBe(401)
    })

    test('/delete request success', async () => {

        const { status, _body: body } = await request(app)
            .delete(`/products/${product_id}`).set('Authorization', `Bearer ${token}`);

        expect(status).toBe(200)
    })

    test('/delete method success', async () => {

        const { status, _body: body } = await request(app)
            .delete(`/products/${product_id}`).set('Authorization', `Bearer ${token}`);


        expect(status).toBe(200)
        expect(body.product._id).toBe(product_id);
    })

    test('/delete method failure', async () => {

        const { status, _body: body } = await request(app)
            .delete(`/products/000000000000000000000000`).set('Authorization', `Bearer ${token}`);


        expect(status).toBe(500)
        expect(body).toStrictEqual({ error: "Product not founded" });

    })
})

