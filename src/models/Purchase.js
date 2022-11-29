const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PurchaseSchema = new Schema({
  cart: [{
    type: Schema.Types.ObjectId,
    required: [true, 'Please provide a list of products to purchase'],
    ref: 'Cart',
  }],
  purchaseDate: {
    type: Date,
    required: [true, "Please provide a date for this purchase"],
  }

}, { timestamps: true });

module.exports = mongoose.model('Purchase', PurchaseSchema);
