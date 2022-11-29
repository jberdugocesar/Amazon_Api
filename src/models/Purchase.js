const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PurchaseSchema = new Schema({
  products: [{
    type: Schema.Types.ObjectId,
    required: [true, 'Please provide a list of products to purchase'],
    ref: 'Product',
  }],
  purchaseDate: {
    type: Date,
    required: [true, "Please provide a date for this purchase"],
  },
  totalPrice: {
    type: Number,
  }

}, { timestamps: true });

module.exports = mongoose.model('Purchase', PurchaseSchema);
