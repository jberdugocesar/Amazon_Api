const User = require('../models/User');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Purchase = require('../models/Purchase');

async function addProductInCart(req, res) {
  const { product_id, user_id } = req.params;
  if (!user_id) return res.status(400).json({ error: 'Missing user_id' });

  if (!product_id) return res.status(400).json({ error: 'Missing product_id' });

  try {
    const user = await User.findById(user_id);
    const product = await Product.findById(user_id);

    user.cart.push(product);
    res.json({ user: user });
  } catch (error) {
    res.status(500).json({ error: 'Invalid user_id or product_id' });
  }

}

async function removeProductInCart(req, res) {
  const { product_id, user_id } = req.params;
  if (!user_id) return res.status(400).json({ error: 'Missing user_id' });

  if (!product_id) return res.status(400).json({ error: 'Missing product_id' });

  try {
    const user = await User.findById(user_id);

    user.products = user.products.filter(product => product._id != product_id);
    res.json({ user: user });
  } catch (error) {
    res.status(500).json({ error: 'Invalid user_id or product_id' });
  }


}


async function getUserCart(req, res) {
  const { user_id } = req.params;
  if (!user_id) return res.status(400).json({ error: 'Missing user_id' });

  try {
    const user = await User.findById(user_id);
    res.json({ cart: user.cart });
  } catch (error) {
    res.status(500).json({ error: 'Invalid user_id' });
  }

}



async function removeAllProductsInUserCart(req, res) {
  const { user_id } = req.params;
  if (!user_id) return res.status(400).json({ error: 'Missing user_id' });

  try {
    const user = await User.findById(user_id);


    res.json({ user: user });
  } catch (error) {
    res.status(500).json({ error: 'Invalid user_id' });
  }
}





module.exports = { addProductInCart, removeProductInCart, getUserCart, removeAllProductsInUserCart, /*PurchaseCart*/ }
