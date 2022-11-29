const router = require('express').Router();
const {
  addProductInCart, removeProductInCart, getUserCart, removeAllProductsInUserCart
} = require('../controllers/cart');

router.get('/user_id', getUserCart);
router.get('/:user_id', removeAllProductsInUserCart);
router.post('/:product_id', addProductInCart);
router.delete('/:user_id', removeProductInCart);


module.exports = router;
