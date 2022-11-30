const router = require('express').Router();
const protect = require('../middlewares/auth');

const {
  getProductReviews, getUserReviews, getReview, createReview, deleteReview
} = require('../controllers/review');

router.get('/user/:user_id', getUserReviews);
router.get('/product/:product_id', getProductReviews);

router.get('/:review_id', getReview)
//Requires Authentication
router.post('/', protect, createReview);
router.delete('/:review_id', protect, deleteReview);

module.exports = router;
