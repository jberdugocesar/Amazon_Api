const router = require('express').Router();
const {
  getProductReviews, getUserReviews, getProductReviewsByRating, getReview, createReview, deleteReview
} = require('../controllers/review');

router.get('/:product_id', getProductReviews);
router.get('/:user_id', getUserReviews);
router.get('/:product_id', getProductReviewsByRating)
router.get('/:review_id', getReview)
router.post('/', createReview);
router.delete('/:review_id', deleteReview);

module.exports = router;
