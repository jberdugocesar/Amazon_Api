import app from '../index';
import request from 'supertest';
import mongoose from "mongoose";

const { ForTestOnly } = require('../tests/utils/utils');
describe("Review Get Test", () => {

    let review_id, new_token;

    beforeEach(async () => {

        await mongoose.connect(global.__MONGO_URI__);

        ({ review_id, new_token } = await ForTestOnly())
    })

    afterEach(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    })

    test('/get request failure', async () => {
        const { status, _body: body } = await request(app)
            .get(`/reviews/BadRequestWithThisString`);

        expect(status).toBe(400)
    })

    test('/get request success', async () => {
        const { status, _body: body } = await request(app)
            .get(`/reviews/${review_id}`).set('Authorization', `Bearer ${new_token}`);

        expect(status).toBe(200)
    })

    test('/get method success', async () => {
        const { status, _body: body } = await request(app)
            .get(`/reviews/${review_id}`).set('Authorization', `Bearer ${new_token}`);;

        expect(status).toBe(200)
        expect(body.review._id).toBe(review_id);
    })

    test('/get method failure', async () => {
        const { status, _body: body } = await request(app)
            .get(`/reviews/000000000000000000000000`).set('Authorization', `Bearer ${new_token}`);;

        expect(status).toBe(500)
        expect(body).toStrictEqual({ error: "Review not found" })
    })
})
describe("Review Post Test", () => {

    let product_id, new_user_id, new_token;


    beforeEach(async () => {

        await mongoose.connect(global.__MONGO_URI__);

        ({ product_id, new_user_id, new_token } = await ForTestOnly())
    })

    afterEach(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    })


    test('/post request failure', async () => {
        const review = {
            author: new_user_id,
            body: "muy bueno el producto",
            product: product_id,
            rating: 5
        }
        const { status, _body: body } = await request(app)
            .post('/reviews/');

        expect(status).toBe(401)
    })

    test('/post request success', async () => {
        const review = {
            author: new_user_id,
            body: "muy bueno el producto del otro usuario",
            product: product_id,
            rating: 5
        }
        const { status, _body: body } = await request(app)
            .post('/reviews/').send(review).set('Authorization', `Bearer ${new_token}`)

        expect(status).toBe(200)
    })

    test('/post method success ', async () => {
        const review = {
            author: new_user_id,
            body: "muy bueno el producto del otro usuario",
            product: product_id,
            rating: 1
        }
        const { status, _body: body } = await request(app)
            .post('/reviews/').send(review).set('Authorization', `Bearer ${new_token}`)

        expect(status).toBe(200)
        expect(body.review.author).toBe(new_user_id);
    })

    test('/post method failure', async () => {
        const review = {
            author: "000000000000000000000000",
            body: "On sell",
            product: "000000000000000000000000",
            rating: 1
        }
        const { status, _body: body } = await request(app)
            .post('/reviews/').send(review).set('Authorization', `Bearer ${new_token}`);
        expect(status).toBe(500)
        expect(body).toStrictEqual({ error: "User or product not found" });
    })

})
describe("Review Delete Test", () => {

    let review_id, new_token;

    beforeEach(async () => {

        await mongoose.connect(global.__MONGO_URI__);

        ({ review_id, new_token } = await ForTestOnly())
    })

    afterEach(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();

    })

    test('/delete request failure', async () => {
        const { status, _body: body } = await request(app)
            .delete(`/reviews/BadRequestWithThisString`);

        expect(status).toBe(401)
    })

    test('/delete request success', async () => {

        const { status, _body: body } = await request(app)
            .delete(`/reviews/${review_id}`).set('Authorization', `Bearer ${new_token}`);

        expect(status).toBe(200)
    })

    test('/delete method success', async () => {

        const { status, _body: body } = await request(app)
            .delete(`/reviews/${review_id}`).set('Authorization', `Bearer ${new_token}`);


        expect(status).toBe(200)
        expect(body.review._id).toBe(review_id);
    })

    test('/delete method failure', async () => {

        const { status, _body: body } = await request(app)
            .delete(`/reviews/000000000000000000000000`).set('Authorization', `Bearer ${new_token}`);


        expect(status).toBe(500)
        expect(body).toStrictEqual({ error: "Review not found" });

    })
})

