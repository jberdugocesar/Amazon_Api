const router = require('express').Router();
const protect = require('../middlewares/auth');

const {
  changeProductCategory, removeProductInCategory, getCategory, createCategory, updateCategory, deleteCategory
} = require('../controllers/category');

router.post('/product/', changeProductCategory);
router.delete('/product/', removeProductInCategory);

router.get('/:category_id', getCategory);
//Autenticación
router.post('/', protect, createCategory);
router.put('/:category_id', protect, updateCategory);
router.delete('/:category_id', protect, deleteCategory);

module.exports = router;
