import app from '../../index';
import request from 'supertest';

//Simplemente crea un objeto por cada tipo para propositos de prueba

async function ForTestOnly() {
    let status, body, token;

    let user_id, category_id, product_id, review_id, cart_id;

    const user = {
        username: 'Jorge prueba',
        birthdate: "2022-04-23T18:25:43.511Z",
        email: "Broxd@hotmail.com",
        password: "123456"
    };


    ({ status, _body: body } = await request(app)
        .post('/users/register').send(user));


    user_id = body.user;
    console.log(`es real ${user_id}`);
    const response = await request(app).post(`/users/login/${user_id._id}`);
    token = response.body.token;

    const category = {
        name: 'category prueba',
    };

    ({ status, _body: body } = await request(app)
        .post('/categories/').send(category).set('Authorization', `Bearer ${token}`));

    category_id = body.category._id;

    const product = {
        name: 'producto final prueba',
        price: "12.34",
        category: category_id,
        seller: user_id,
        status: "On sell"
    };

    ({ status, _body: body } = await request(app)
        .post('/products/').send(product).set('Authorization', `Bearer ${token}`));

    product_id = body.product._id;

    return { user_id, category_id, product_id, review_id, cart_id, token };

}

export { ForTestOnly };