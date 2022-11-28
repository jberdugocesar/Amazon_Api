const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
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


app.use((_, res) => {
  res.status(404).json({ error: "Not found" });
});

module.exports = app;