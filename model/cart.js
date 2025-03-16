const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products:[
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      title: { type: String },
      category: { type: String },
      imgUrl: { type: String },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Cart = mongoose.model("cart", cartSchema);

module.exports = Cart;
