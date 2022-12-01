const Review = require('../models/Review');
const Product = require('../models/Product');
const User = require('../models/User');


async function getProductReviews(req, res) {
  const { product_id } = req.params;
  const { rating } = req.query;
  if (!product_id) return res.status(400).json({ error: 'Missing product_id' });

  try {
    const product = await Product.findById(product_id);
    if (product == undefined) return res.status(500).json({ error: "Product not found" });

    let reviews;
    rating == undefined ?
      reviews = await Promise.all(product.reviews.map(async (review) => await Review.findById(review))) :
      reviews = await Promise.all(product.reviews.map(async (review) => await Review.findById(review).where({ rating: rating })));

    reviews = reviews.filter(review => review != undefined);

    res.json({ reviews });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 'Error getting product reviews' });
  }
}

async function getUserReviews(req, res) {
  const { user_id } = req.params;
  const { rating } = req.query;
  if (!user_id) return res.status(400).json({ error: 'Missing user_id' });
  try {

    const user = await User.findById(user_id);

    if (user == undefined) return res.status(500).json({ error: "User not found" });

    let reviews;

    rating == undefined ?
      reviews = await Promise.all(user.reviews.map(async (review) => await Review.findById(review))) :
      reviews = await Promise.all(user.reviews.map(async (review) => await Review.findById(review).where({ rating: rating })));

    reviews = reviews.filter(review => review != undefined);

    res.json({ reviews });
  } catch (error) {
    res.status(500).json({ error: 'Error getting user reviews' });
  }
}


async function getReview(req, res) {
  const { review_id } = req.params;
  if (!review_id) return res.status(400).json({ error: 'Missing review_id' });

  try {
    const review = await Review.findById(review_id);
    if (review == undefined) return res.status(500).json({ error: "Review not found" });
    res.json({ review });
  } catch (error) {
    res.status(400).json({ error: 'Invalid review_id' });
  }
}

async function createReview(req, res) {
  const { author, body, product, rating } = req.body;
  if (!author || !body || !product, !rating) return res.status(400).json({ error: 'Missing review data' });

  try {
    const review = await Review.create({ author, body, product, rating });

    const dataProduct = await Product.findById(product);

    const dataUser = await User.findById(author);

    if (dataUser == undefined || dataProduct == undefined) return res.status(500).json({ error: "User or product not found" })

    await User.findByIdAndUpdate(review.author, { $push: { 'reviews': review._id } })

    await Product.findByIdAndUpdate(review.product, { $push: { 'reviews': review._id } })


    res.json({ review });
  } catch (error) {
    res.status(400).json({ error: "Invalid user or product" });
  }
}


async function deleteReview(req, res) {
  const { review_id } = req.params;
  if (!review_id) return res.status(400).json({ error: 'Missing review_id' });

  try {
    const review = await Review.findById(review_id);

    if (review == undefined) return res.status(500).json({ error: "Review not found" });

    await User.findByIdAndUpdate(review.author, { $pull: { 'reviews': review_id } })

    await Product.findByIdAndUpdate(review.product, { $pull: { 'reviews': review_id } })

    await Review.findByIdAndDelete(review);

    res.json({ review });
  } catch (error) {
    res.status(400).json({ error: 'Invalid review_id' });
  }
}

module.exports = { getProductReviews, getUserReviews, getReview, createReview, deleteReview };
