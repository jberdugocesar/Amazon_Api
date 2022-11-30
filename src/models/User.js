const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
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
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Product'
    }],
  purchases: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Purchase'
    }]

}, { timestamps: true });

UserSchema.pre('save', function (next) {
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

UserSchema.statics.checkPassword = function (pass, hashedPass) {
  return bcrypt.compareSync(pass, hashedPass);
};

module.exports = mongoose.model('User', UserSchema);
