const router = require('express').Router();
const {
  getUser,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/user');

router.get('/', getAllUsers);
router.get('/:user_id', getUser);
router.post('/', createUser);
router.put('/:user_id', updateUser);
router.delete('/:user_id', deleteUser);


module.exports = router;
