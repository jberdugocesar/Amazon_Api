const User = require('../models/User');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Purchase = require('../models/Purchase');

async function addProductInCart(req, res) {
  const { user_id } = req.params;
  const { product_id } = req.query;

  if (!user_id) return res.status(400).json({ error: 'Missing user_id' });
  if (!product_id) return res.status(400).json({ error: 'Missing query product_id' });

  try {

    let cart = undefined;
    await Cart.findOne({ user: user_id }) ?? await Cart.create({ user: user_id });

    cart = await Cart.findOne({ user: user_id });

    if (cart == undefined) return res.status(400).json({ error: 'User got no cart' });

    if (cart.products.find(product => product == product_id) != undefined) return res.status(400).json({ error: 'User already has this product in cart' });

    await User.findByIdAndUpdate(user_id, { cart: cart._id });

    cart = await Cart.findByIdAndUpdate(cart._id, { $push: { 'products': product_id } });
    res.json({ cart });

  } catch (error) {
    res.status(400).json({ error: 'Invalid user_id or product_id' });
  }

}

async function removeProductInCart(req, res) {

  const { user_id } = req.params;
  const { product_id, removeAll } = req.query;
  if (!user_id) return res.status(400).json({ error: 'Missing user_id' });
  if (!product_id) return res.status(400).json({ error: 'Missing query: product_id' });

  try {

    let cart = undefined;
    await Cart.findOne({ user: user_id }) ?? await Cart.create({ user: user_id });
    cart = await Cart.findOne({ user: user_id });

    if (cart == undefined) return res.status(400).json({ error: 'User got no cart' });

    if (cart.products.length == 0) return res.status(400).json({ error: 'the cart is already empty' });

    if (cart.products.find(product => product == product_id) == undefined) return res.status(400).json({ error: 'This product is not in the cart' });

    await User.findByIdAndUpdate(user_id, { cart: cart._id });
    cart = await Cart.findByIdAndUpdate(cart._id, { $pull: { 'products': product_id } });

    res.json({ cart });
  } catch (error) {
    res.status(400).json({ error: 'Invalid user_id or product_id' });
  }

}

async function getUserCart(req, res) {
  const { user_id } = req.params;
  if (!user_id) return res.status(400).json({ error: 'Missing user_id' });

  try {
    let cart = await Cart.findOne({ user: user_id });

    if (cart == undefined) return res.status(400).json({ error: 'User got no cart' });

    res.json({ cart });
  } catch (error) {
    res.status(400).json({ error: 'Invalid user_id' });
  }

}


async function removeAllProductsInUserCart(req, res) {
  const { user_id } = req.params;

  if (!user_id) return res.status(400).json({ error: 'Missing user_id' });

  try {

    let cart = undefined;
    await Cart.findOne({ user: user_id }) ?? await Cart.create({ user: user_id });

    cart = await Cart.findOne({ user: user_id });

    if (cart == undefined) return res.status(400).json({ error: 'User got no cart' });

    if (cart.products.length == 0) return res.status(400).json({ error: 'the cart is already empty' });

    await User.findByIdAndUpdate(user_id, { cart: cart._id });
    cart = await Cart.findByIdAndUpdate(cart._id, { $set: { 'products': [] } });

    res.json({ cart });
  } catch (error) {
    res.status(400).json({ error: 'Invalid user_id' });
  }
}

async function PurchaseCart(req, res) {
  const { user_id } = req.params;
  if (!user_id) return res.status(400).json({ error: 'Missing user_id' });

  try {

    let cart = undefined;
    await Cart.findOne({ user: user_id }) ?? await Cart.create({ user: user_id });

    cart = await Cart.findOne({ user: user_id });

    if (cart == undefined) return res.status(400).json({ error: 'User got no cart' });
    await User.findByIdAndUpdate(user_id, { cart: cart._id });

    if (cart.products.length == 0) return res.status(400).json({ error: 'the cart is empty' });

    let cartProducts = [];
    let totalPrice = 0;
    await Promise.all(cart.products.map(async (product) => cartProducts.push(await Product.findById(product))));

    await Promise.all(cartProducts.map(product => totalPrice += product.price));

    const purchase = await Purchase.create({ products: cart.products, purchaseDate: Date.now(), totalPrice: totalPrice.toFixed(2) });
    await Cart.findByIdAndUpdate(cart._id, { $set: { 'products': [] } });

    await User.findByIdAndUpdate(user_id, { $push: { 'purchases': purchase } });

    res.json({ purchase });

  } catch (error) {
    res.status(400).json({ error: 'Invalid user_id' });
  }
}

async function getUserPurchaseHistory(req, res) {

  const { user_id } = req.params;
  if (!user_id) return res.status(400).json({ error: 'Missing user_id' });

  try {
    const user = await User.findById(user_id);

    return res.json({ purchases: user.purchases });
  } catch {
    res.status(400).json({ error: 'Invalid user_id' });
  }

}

module.exports = { addProductInCart, removeProductInCart, getUserCart, removeAllProductsInUserCart, PurchaseCart, getUserPurchaseHistory }
