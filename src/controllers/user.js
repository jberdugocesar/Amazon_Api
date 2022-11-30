const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Product = require('../models/Product');
const Review = require('../models/Review');
const User = require('../models/User');
const Cart = require('../models/Cart');
const Category = require('../models/Category');

//--Validacion de Usuario
const registerUser = async (req, res) => {
  const { username, email, password, birthdate } = req.body;
  if (!username || !email || !password || !birthdate) return res.status(400).json({ error: 'Missing user data' });

  const byEmail = await User.findOne({ email });
  if (byEmail) return res.status(400).json({ error: 'Email already in use' });

  const byUsername = await User.findOne({ username });
  if (byUsername) return res.status(400).json({ error: 'Username already in use' });

  await User.create(req.body, (err, user) => {
    if (err) {
      res.status(400).json({ message: err.message, success: false });
    } else {
      res.status(200).json({
        user: user,
        message: 'User Created Successfully',
        success: true,
      });
    }
  });
};

const loginUser = (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err | !user) {
      res.status(400).json({ message: info.message, success: false });
    } else {
      const { password, ..._user } = user.toObject();
      const token = jwt.sign(_user, process.env.JWT_SECRET_KEY);
      res.status(200).json({
        message: 'Login Successful',
        success: true,
        data: _user,
        token,
      });
    }
  })(req, res, next);
};

const loginUserWithID = async (req, res, next) => {
  const { user_id } = req.params;
  if (!user_id) return res.status(400).json({ error: 'Missing user_id' });

  try {
    const user = await User.findById(user_id);
    const { password, ..._user } = user.toObject();
    const token = jwt.sign(_user, process.env.JWT_SECRET_KEY);
    res.status(200).json({
      message: 'Login Successful',
      success: true,
      data: _user,
      token,
    });

  } catch (error) {
    res.status(400).json({ message: "Invalid user_id", success: false });
  }
  (req, res, next);
};


//--CRUD de Usuario
async function getAllUsers(_, res) {
  try {
    const users = await User.find();
    res.json({ users });
  } catch (error) {
    res.status(400).json({ error: 'Error getting users' });
  }
}

async function getUser(req, res) {
  const { user_id } = req.params;
  if (!user_id) return res.status(400).json({ error: 'Missing user_id' });

  try {
    const user = await User.findById(user_id);
    if (user == undefined) return res.status(500).json({ error: 'User not found' });

    res.json({ user });
  } catch (error) {
    res.status(400).json({ error: 'Invalid user_id' });
  }
}




async function updateUser(req, res) {
  const { user_id } = req.params;
  const { username, email, password, birthdate } = req.body;
  if (!user_id) return res.status(400).json({ error: 'Missing user_id' });
  if (!username && !email && !password && !birthdate) return res.status(400).json({ error: 'Missing user data' });

  try {
    const user = await User.findById(user_id);
    if (user == undefined) return res.status(500).json({ error: 'User not found' });

    const data = {
      username: username || user.username,
      email: email || user.email,
      password: password || user.password,
      birthdate: birthdate || user.birthdate
    }

    data.password = bcrypt.hashSync(data.password, 10);
    const updatedUser = await User.findByIdAndUpdate(user_id, data, { new: true });
    res.json({ user: updatedUser });
  } catch (error) {
    res.status(400).json({ error: 'Invalid user_id or data' });
  }
}

async function deleteUser(req, res) {
  const { user_id } = req.params;
  if (!user_id) return res.status(400).json({ error: 'Missing user_id' });

  try {

    const user = await User.findById(user_id);

    if (user == undefined) return res.status(500).json({ error: 'User not found' });

    user.productsOnSell.map(async product => {

      const removeProduct = await Product.findById(product);

      //removiendo los productos en doc categorias
      await Category.findByIdAndUpdate(removeProduct.category, {
        $pull: { "products": product }
      })
      //removiendo los productos en doc productos
      await Product.findByIdAndDelete(product);

    });

    //Removiendo las review en cada producto
    user.reviews.map(async review => await Product.findByIdAndUpdate(review.product, { $pull: { 'reviews': review } }));

    //Removiendo las review en el doc de Review
    user.reviews.map(async review => await Review.findByIdAndDelete(review));

    //Removiendo carrito en el doc de Cart
    await Cart.findByIdAndDelete(user.cart);
    await User.findByIdAndDelete(user_id);

    res.json({ user });
  } catch (error) {
    res.status(400).json({ error: "Invalid user_id" });
  }
}

module.exports = { registerUser, loginUserWithID, loginUser, getAllUsers, getUser, updateUser, deleteUser };
