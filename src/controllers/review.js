const Review = require('../models/Review');
const Product = require('../models/Product');
const User = require('../models/User');


async function getProductReviews(req, res) {
  const { product_id } = req.query;
  try {
    if (!product_id) return res.status(400).json({ error: 'Missing product_id' });
    const product = await Product.find(product_id);

    res.json({ productReviews: product.reviews });
  } catch (error) {
    res.status(500).json({ error: 'Error getting product reviews' });
  }
}

async function getUserReviews(req, res) {
  const { user_id } = req.query;
  if (!user_id) return res.status(400).json({ error: 'Missing user_id' });
  try {

    const user = User.findById(user_id);

    res.json({ userReviews: user.reviews });
  } catch (error) {
    res.status(500).json({ error: 'Error getting user reviews' });
  }
}

async function getProductReviewsByRating(req, res) {
  const { product_id, rating } = req.query;

  if (!product_id) return res.status(400).json({ error: 'Missing user_id' });
  if (!rating) return res.status(400).json({ error: 'Missing the query: rating' });

  try {
    const product = await Product.find(product_id);

    const filteredReviews = product.reviews.filter(product => product.rating == rating);

    res.json({ filteredReviews: filteredReviews });
  } catch (error) {
    res.status(500).json({ error: 'Error getting product reviews by rating' });
  }
}

async function getReview(req, res) {
  const { review_id } = req.params;
  if (!review_id) return res.status(400).json({ error: 'Missing review_id' });

  try {
    const review = await Review.findById(review_id);
    res.json({ review: review });
  } catch (error) {
    res.status(500).json({ error: 'Invalid review_id' });
  }
}

async function createReview(req, res) {
  const { author, body, product, rating } = req.body;
  if (!author || !body || !product, !rating) return res.status(400).json({ error: 'Missing review data' });

  try {
    const review = await Review.create({ author, body, product, rating });

    await User.findByIdAndUpdate(review.author, { $push: { 'reviews': review._id } })

    await Product.findByIdAndUpdate(review.product, { $push: { 'reviews': review._id } })


    res.json({ review });
  } catch (error) {
    res.status(500).json({ error });
  }
}


async function deleteReview(req, res) {
  const { review_id } = req.params;
  if (!review_id) return res.status(400).json({ error: 'Missing review_id' });

  try {
    const review = await Review.findByIdAndDelete(review_id);

    await User.findByIdAndUpdate(review.author, { $pull: { 'reviews': review_id } })

    await Product.findByIdAndUpdate(review.product, { $pull: { 'reviews': review_id } })

    await Review.findByIdAndDelete(review);

    res.json({ review });
  } catch (error) {
    res.status(500).json({ error: 'Invalid review_id' });
  }
}

module.exports = { getProductReviews, getUserReviews, getProductReviewsByRating, getReview, createReview, deleteReview };
