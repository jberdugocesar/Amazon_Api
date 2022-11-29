const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  amount: {
    type: Number,
    required: [true, 'Please provide an amount'],
  },
  seller: {
    type: Schema.Types.ObjectId,
    required: [true, 'Please provide the user that will sell the product'],
    ref: 'User',
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review',
    }
  ],
  status: {
    type: String,
    required: [true, 'Please provide a status'],
  },
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
