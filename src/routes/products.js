const router = require('express').Router();
const protect = require('../middlewares/auth');

const {
  getAllProducts, getProduct, createProduct, updateProduct, deleteProduct, getUserProducts
} = require('../controllers/product');

router.get('/', getAllProducts);
router.get('/:product_id', getProduct);
router.get('/:user_id', getUserProducts);

//Requires Authentication
router.post('/', protect, createProduct);
router.put('/:product_id', protect, updateProduct);
router.delete('/:product_id', protect, deleteProduct);

module.exports = router;
