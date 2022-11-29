const router = require('express').Router();
const {
  changeProductCategory, removeProductInCategory, getCategory, createCategory, updateCategory, deleteCategory
} = require('../controllers/category');

router.get('/:category_id', getCategory);
router.put('/:category_id', updateCategory);
router.post('/', createCategory);
router.post('/product/', changeProductCategory);
router.delete('/product/', removeProductInCategory);
router.delete('/:category_id', deleteCategory);

module.exports = router;
