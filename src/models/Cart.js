const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CartSchema = new Schema({

  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, "A cart requires an user"],
  },

  products: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],

}, { timestamps: true });

module.exports = mongoose.model('Cart', CartSchema);