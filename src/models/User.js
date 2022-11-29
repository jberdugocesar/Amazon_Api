const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  birthdate: {
    type: Date,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },

  productsOnSell: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Product'
    }
  ],

  cart: {
    type: Schema.Types.ObjectId,
    ref: 'Cart'
  }
  ,

  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Product'
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
