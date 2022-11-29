const router = require('express').Router();
const {
  addProductInCategory, removeProductInCategory, getCategory, createCategory, updateCategory, deleteCategory
} = require('../controllers/category');

router.get('/:category_id', getCategory);
router.put('/:category_id', updateCategory);
router.post('/', createCategory);
router.post('/product/', addProductInCategory);
router.delete('/product/', removeProductInCategory);
router.delete('/:category_id', deleteCategory);

module.exports = router;
