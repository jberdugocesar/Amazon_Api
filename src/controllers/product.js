const Product = require('../models/Product');
const User = require('../models/User');
const Category = require('../models/Category');
const Review = require("../models/Review");


async function getAllProducts(req, res) {

  const { category, name } = req.query;
  try {
    let products;

    products = await Product.find();

    const dataCategory = await Category.findById(category);

    if (category != undefined && name == undefined) products = await Promise.all(dataCategory.products.map(async product => await Product.findById(product)));

    if (name != undefined && category == undefined) products = await Promise.all(await Product.find({ "name": { $regex: name, $options: 'i' } }));

    if (category && name) return res.status(400).json({ error: 'only supports one query at a time' });

    res.json({ products });
  } catch (error) {
    res.status(400).json({ error: 'Error getting products' });
  }

}

async function getProduct(req, res) {
  const { product_id } = req.params;
  if (!product_id) return res.status(400).json({ error: 'Missing product_id' });

  try {
    const product = await Product.findById(product_id);
    if (product == undefined) return res.status(400).json({ error: 'Product not founded' });

    res.json({ product });
  } catch (error) {
    res.status(400).json({ error: 'Invalid product_id' });
  }

}


async function createProduct(req, res) {
  const { name, price, seller, status, category } = req.body;

  if (!name || !price || !seller || !status || !category) return res.status(400).json({ error: 'Missing product data' });

  try {
    const product = await Product.create({ name, price, seller, status, category });

    const dataUser = await User.findById(seller);
    const dataCategory = await Category.findById(category);

    if (dataUser == undefined || dataCategory == undefined) return res.status(500).json({ error: "User or category not founded" })

    await Category.findByIdAndUpdate(category, { $push: { 'products': product } });
    await User.findByIdAndUpdate(seller, { $push: { 'productsOnSell': product } });

    res.json({ product });
  } catch (error) {
    res.status(400).json({ error: 'Invalid product data' });
  }
}

async function updateProduct(req, res) {
  const { product_id } = req.params;
  const { name, price, rating, seller, category } = req.body;
  if (!product_id) return res.status(400).json({ error: 'Missing product_id' });
  if (!name && !price && !rating && !seller && !category) return res.status(400).json({ error: 'Missing product data' });

  try {
    const product = await Product.findById(product_id);

    if (product == undefined) return res.status(500).json({ error: 'Product not founded' });

    const data = {
      name: name || product.name,
      price: price || product.price,
      rating: rating || product.rating,
      seller: seller || product.seller,
      category: category || product.category
    }

    const dataUser = await User.findById(data.seller);
    const dataCategory = await Category.findById(data.category);

    if (dataUser == undefined || dataCategory == undefined) return res.status(500).json({ error: "User or category not founded" })

    const newProduct = await Product.findByIdAndUpdate(product_id, data, { new: true });
    res.json({ newProduct });
  } catch (error) {
    res.status(400).json({ error: 'Invalid product_id or data' });
  }
}

async function deleteProduct(req, res) {
  const { product_id } = req.params;
  if (!product_id) return res.status(400).json({ error: 'Missing product_id' });

  try {
    const product = await Product.findById(product_id);
    const user = await User.findById(product.seller);
    user.productsOnSell = user.productsOnSell.filter(product => product != product_id);

    await User.findByIdAndUpdate(product.seller, user, { new: true })

    const category = await Category.findById(product.category);
    category.products = category.products.filter(product => product != product_id);

    await Category.findByIdAndUpdate(product.category, category, { new: true })

    product.reviews.map(async review => await Review.findByIdAndDelete(review));


    await Product.findByIdAndDelete(product_id);

    res.json({ product });
  } catch (error) {
    res.status(400).json({ error: 'Invalid product_id' });
  }
}

async function getUserProducts(req, res) {
  const { user_id } = req.params;
  if (!user_id) return res.status(400).json({ error: 'Missing user_id' });

  try {
    const user = await User.findById(user_id);
    if (user == undefined) return res.status(400).json({ error: 'User not founded' });

    res.json({ products: user.productsOnSell });
  } catch (error) {
    res.status(400).json({ error: 'Invalid user_id' });
  }
}



module.exports = { getAllProducts, getProduct, createProduct, updateProduct, deleteProduct, getUserProducts }
