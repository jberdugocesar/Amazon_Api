const Product = require('../models/Product');
const User = require('../models/User');
const Category = require('../models/Category');
const Review = require("../models/Review");


async function getAllProducts(req, res) {

  const { category_id, name } = req.query;
  try {
    let products;


    if (category_id != undefined && name == undefined) {
      const dataCategory = await Category.findById(category_id);
      products = await Promise.all(dataCategory.products.map(async product => await Product.findById(product)));
    }

    if (name != undefined && category_id == undefined) products = await Promise.all(await Product.find({ "name": { $regex: name, $options: 'i' } }));

    if (category_id && name) return res.status(500).json({ error: 'only supports one query at a time' });

    if (category_id == undefined && name == undefined) products = await Product.find();

    if (products.length == 0) return res.status(500).json({ error: 'There are not products' });

    res.json({ products });
  } catch (error) {
    res.status(400).json({ error: 'Invalid category_id' });
  }

}

async function getProduct(req, res) {
  const { product_id } = req.params;
  if (!product_id) return res.status(400).json({ error: 'Missing product_id' });

  try {
    const product = await Product.findById(product_id);
    if (product == undefined) return res.status(500).json({ error: 'Product not found' });

    res.json({ product });
  } catch (error) {
    res.status(400).json({ error: 'Invalid product_id' });
  }

}


async function createProduct(req, res) {
  const { name, price, seller, status, category } = req.body;

  if (!name || !price || !seller || !status || !category) return res.status(400).json({ error: 'Missing product data' });

  try {

    const dataUser = await User.findById(seller);
    const dataCategory = await Category.findById(category);

    if (dataUser == undefined || dataCategory == undefined) return res.status(500).json({ error: "User or category not found" })

    const product = await Product.create({ name, price, seller, status, category });

    await Category.findByIdAndUpdate(category, { $push: { 'products': product } });
    await User.findByIdAndUpdate(seller, { $push: { 'productsOnSell': product } });

    res.json({ product });
  } catch (error) {
    res.status(400).json({ error: 'Invalid product data' });
  }
}

async function updateProduct(req, res) {
  const { product_id } = req.params;
  const { name, price, rating, seller, category, status } = req.body;
  if (!product_id) return res.status(400).json({ error: 'Missing product_id' });
  if (!name && !price && !rating && !seller && !category && !status) return res.status(400).json({ error: 'Missing product data' });

  try {
    const product = await Product.findById(product_id);

    if (product == undefined) return res.status(500).json({ error: 'Product not found' });

    const data = {
      name: name || product.name,
      price: price || product.price,
      rating: rating || product.rating,
      seller: seller || product.seller,
      category: category || product.category,
      status: status || product.status
    }

    const dataUser = await User.findById(data.seller);
    const dataCategory = await Category.findById(data.category);

    if (dataUser == undefined || dataCategory == undefined) return res.status(500).json({ error: "User or category not found" })

    const newProduct = await Product.findByIdAndUpdate(product_id, data, { new: true });
    res.json({ product: newProduct });
  } catch (error) {
    res.status(400).json({ error: 'Invalid product_id or data' });
  }
}

async function deleteProduct(req, res) {
  const { product_id } = req.params;
  if (!product_id) return res.status(400).json({ error: 'Missing product_id' });

  try {
    const product = await Product.findById(product_id);

    if (product == undefined) return res.status(500).json({ error: 'Product not found' });

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
  const { user_id } = req.params;

  const { category_name, category_id } = req.query;

  if (!user_id) return res.status(400).json({ error: 'Missing user_id' });

  try {
    const user = await User.findById(user_id);
    if (user == undefined) return res.status(500).json({ error: 'User not found' });

    let products;

    if (category_id && category_name) return res.status(500).json({ error: 'only supports one query at a time' });

    if (category_id != undefined && category_name == undefined)
      products = await Promise.all(user.productsOnSell.map(async product => await Product.findById(product).where({ category: category_id })));

    if (category_name != undefined && category_id == undefined) {
      //Lista de categorias que tengan un nombre parecido del query
      const list_category = await Category.find({ "name": { $regex: category_name, $options: 'i' } });

      products = await Promise.all(list_category.map(async dataCategory => await Promise.all(user.productsOnSell.map(async product => await Product.findById(product).where({ category: dataCategory._id })))));
      products = products.flat();
    }

    if (category_id == undefined && category_name == undefined)
      products = await Promise.all(user.productsOnSell.map(async product => await Product.findById(product)));


    products = products.filter(product => product != undefined);

    if (products.length == 0) return res.status(500).json({ error: 'There are not products' });

    res.json({ products });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Invalid user_id' });
  }
}



module.exports = { getAllProducts, getProduct, createProduct, updateProduct, deleteProduct, getUserProducts }
