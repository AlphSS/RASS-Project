const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Product name is required"],
  },
  productId: {
    type: String,
    required: [true, "Product ID is required"],
    unique: true,
  },
  imgUrl: {
    type: String,
    required: [true, "Image URL is required"],
  },
  category: {
    type: String,
    required: [true, "Category is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model("product", productSchema);

module.exports = Product;
