const router = require('express').Router();
const protect = require('../middlewares/auth');

const {
  changeProductCategory, removeProductInCategory, getCategory, createCategory, updateCategory, deleteCategory
} = require('../controllers/category');

router.get('/:category_id', getCategory);
router.put('/:category_id', protect, updateCategory);
router.post('/', protect, createCategory);
router.post('/product/', changeProductCategory);
router.delete('/product/', removeProductInCategory);
router.delete('/:category_id', protect, deleteCategory);

module.exports = router;
