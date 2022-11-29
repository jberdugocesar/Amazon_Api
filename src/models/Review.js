const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide the user'],
  },
  body: {
    type: String
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Please provide the product'],
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, "Please provide the rating"]
  },
});

module.exports = mongoose.model('Review', ReviewSchema);
