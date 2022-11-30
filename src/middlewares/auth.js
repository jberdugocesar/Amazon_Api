const User = require('../models/User');
const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
  let token;
  console.log(req.headers);
  console.log(req.body);
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = await User.findById(decoded._id).select('-password');
      next();
    } catch (err) {
      console.log(err)
      res.status(401).json({
        message: 'Not Authorized, Token Failed',
        success: false,
      });
    }
  }
  if (!token) {
    res.status(401).json({
      message: 'Not Authorized, No Token. Make sure to have an authorization header',
      success: false,
    });
  }
};

module.exports = protect;