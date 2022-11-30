const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');
const passport = require('passport');
const passportLocal = require('passport-local');
require('dotenv').config();


const MONGO_URL = process.env.MONGO_URL;
const app = express();

app.use(cors());
app.use(express.json());
mongoose.connect(MONGO_URL, () => {
  console.log('Connected to MongoDB');
  console.log(`MongoDB server: ${mongoose.connection.getClient() == undefined ? "Ninguno" : mongoose.connection.getClient().options.srvHost}`);
  mongoose.connection.getClient() != undefined ? console.log(`Models Currently in Database: ${mongoose.connection.modelNames()}`) : "";
}).catch((error) => {
  console.log("error");
  console.log(error);
  process.exit(1);
});

passport.use(
  'local',
  new passportLocal.Strategy(
    { usernameField: 'email' },
    (email, password, done) => {
      User.findOne({ email: email }, (err, user) => {
        if (err) {
          return done(err, false, { message: err.message });
        }
        if (!user) {
          return done(null, false, { message: 'User Not Registered' });
        }
        if (!User.checkPassword(password, user.password)) {
          return done(null, false, { message: 'Incorrect Password' });
        }
        return done(null, user, { message: 'Login Successful' });
      });
    }
  )
);

const users = require('./routes/users');
const categories = require('./routes/categories');
const products = require('./routes/products');
const reviews = require('./routes/reviews');
const carts = require('./routes/cart');

app.use('/users', users);
app.use('/products', products);
app.use('/reviews', reviews);
app.use('/carts', carts);
app.use('/categories', categories);

app.use((_, res) => {
  res.status(404).json({ error: "Not found" });
});

module.exports = app;