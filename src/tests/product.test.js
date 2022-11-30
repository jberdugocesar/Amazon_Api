import app from '../index';
import request from 'supertest';
import mongoose from "mongoose";

describe("Product Route Test", () => {

    let product_id;

    beforeEach(async () => {

        await mongoose.connect(global.__MONGO_URI__);

    })

    afterEach(async () => {
        await mongoose.connection.close()
    })

    test('/get', async () => {
        const { status, _body: body } = await request(app).get('/products/')

        expect(status).toBe(200)
        expect(body.products).toHaveLength(0)
    });


    test('/post', async () => {
        const product = {
            name: 'producto final',
            price: "50.23",
            amount: "23",
            category: "6388d8898e38ab9cd2f4d900",
            seller: "6388d88f5c146fb51b70b860",
            status: "On sell",
        }
        const { status, _body: body } = await request(app)
            .post('/products/').send(product)

        expect(status).toBe(200)
        expect(body.product.name).toBe('producto final')
        product_id = body._id;
    })

    test('/get', async () => {
        const { status, _body: body } = await request(app)
            .get('/products/')
            .send({ _id: product_id })


        expect(status).toBe(200)
        expect(body._id).toBe(product_id)
    })

    test('/get after Post product', async () => {
        const { status, _body: body } = await request(app).get('/products/')

        expect(status).toBe(200)
        expect(body.products).toHaveLength(1)
    });
})
