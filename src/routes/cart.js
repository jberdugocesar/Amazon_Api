const router = require('express').Router();
const protect = require('../middlewares/auth');

const {
  addProductInCart, removeProductInCart, getUserCart, removeAllProductsInUserCart: removeAllProductsInCart, PurchaseCart, getUserPurchaseHistory
} = require('../controllers/cart');


//requires Authentication
router.get('/:user_id', protect, getUserCart);
router.get('/purchase/:user_id', protect, getUserPurchaseHistory);
router.post('/:user_id', protect, addProductInCart);
router.delete('/:user_id', protect, removeProductInCart);
router.delete('/all/:user_id', protect, removeAllProductsInCart);
router.post('/purchase/:user_id', protect, PurchaseCart);



module.exports = router;
