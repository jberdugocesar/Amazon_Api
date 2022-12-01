import app from '../../index';
import request from 'supertest';

//Simplemente crea un objeto por cada clase para propositos de prueba

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


    const user_obj = body.user;
    user_id = user_obj._id;
    let response = await request(app).post(`/users/login/${user_id}`);
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

    const new_user = {
        username: 'El reviewer',
        birthdate: "2022-04-23T18:25:43.511Z",
        email: "ReviewManIto@hotmail.com",
        password: "123456"
    };

    ({ status, _body: body } = await request(app)
        .post('/users/register/').send(new_user));

    let new_user_obj = body.user;
    let new_user_id = body.user._id;

    response = await request(app).post(`/users/login/${new_user_id}`);
    let new_token = response.body.token;


    const review = {
        author: new_user_id,
        body: "Esta es mi primera review en otro producto",
        product: product_id,
        rating: 3
    };

    ({ status, _body: body } = await request(app)
        .post('/reviews/').send(review).set('Authorization', `Bearer ${new_token}`));

    review_id = body.review._id;


    return { user_obj, user_id, category_id, product_id, review_id, cart_id, token, new_user_obj, new_user_id, new_token };

}

export { ForTestOnly };