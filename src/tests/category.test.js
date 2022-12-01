import app from '../index';
import request from 'supertest';
import mongoose from "mongoose";

const { ForTestOnly } = require('../tests/utils/utils');

describe("Category Get Test", () => {

    let category_id, token;

    beforeEach(async () => {

        await mongoose.connect(global.__MONGO_URI__);

        ({ category_id, token } = await ForTestOnly())
    })

    afterEach(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    })


    test('/get request failure', async () => {
        const { status, _body: body } = await request(app)
            .get('/categories/BadRequestWithThisString')

        expect(status).toBe(400)
    });

    test('/get request success', async () => {
        const { status, _body: body } = await request(app)
            .get(`/categories/${category_id}`);

        expect(status).toBe(200)
    })

    test('/get method success', async () => {
        const { status, _body: body } = await request(app)
            .get(`/categories/${category_id}`);

        expect(status).toBe(200)
        expect(body.category._id).toBe(category_id);
    })

    test('/get method failure', async () => {
        const { status, _body: body } = await request(app)
            .get(`/categories/000000000000000000000000`);

        expect(status).toBe(500)
        expect(body).toStrictEqual({ error: "Category not found" });
    })
})

describe("Category Post Test ", () => {

    let category_id, token;

    beforeEach(async () => {
        await mongoose.connect(global.__MONGO_URI__);
        ({ category_id, token } = await ForTestOnly())
    })

    afterEach(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    })

    test('/post request failure', async () => {
        const category = {
            name: "Random Category"
        }
        const { status, _body: body } = await request(app)
            .post('/categories/').send(category)

        expect(status).toBe(401)
    })

    test('/post request success', async () => {
        const category = {
            name: "Random Category"
        }
        const { status, _body: body } = await request(app)
            .post('/categories/').send(category).set('Authorization', `Bearer ${token}`);

        expect(status).toBe(200)
    })


    test('/post method success', async () => {
        const category = {
            name: "Random Category"
        }
        const { status, _body: body } = await request(app)
            .post('/categories/').send(category).set('Authorization', `Bearer ${token}`);

        expect(status).toBe(200)
        expect(body.category.name).toBe('Random Category')
    })

    test('/post method failure ', async () => {
        const category = {
            name: "Random Category"
        }
        let { status, _body: body } = await request(app)
            .post('/categories/').send(category).set('Authorization', `Bearer ${token}`);

        ({ status, _body: body } = await request(app)
            .post('/categories/').send(category).set('Authorization', `Bearer ${token}`));

        expect(status).toBe(500)
        expect(body).toStrictEqual({ error: 'This category already exists' })
    })

})

describe("Category Put Test", () => {

    let category_id, token;

    beforeEach(async () => {

        await mongoose.connect(global.__MONGO_URI__);

        ({ category_id, token } = await ForTestOnly())
    })

    afterEach(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    })

    test('/put request failure', async () => {
        const { status, _body: body } = await request(app)
            .put(`/categories/BadRequestWithThisString`);

        expect(status).toBe(401)
    })

    test('/put request success', async () => {
        const dataProduct = {
            name: 'soy una nueva categoria',
        }
        const { status, _body: body } = await request(app)
            .put(`/categories/${category_id}`).send(dataProduct).set('Authorization', `Bearer ${token}`);

        expect(status).toBe(200)
    })

    test('/put method success', async () => {
        const dataProduct = {
            name: 'soy una nueva categoria',
        }
        const { status, _body: body } = await request(app)
            .put(`/categories/${category_id}`).send(dataProduct).set('Authorization', `Bearer ${token}`);

        expect(status).toBe(200)
        expect(body.category.name).toBe('soy una nueva categoria');
    })

    test('/put method failure', async () => {
        const dataProduct = {
            name: "falso"
        }
        const { status, _body: body } = await request(app)
            .put(`/categories/000000000000000000000000`).send(dataProduct).set('Authorization', `Bearer ${token}`);


        expect(status).toBe(500)
        expect(body).toStrictEqual({ error: "Category not found" });

    })
})

describe("Category Delete Test", () => {

    let category_id, token;

    beforeEach(async () => {

        await mongoose.connect(global.__MONGO_URI__);

        ({ category_id, token } = await ForTestOnly())
    })

    afterEach(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();

    })

    test('/delete request failure', async () => {
        const { status, _body: body } = await request(app)
            .delete(`/categories/BadRequestWithThisString`);

        expect(status).toBe(401)
    })

    test('/delete request success', async () => {

        const { status, _body: body } = await request(app)
            .delete(`/categories/${category_id}`).set('Authorization', `Bearer ${token}`);

        expect(status).toBe(200)
    })

    test('/delete method success', async () => {

        const { status, _body: body } = await request(app)
            .delete(`/categories/${category_id}`).set('Authorization', `Bearer ${token}`);


        expect(status).toBe(200)
        expect(body.category._id).toBe(category_id);
    })

    test('/delete method failure', async () => {

        const { status, _body: body } = await request(app)
            .delete(`/categories/000000000000000000000000`).set('Authorization', `Bearer ${token}`);


        expect(status).toBe(500)
        expect(body).toStrictEqual({ error: "Category not found" });

    })
})