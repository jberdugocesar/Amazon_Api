const router = require('express').Router();
const {
  addProductInCart, removeProductInCart, getUserCart, removeAllProductsInUserCart: removeAllProductsInCart, PurchaseCart
} = require('../controllers/cart');

router.get('/:user_id', getUserCart);
router.post('/:user_id', addProductInCart);
router.delete('/:user_id', removeProductInCart);
router.delete('/all/:user_id', removeAllProductsInCart);
router.post('/purchase/:user_id', PurchaseCart);



module.exports = router;
