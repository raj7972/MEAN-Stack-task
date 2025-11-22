const mongoose = require("../database");

const productSchema = new mongoose.Schema({
  name: String,
  availableStock: Number,
  reservedStock: Number
});

module.exports = mongoose.model("Product", productSchema);
