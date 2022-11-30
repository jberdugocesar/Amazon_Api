import app from '../index';
import request from 'supertest';
import mongoose from "mongoose";

const { ForTestOnly } = require('../tests/utils/utils');
describe("User Get Test", () => {

    let user_id;

    beforeEach(async () => {

        await mongoose.connect(global.__MONGO_URI__);

        ({ user_id } = await ForTestOnly())
    })

    afterEach(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    })


    test('/get request failure', async () => {
        const { status, _body: body } = await request(app)
            .get('/users/BadRequestWithThisString')

        expect(status).toBe(400)
    });

    test('/get request success', async () => {
        console.log(user_id);
        const { status, _body: body } = await request(app)
            .get(`/users/${user_id}`);

        expect(status).toBe(200)
    })

    test('/get method success', async () => {
        const { status, _body: body } = await request(app)
            .get(`/users/${user_id}`);

        expect(status).toBe(200)
        expect(body.user._id).toBe(user_id);
    })

    test('/get method failure', async () => {
        const { status, _body: body } = await request(app)
            .get(`/users/000000000000000000000000`);

        expect(status).toBe(500)
        expect(body).toStrictEqual({ error: "User not found" });
    })
})

describe("User Post Test ", () => {

    beforeEach(async () => {
        await mongoose.connect(global.__MONGO_URI__);
    })

    afterEach(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    })

    test('/post request failure', async () => {
        const user = {
            username: 'soy nueva prueba',
            birthdate: "2015-04-23T18:25:43.511Z",
            email: "NuevoUsuariod@hotmail.com",
        }
        const { status, _body: body } = await request(app)
            .post('/users/register').send(user)

        expect(status).toBe(400)
    })

    test('/post request success', async () => {
        const user = {
            username: 'soy nueva prueba',
            birthdate: "2015-04-23T18:25:43.511Z",
            email: "NuevoUsuariod@hotmail.com",
            password: "123456789"
        }
        const { status, _body: body } = await request(app)
            .post('/users/register').send(user)

        expect(status).toBe(200)
    })


    test('/post method success', async () => {
        const user = {
            username: 'soy nueva prueba',
            birthdate: "2015-04-23T18:25:43.511Z",
            email: "NuevoUsuariod@hotmail.com",
            password: "123456789"
        }
        const { status, _body: body } = await request(app)
            .post('/users/register/').send(user)

        expect(status).toBe(200);
        expect(body.user).toHaveProperty('_id');
    })

    test('/post method failure', async () => {
        const user = {
            username: 'soy nueva prueba',
            birthdate: "2015-04-23T18:25:43.511Z",
            email: "NuevoUsuariod@hotmail.com",
            password: "123456789"
        };
        let status, body;
        ({ status, _body: body } = await request(app)
            .post('/users/register/').send(user));

        ({ status, _body: body } = await request(app)
            .post('/users/register/').send(user));

        expect(status).toBe(400);
        expect(body).toStrictEqual({ "error": 'Email already in use' });
    })

})

describe("User Put Test", () => {

    let user_id, token;

    beforeEach(async () => {

        await mongoose.connect(global.__MONGO_URI__);

        ({ user_id, token } = await ForTestOnly())
    })

    afterEach(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    })

    test('/put request failure', async () => {
        const { status, _body: body } = await request(app)
            .put(`/users/BadRequestWithThisString`);

        expect(status).toBe(401)
    })

    test('/put request success', async () => {
        const userData = {
            username: 'soy un update user',
            birthdate: "2019-04-23T18:25:43.511Z",
            email: "nuevoUser@hotmail.com",
            password: "123456789"
        }
        const { status, _body: body } = await request(app)
            .put(`/users/${user_id}`).send(userData).set('Authorization', `Bearer ${token}`);

        expect(status).toBe(200)
    })

    test('/put method success', async () => {
        const userData = {
            username: 'soy un update user',
            birthdate: "2019-04-23T18:25:43.511Z",
            email: "nuevoUser@hotmail.com",
            password: "123456789"
        }
        const { status, _body: body } = await request(app)
            .put(`/users/${user_id}`).send(userData).set('Authorization', `Bearer ${token}`);

        expect(status).toBe(200)
        expect(body.user.username).toBe("soy un update user");
    })

    test('/put method failure', async () => {
        const userData = {
            username: 'soy un update user',
            birthdate: "2019-04-23T18:25:43.511Z",
            email: "nuevoUser@hotmail.com",
            password: "123456789",
            xd: "nuevo dato que no puedo introducir"
        }
        const { status, _body: body } = await request(app)
            .put(`/users/000000000000000000000000`).send(userData).set('Authorization', `Bearer ${token}`);


        expect(status).toBe(500)
        expect(body).toStrictEqual({ error: "User not found" });

    })
})

describe("User Delete Test", () => {

    let user_id, token;

    beforeEach(async () => {

        await mongoose.connect(global.__MONGO_URI__);

        ({ user_id, token } = await ForTestOnly())
    })

    afterEach(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();

    })

    test('/delete request failure', async () => {
        const { status, _body: body } = await request(app)
            .delete(`/users/BadRequestWithThisString`);

        expect(status).toBe(401)
    })

    test('/delete request success', async () => {

        const { status, _body: body } = await request(app)
            .delete(`/users/${user_id}`).set('Authorization', `Bearer ${token}`);

        expect(status).toBe(200)
    })

    test('/delete method success', async () => {

        const { status, _body: body } = await request(app)
            .delete(`/users/${user_id}`).set('Authorization', `Bearer ${token}`);


        expect(status).toBe(200)
        expect(body.user._id).toBe(user_id);
    })

    test('/delete method failure', async () => {

        const { status, _body: body } = await request(app)
            .delete(`/users/000000000000000000000000`).set('Authorization', `Bearer ${token}`);


        expect(status).toBe(500)
        expect(body).toStrictEqual({ error: "User not found" });

    })
})

