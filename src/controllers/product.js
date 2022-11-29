const Product = require('../models/Product');
const User = require('../models/User');
const Category = require('../models/Category');
const Review = require("../models/Review");

async function getAllProducts(_, res) {

  try {
    const products = await Product.find();
    res.json({ products });
  } catch (error) {
    res.status(500).json({ error: 'Error getting products' });
  }

}

async function getProduct(req, res) {
  const { product_id } = req.params;
  if (!product_id) return res.status(400).json({ error: 'Missing product_id' });

  try {
    const product = await Product.findById(product_id);
    res.json({ product });
  } catch (error) {
    res.status(500).json({ error: 'Invalid product_id' });
  }

}


async function createProduct(req, res) {
  const { name, price, amount, seller, status, category } = req.body;

  if (!name || !price || !amount || !seller || !status || !category) return res.status(400).json({ error: 'Missing product data' });

  try {
    const product = await Product.create({ name, price, amount, seller, status, category });

    await Category.findByIdAndUpdate(category, { $push: { 'products': product } });
    await User.findByIdAndUpdate(seller, { $push: { 'productsOnSell': product } });

    res.json({ product });
  } catch (error) {
    res.status(500).json({ error: 'Invalid product data' });
  }
}

async function updateProduct(req, res) {
  const { product_id } = req.params;
  const { name, price, rating, amount, seller, category } = req.body;
  if (!product_id) return res.status(400).json({ error: 'Missing product_id' });
  if (!name && !price && !rating && !amount && !seller && !category) return res.status(400).json({ error: 'Missing product data' });

  try {
    const product = await Product.findById(product_id);
    const data = {
      name: name || product.name,
      price: price || product.price,
      rating: rating || product.rating,
      amount: amount || product.amount,
      seller: seller || product.seller,
      category: category || product.category
    }
    const updatedUser = await User.findByIdAndUpdate(product_id, data, { new: true });
    res.json({ product: updatedUser });
  } catch (error) {
    res.status(500).json({ error: 'Invalid product_id or data' });
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
    res.status(500).json({ error: 'Invalid product_id' });
  }
}

async function getUserProducts(req, res) {
  const { user_id } = req.query;
  if (!user_id) return res.status(400).json({ error: 'Missing user_id' });

  try {
    const user = await User.findById(user_id);

    res.json({ products: user.productsOnSell });
  } catch (error) {
    res.status(500).json({ error: 'Invalid user_id' });
  }
}

async function getProductByName(req, res) {
  const { product_name } = req.query;
  if (!product_name) return res.status(400).json({ error: 'Missing query' });

  try {
    const products = await Product.find({ "name": { $regex: `${product_name}` } });

    res.json({ products });
  } catch (error) {
    res.status(500).json({ error: 'Invalid user_id' });
  }
}

async function getProductByCategory(req, res) {
  const { category_id } = req.params;

  if (!category_id) return res.status(400).json({ error: 'Missing category_id' });


  try {
    const category = Category.findById(category_id)

    res.json({ products: category.products });
  } catch (error) {
    res.status(500).json({ error: 'Invalid category_id' });
  }
}

module.exports = { getAllProducts, getProduct, createProduct, updateProduct, deleteProduct, getUserProducts, getProductByName, getProductByCategory }
