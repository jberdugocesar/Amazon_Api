import app from '../index';
import request from 'supertest';
import mongoose from "mongoose";

describe("Review Route Test", () => {

    let review_id;

    beforeEach(async () => {

        await mongoose.connect(global.__MONGO_URI__);
    })

    afterEach(async () => {
        await mongoose.connection.close()
    })

    test('/post a Bad Request', async () => {
        const review = {
        };

        const { status, _body: body } = await request(app)
            .post('/reviews/').send(review)

        expect(status).toBe(401)
        expect(body).toStrictEqual({ error: "Missing review data" });
    })

    test('/post a Review', async () => {
        const review = {
            author: "63881141d936836a877ff954",
            body: "esta es mi poderosa review",
            product: "63881152d936836a877ff974",
            rating: 5
        };

        const { status, _body: body } = await request(app)
            .post('/reviews/').send(review)

        expect(status).toBe(200)
        expect(body.review.body).toBe("esta es mi poderosa review");
        review_id = body.review._id;
    })

    test('/get Review after post', async () => {
        const { status, _body: body } = await request(app)
            .get(`/reviews/${review_id}`)


        expect(status).toBe(200)
        expect(body.review._id).toBe(review_id)
    })

})
