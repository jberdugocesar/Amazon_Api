import app from '../index';
import request from 'supertest';
import mongoose from "mongoose";

describe("User Post Test", () => {

    let new_user_id;
    beforeEach(async () => {
        await mongoose.connect(global.__MONGO_URI__);
    })

    afterEach(async () => {
        await mongoose.connection.close()
    })

    test('/get without users', async () => {
        const { status, _body: body } = await request(app).get('/users/')

        expect(status).toBe(200)
        expect(body.users).toHaveLength(0)
    });

    test('/post an user', async () => {
        const user = {
            username: 'solo existo yo',
            birthdate: "2022-04-23T18:25:43.511Z",
            email: "nuevo@hotmail.com",
            password: "123456"
        }
        const { status, _body: body } = await request(app)
            .post('/users/register/').send(user)

        expect(status).toBe(200)
        expect(body.user.username).toBe('solo existo yo')
        new_user_id = body.user._id;
    })

    test('/get the user created before', async () => {
        const { status, _body: body } = await request(app)
            .get(`/users/${new_user_id}`);


        expect(status).toBe(200)
        expect(body.user._id).toBe(new_user_id)
    })

})
