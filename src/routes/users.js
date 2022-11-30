const router = require('express').Router({ mergeParams: true });
const protect = require('../middlewares/auth');

const {
  registerUser, loginUser, getUser, getAllUsers, updateUser, deleteUser, loginUserWithID
} = require('../controllers/user');


router.get('/', getAllUsers);
router.get('/:user_id', getUser);
router.post('/register/', registerUser);
router.post('/login/', loginUser);
router.post('/login/:user_id', loginUserWithID);

//Requires Authentication
router.put('/:user_id', protect, updateUser);
router.delete('/:user_id', protect, deleteUser);


module.exports = router;
