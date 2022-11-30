import app from '../index';
import request from 'supertest';
import mongoose from "mongoose";

describe("Cart Route Test", () => {

    let random_user_id = "0008f05879466791c294f652";
    let random_product_id = "1118f05879461191c294f652"
    let cart_id;

    beforeEach(async () => {

        await mongoose.connect(global.__MONGO_URI__);
    })

    afterEach(async () => {
        await mongoose.connection.close()
    })

    test('/get failure', async () => {
        const { status, _body: body } = await request(app).get(`/carts/XD`)

        expect(status).toBe(400)
        expect(body).toStrictEqual({ error: "Invalid user_id" });
    });


    test('/post without product', async () => {

        const { status, _body: body } = await request(app)
            .post(`/carts/${random_user_id}`);

        expect(status).toBe(400);
        expect(body).toStrictEqual({ error: "Missing query product_id" });
    })

    test('/add product to cart', async () => {

        const { status, _body: body } = await request(app)
            .post(`/carts/${random_user_id}?product_id=${random_product_id}`);

        expect(status).toBe(200);
        cart_id = body.cart._id;
    })



    test('/get cart with one product', async () => {
        const { status, _body: body } = await request(app).get(`/carts/${random_user_id}`);

        expect(status).toBe(200);
        expect(body.cart._id).toBe(cart_id);
        expect(body.cart.products).toHaveLength(1);
    });
})