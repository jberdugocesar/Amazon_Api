import app from '../index';
import request from 'supertest';
import mongoose from "mongoose";
import Product from "../models/Product"

describe("Product Route Test", () => {

    let product_id;
    let product_user;
    let product_length;

    beforeAll(async () => {

        mongoose.connect(global.__MONGO_URI__);
        product_length = await Product.countDocuments();
    })

    afterAll(() => {
        mongoose.connection.close()
    })

    test('/get', async () => {
        const { status, _body: body } = await request(app).get('/products/')

        expect(status).toBe(200)
        expect(body.products).toHaveLength(product_length)
    });

    test('/post user', async () => {
        const user = {
            username: 'pruebaproducto',
            birthdate: "2022-04-23T18:25:43.511Z",
            email: "pruebaproducto@hotmail.com",
            password: "123456"
        }
        const { status, _body: body } = await request(app)
            .post('/users/').send(user)

        expect(status).toBe(200)
        expect(body.user.username).toBe('pruebaproducto')
        product_user = body;
    })

    test('/post', async () => {
        const product = {
            name: 'producto test',
            price: "50.23",
            amount: "23",
            password: "123456",
            seller: product_user,
            status: "On sell",
        }
        const { status, _body: body } = await request(app)
            .post('/products/').send(product)

        expect(status).toBe(200)
        expect(body.product.name).toBe('producto test')
        product_id = body._id;
    })

    test('/get', async () => {
        const { status, _body: body } = await request(app)
            .get('/products/')
            .send({ _id: product_id })


        expect(status).toBe(200)
        expect(body._id).toBe(product_id)
    })

    test('/', async () => {
        const { status, _body: body } = await request(app).get('/products/')

        expect(status).toBe(200)
        expect(body.products).toHaveLength(product_length + 1)
    });
})
