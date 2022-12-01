import app from '../../index';
import request from 'supertest';
const Category = require('../../models/Category');
//Simplemente crea un objeto por cada clase para propositos de prueba
//Puede mejorar la logica, pero  este ambiente de pruebas funciona.

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

    let new_category = {
        name: 'categoria bien nueva y buena',
    };

    ({ status, _body: body } = await request(app)
        .post('/categories/').send(new_category).set('Authorization', `Bearer ${token}`));

    const new_category_id = body.category._id;

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
        body: "Esta es mi primera review en otro producto con 5",
        product: product_id,
        rating: 3
    };

    const new_review = {
        author: new_user_id,
        body: "Esta es mi primera review en otro producto con 1",
        product: product_id,
        rating: 1
    };


    ({ status, _body: body } = await request(app)
        .post('/reviews/').send(review).set('Authorization', `Bearer ${token}`));

    ({ status, _body: body } = await request(app)
        .post('/reviews/').send(new_review).set('Authorization', `Bearer ${token}`));

    ({ status, _body: body } = await request(app)
        .post('/reviews/').send(new_review).set('Authorization', `Bearer ${token}`));

    review_id = body.review._id;

    const newproduct = {
        name: 'producto nuevo de otro usuario',
        price: "12.34",
        //recordar este cambio estaba en category_id
        category: new_category_id,
        //recordar este cambio estaba en user_id
        seller: new_user_id,
        status: "On sell"
    };

    ({ status, _body: body } = await request(app)
        .post('/products/').send(newproduct).set('Authorization', `Bearer ${token}`));

    ({ status, _body: body } = await request(app)
        .post('/products/').send(newproduct).set('Authorization', `Bearer ${token}`));

    ({ status, _body: body } = await request(app)
        .post('/products/').send(newproduct).set('Authorization', `Bearer ${token}`));

    const new_product_id = body.product._id;

    //new_category = await Category.findById(new_category_id);



    ({ status, _body: body } = await request(app)
        .post(`/carts/${new_user_id}?product_id=${new_product_id}`).set('Authorization', `Bearer ${new_token}`));


    return { user_obj, user_id, category_id, product_id, review_id, cart_id, token, new_user_obj, new_user_id, new_token, new_product_id, new_category_id, new_category };

}

export { ForTestOnly };