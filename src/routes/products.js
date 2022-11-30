const router = require('express').Router();
const protect = require('../middlewares/auth');

const {
  getAllProducts, getProduct, createProduct, updateProduct, deleteProduct, getUserProducts, getProductByName, getProductByCategory
} = require('../controllers/product');

router.get('/', getAllProducts);
router.get('/:product_id', getProduct);
router.get('/:user_id', getUserProducts);
router.get('/:product_name', getProductByName);
router.get('/:category_id', getProductByCategory);

router.post('/', protect, createProduct);
router.put('/:product_id', protect, updateProduct);
router.delete('/:product_id', protect, deleteProduct);

module.exports = router;
